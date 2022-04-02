<template >
    <section class="board-filter">
        <ul v-if="activities" :class="{ 'red-bg': isReaden }">
            <li v-for="(activity, idx) in activities" :key="idx">
                <avatar size="24" name="D A"></avatar>
                <span>Dvir Avraham</span>
                <div>{{ activity.txt }}</div>
                <div>{{ activity.createdAt }}</div>
                <button
                    @click="toggleReaden(activity._id)"
                    :class="{ 'green-bg': !activity.isReaden }"
                >check readen</button>
            </li>
        </ul>
    </section>
</template>
<script>
import { userService } from '../services/user-service.js'
export default {
    name: 'notify-user',

    data() {
        return {
            // userActivities: null,
        }
    },
    async created() {
        // const userId = this.$store.getters.user._id
        // const user = await userService.getUserById(userId)
        // console.log('user: ', user)
        // this.userActivities = user.activities
        // console.log('userActivities: ', this.userActivities)
    },
    methods: {
        async toggleReaden(activityId) {
            await this.$store.dispatch({ type: 'toggleActivity', activityId })
        }
    },
    computed: {
        activities() {
            // let userId = this.$store.getters.user._id
            // return userService.getUserById(userId).activities
            console.log('user', this.$store.getters.user)
            console.log('activities', this.$store.getters.user?.activities)
            return this.$store.getters.user?.activities
        },
        isReaden() {
            return this.$store.getters.user?.activities.some(activity => !activity.isReaden)
        }
    }


}
</script>

<style>
.red-bg {
    background-color: red;
}
.green-bg {
    background-color: green;
}
</style>