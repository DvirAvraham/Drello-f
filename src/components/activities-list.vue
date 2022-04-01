<template>
    <section>
        <ul v-if="task.activities?.length" class="comment-text">
            <li
                v-for="activity in task.activities"
                :key="activity._id"
                :class="{ open: activity.isEditing }"
            >
                <avatar class="activity-avatar" size="32" :name="activity.byMember.fullname"></avatar>
                <div :class="{ activity: activity.isComment }">
                    <span class="member">{{ activity.byMember.username }}</span>
                    <timeago class="time" :datetime="activity.createdAt" />
                </div>
                <div class="try" :class="{ open: activity.isEditing }">
                    <div class="task-activity-txt" :class="{ open: activity.isEditing }">
                        <input
                            v-model="activity.txt"
                            type="text"
                            v-click-outside="closeComment"
                            @input="findMembers(activity._id)"
                        />
                    </div>
                    <comment-actions
                        :pp="activity._id"
                        :popo="isEditing"
                        v-if="activity.isEditing"
                        :class="{ open: activity.isEditing }"
                        class="comments-main-container flex space-between"
                        @updateItem="updateItem"
                    />
                </div>
                <div class="comment-btns">
                    <button
                        v-if="activity.isEditing"
                        class="close-comment-edit"
                        @click="updateItem(activity._id, false)"
                    ></button>

                    <a
                        v-if="!activity.isEditing && user._id === activity.byMember._id"
                        @click="(isEditing = true), (updateItem(activity._id, true))"
                    >Edit</a>
                    <span v-if="!activity.isEditing && user._id === activity.byMember._id">-</span>
                    <a
                        v-if="!activity.isEditing && user._id === activity.byMember._id"
                        @click="deleteItem(activity._id)"
                    >Delete</a>
                </div>
            </li>
        </ul>
    </section>
</template>

<script>
import { comment } from 'postcss'
import commentActions from './comment-actions.vue'
export default {
    name: 'activities-list',
    props: {
        task: Object,
        user: Object,
        memberToAdd: Object,
    },
    data() {
        return {
            isEditing: '',
            txt: [],
            lastAtIndex: 0,
            currActivityId: '',
        }
    },
    methods: {
        findMembers(id) {
            this.$emit('findMembers', id)
        },

        closeComment() {
            if (this.isEditing)
                this.isEditing = false
            this.$emit('closeComment')
        },
        deleteItem(id) {
            var comment = {
                _id: id
            }
            this.$emit('updateItem', { type: 'comment', val: JSON.parse(JSON.stringify(comment)) });
        },
        updateItem(id, isEditingCurrTask) {
            this.currActivityId = id
            var currTask = JSON.parse(JSON.stringify(this.task));
            var comment = currTask.activities.find(comment => comment._id === id);
            // if (this.memberToAdd && this.isEditing) comment.txt += this.memberToAdd.username
            comment.isEditing = isEditingCurrTask;
            this.$emit('updateItem', { type: 'comment', val: JSON.parse(JSON.stringify(comment)) });
            this.txt = '';
        }
    },
    components: {
        commentActions,
    },
    watch: {
        'memberToAdd'() {
            if (this.isEditing) {
                this.updateItem(this.currActivityId, true)
            }
        },

    }
}
</script>

<style>
.comment-text li.open {
    height: 106px;
}

.try.open {
    border-radius: 3px;
    box-shadow: 0 1px 3px #091e4240, 0 0 0 1px #091e4214;
}
</style>
