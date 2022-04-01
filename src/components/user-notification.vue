<template >
    <section class="board-filter">
        <ul v-if="activities">
            <li v-for="activity in activities" :key="activity._id">
                <avatar size="24" name="D A"></avatar>
                <span>Dvir Avraham</span>
                <div>{{ activity.txt }}</div>
                <div>{{ activity.createdAt }}</div>
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
        const userId = this.$store.getters.user._id
        const user = await userService.getUserById(userId)
        this.userActivities = user.activities
    },
    computed: {
        activities() {
            // let userId = this.$store.getters.user._id
            // return userService.getUserById(userId).activities
            return this.$store.getters.userActivities

        }
    }


}
</script>