<template>
	<section class="board-header-title">
		<input
			type="text"
			:size="inputSize"
			v-model="titleToEdit"
			class="inline-input"
			:class="{ editable: isEditAble }"
			:disabled="!isEditAble"
			@blur="editTitle"
		/>
	</section>
</template>

<script>
export default {
	name: 'board-header-title',
	props: {
		title: String,
		createdBy: String
	},
	data() {
		return {
			titleToEdit: this.title
		}
	},
	methods: {
		editTitle() {
			if (!this.titleToEdit) return this.titleToEdit = this.title;
			if (!this.isEditAble) return;
			this.$emit('editTitle', this.titleToEdit);
		}
	},
	computed: {
		userId() {
			return this.$store.getters.miniUser?._id;
		},
		isEditAble() {
			return this.createdBy === this.userId;
		},
		inputSize() {
			const MAX_SIZE = 60;
			const MIN_SIZE = 1;
			const size = this.titleToEdit.length - 2;

			if (size < MIN_SIZE) return MIN_SIZE;
			else if (size > MAX_SIZE) return MAX_SIZE;
			return size;
		}
	}
}
</script>
