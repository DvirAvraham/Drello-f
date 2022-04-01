<template>
	<section v-if="currBoard" class="board-container">
		<board-header
			@setBg="setBg"
			:board="currBoard"
			@editTitle="editBoardTitle"
			@addMember="addMember"
			@toggleFavorite="toggleFavorite"
			@setFilter="setFilter"
			:filterBy="filterBy"
		/>
		<section class="group-container-scrollable">
			<board-group
				@removeTask="removeTask"
				@addTask="setTask"
				@editTask="editTask"
				@taskChange="taskChange"
				@columnChange="columnChange"
				@addGroup="addGroup"
				@editGroup="editGroup"
				@cleanStore="cleanStore"
				:groups="groupsToDisplay"
				:board="currBoard"
			/>
		</section>
	</section>
</template>

<script>
import { nextTick } from 'vue'
import boardGroup from '../components/board-group.vue';
import { socketService } from '../services/socket-service.js';
import { boardService } from '../services/board-service';
import boardHeader from '../components/board-header.vue'

export default {
	name: 'board-details',
	components: {
		boardGroup,
		boardHeader
	},
	data() {
		return {
			// board: null,
			filterBy: {
				title: '',
				labels: [],
				members: [],
				dueDate: [],
			}
		};
	},

	watch: {
		'$route.params.boardId': {
			immediate: true,
			async handler(newId, oldId) {
				await this.$store.dispatch({
					type: 'setCurrentBoard',
					boardId: newId,
				});
				// this.board = this.currBoard;
			},
			deep: true,
		}
	},
	async created() {
		await this.loadBoard()
		// this.board = this.currBoard;
		// const { boardId } = this.$route.params;
		// socketService.emit("board topic", boardId);

		// socketService.on('board update', this.loadBoard())
	},
	unmounted() {
		this.$store.commit({ type: 'setCurrentBoard', board: null })
	},
	methods: {
		async loadBoard() {
			try {
				const boardId = this.$route.params.boardId;
				await this.$store.dispatch({
					type: 'setCurrentBoard',
					boardId,
				});
				this.$store.commit({ type: 'addRecentBoard', boardId })
				this.board = null;
				await nextTick();
			} catch (err) {
				console.log('err', err)
			}
		},
		removeTask(task) {
			this.$store.dispatch({
				type: 'removeTask',
				task,
			});
		},
		setTask({ title, groupId }) {
			var task = { title };
			this.$store.dispatch({ type: 'setTask', groupId, task, });
		},
		editTask(editedTask) {
			this.$store.dispatch({ type: 'setTask', task: editedTask });
		},
		quickUpdateTask() {
			this.$store.dispatch({ type: 'setTask', task: editedTask });
		},
		addGroup(groupTitle) {
			this.$store.dispatch({ type: 'addGroup', groupTitle })
		},
		editGroup({ groupIdx, newGroup }) {
			this.$store.dispatch({ type: 'setGroup', groupIdx, newGroup })
		},
		columnChange(boardGroups) {
			this.$store.dispatch({ type: 'setGroups', groups: boardGroups });
		},
		taskChange({ groupIdx, newGroup }) {
			this.$store.dispatch({ type: 'setGroup', groupIdx, newGroup });
		},
		editBoardTitle(newTitle) {
			this.$store.dispatch({ type: 'setBoardPrefs', key: 'title', val: newTitle });
		},
		toggleFavorite(isFavorite) {
			this.$store.dispatch({ type: 'setBoardPrefs', key: 'isFavorite', val: isFavorite });
		},
		cleanStore(itemsToClean) {
			itemsToClean.forEach(item => {
				const toCommit = {
					type: `setCurr${item}`
				}
				toCommit[item.toLowerCase()] = null;
				this.$store.commit(toCommit)
			})
		},
		async addMember(members) {
			await this.$store.dispatch({ type: 'setBoardPrefs', key: 'members', val: members });
			// this.board = this.currBoard
		},
		async setBg(bg) {
			const board = JSON.parse(JSON.stringify(this.currBoard))
			board.style[bg.type] = bg.val
			if (bg.type === 'bgColor') board.style.bgImg = ''
			await this.$store.dispatch({ type: 'saveBoard', board: board })
			await this.$store.dispatch({
				type: 'setCurrentBoard',
				boardId: board._id,
			});
		},
		setFilter(filterBy) {
			const copyfilter = JSON.parse(JSON.stringify(filterBy))
			this.filterBy = copyfilter;
		},
	},
	computed: {
		miniUser() {
			return this.$store.getters.miniUser;
		},
		groups() {
			return this.$store.getters.boardGroups;
		},
		currBoard() {
			return this.$store.getters.currBoard;
		},
		groupsToDisplay() {
			let filteredGroups = [];
			const board = JSON.parse(JSON.stringify(this.currBoard))
			const regex = new RegExp(this.filterBy.title, 'i')
			filteredGroups = board.groups.filter((group) => regex.test(group.title) || group.tasks.some(task => regex.test(task.title)))
			if (this.filterBy.members.length) {
				filteredGroups = filteredGroups.filter(group => {
					return group.tasks.some(task => {
						return task.members?.some(member => {
							return this.filterBy.members.includes(member._id)
						})
					})
				})
				filteredGroups = filteredGroups.map(group => {
					group.tasks = group.tasks.filter(task => {
						if (!task.members) task.members = []
						return task.members?.some(member => this.filterBy.members.includes(member._id))
					})
					return group
				})
			}

			if (this.filterBy.labels.length) {
				filteredGroups = filteredGroups.filter(group => {
					return group.tasks.some(task => {
						return task.labelIds?.some(label => {
							return this.filterBy.labels.includes(label)
						})
					})
				})
				filteredGroups = filteredGroups.map(group => {
					group.tasks = group.tasks.filter(task => {
						if (this.filterBy.labels.includes('none')) {

						}
						return task.labelIds?.some(label => {
							if (label === 'none') return
							return this.filterBy.labels.includes(label)
						})
					})
					return group
				})
			}

			if (this.filterBy.dueDate) {
				if (this.filterBy.dueDate === 'overdue') {
					filteredGroups = filteredGroups.filter(group => {
						return group.tasks.some(task => task.status === 'overdue')
					})
				}
			}
			return filteredGroups
		}
	}
}
</script>


<style>
.toast {
	width: 20%;
	height: 70px;
	background-color: #0079bf;
}
</style>