<template lang="">
    <section class="workspace-container main-layout">
        <h2>Workspace</h2>

		<h3><span class="icon-member"></span>Starred Boards</h3>
        <board-list @toggleFavorite="toggleFavorite" :boards="starredBoards"></board-list>

		<h3><span class="icon-member"></span>Recent Boards</h3>
		<board-list @toggleFavorite="toggleFavorite" :boards="recentBoards"></board-list>

		<h3><span class="icon-members"></span>All boards in this Workspace</h3>
		<board-list @toggleFavorite="toggleFavorite" :boards="boards"></board-list>

    </section>
</template>
<script>
import workspaceFilter from '../components/workspace-filter.vue';
import boardList from '../components/board-list.vue';
import { boardService } from '../services/board-service.js';

export default {
	name: 'workspace',
	async created() {
		await this.$store.dispatch({ type: 'loadBoards' })
	},
	methods: {
		async toggleFavorite(id) {
			const board = await boardService.getBoardById(id)
			board.isFavorite = !board.isFavorite
			this.$store.dispatch({ type: 'saveBoard', board })
		}
	},
	computed: {
		user() {
			return this.$store.getters.user;
		},
		boards() {
			return this.$store.getters.boards
		},
		starredBoards() {
			return this.boards.filter(board => board.isFavorite)
		},
		otherBoards() {
			return this.boards.filter(board => !board.isFavorite)
		},
		recentBoards() {
			return this.user.recentBoards.map(boardId => this.boards.find(board => board._id === boardId))
		}
	},
	components: {
		workspaceFilter,
		boardList
	}
}
</script>
