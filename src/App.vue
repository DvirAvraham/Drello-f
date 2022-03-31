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
		await this.$store.dispatch({ type: 'loadUsers' })
		if (!this.miniUser) await this.$store.dispatch({ type: 'login', cred: userService.getGuestUser() });
		await this.$store.dispatch({ type: 'loadBoards' })
	},
	methods: {
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
			const byMember = activity.byMember.fullname
			const toMember = activity.to
			const boardName = activity.boardTitle
			const itemName = activity.item?.taskTitle || activity.item?.taskGroup
			let title
			let message
			if (activity.toMember?._id) {
				title = "you've been tagged"
				message = byMember + ' just ' + ' tagged you at ' + "'" + itemName + "' at " + boardName + ' board'
				if (userService.getLoggedinUser()._id === activity.toMember._id) {
					this.notify(true, title, message)
					console.log('hi', userService.getLoggedinUser().fullname)
				}
			} else {
				title = activity.txt
				message = byMember + ' just ' + title + ' to ' + "<a href=`http://localhost:3000/#/board/${activity.boardId}` ></a>" + boardName + ' board'
				this.notify(null, title, message)
				console.log('hi everyone')
			}
		},
	},
	computed: {
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

