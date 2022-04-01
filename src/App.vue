<template>
	<div class="wrapper" :style="boardStlye">
		<app-header v-if="!isHomePage" />
		<router-view />
	</div>
</template>

<script>
import appHeader from './components/main-header.vue'
import { socketService } from './services/socket-service';
import { userService } from './services/user-service.js';
import { ElNotification } from 'element-plus'


export default {
	name: 'app',
	async created() {
		socketService.off('notify activity')
		socketService.on('notify activity', this.notifyActivity)
		try {
			await this.$store.dispatch({ type: 'loadUsers' })
			if (this.miniUser) socketService.emit('set-user-socket', this.miniUser._id)
		} catch (err) {
			console.log(err)
		}
	},
	methods: {
		getBoardById(id) {
			return this.boards.find(board => board._id === id)
		},
		getMemberById(id) {
			return this.users.find(user => user._id === id)
		},
		notify(isPrivate = null, title, message) {
			if (isPrivate) {
				ElNotification({
					title,
					message,
					dangerouslyUseHTMLString: true,
					type: 'success',
				})
			} else ElNotification({
				title,
				message,
				dangerouslyUseHTMLString: true,
				type: 'info',
			})
		},
		notifyActivity(activity) {
			console.log('activity', activity)
			// let toMember = ''
			const itemName = activity.item?.taskTitle || activity.item?.taskGroup
			let title
			let message
			const byMember = this.getMemberById(activity.byMemberId).fullname
			const board = this.getBoardById(activity.boardId)
			if (activity.toMemberId) {
				title = "You've been tagged"
				message = byMember + ' just ' + ' tagged you at ' + "'" + "' at " + `<a href=http://localhost:3000/#/board/${activity.boardId}> board ${board.title} </a>`
				if (userService.getLoggedinUser()._id === activity.toMemberId) {
					this.notify(true, title, message)
				}
			} else {
				title = activity.txt
				message = byMember + ' just ' + title + ' to ' + `<a href=http://localhost:3000/#/board/${activity.boardId}> board ${board.title} </a>`
				this.notify(null, title, message)
			}
		},
	},
	computed: {
		boards() {
			return this.$store.getters.boards;
		},
		users() {
			return this.$store.getters.getAllUsers;
		},
		miniUser() {
			return this.$store.getters.miniUser;
		},
		currBoardStyle() {
			return this.$store.getters.currBoard?.style?.bgColor
		},
		currBoard() {
			return this.$store.getters.currBoard?.style
		},
		boardStlye() {
			return { 'background-color': this.currBoard?.bgColor, 'background-image': 'url(' + this.currBoard?.bgImg + ')' }
		},
		isHomePage() {
			return this.$store.getters.isHomePage
		}
	},
	components: {
		appHeader,
	},
}

</script>

