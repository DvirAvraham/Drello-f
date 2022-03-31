<template>
  <header class="main-header flex space-between" :class="{ 'header-bg-color': isBoard }">
    <div class="flex">
      <span class="menu-btn"></span>
      <section class="header-logo flex align-items" @click="home">
        <svg
          aria-hidden="true"
          focusable="false"
          data-prefix="fab"
          data-icon="trello"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
          class="trello-icon svg-inline--fa fa-trello fa-w-14 logo-img"
        >
          <path
            fill="currentColor"
            d="M392.3 32H56.1C25.1 32 0 57.1 0 88c-.1 0 0-4 0 336 0 30.9 25.1 56 56 56h336.2c30.8-.2 55.7-25.2 55.7-56V88c.1-30.8-24.8-55.8-55.6-56zM197 371.3c-.2 14.7-12.1 26.6-26.9 26.6H87.4c-14.8.1-26.9-11.8-27-26.6V117.1c0-14.8 12-26.9 26.9-26.9h82.9c14.8 0 26.9 12 26.9 26.9v254.2zm193.1-112c0 14.8-12 26.9-26.9 26.9h-81c-14.8 0-26.9-12-26.9-26.9V117.2c0-14.8 12-26.9 26.8-26.9h81.1c14.8 0 26.9 12 26.9 26.9v142.1z"
            class
          />
        </svg>
        <span class="logo">Drello</span>
      </section>

      <div class="create-board-container flex align-items">
        <button
          class="create-btn"
          @click="isCreateBoard = !isCreateBoard"
          :class="{ 'light-btn-bg': isBoard }"
        >
          <p>Create</p>
          <span class="icon-plus"></span>
        </button>
        <createBoard @closeCreateModal="isCreateBoard = false" v-if="isCreateBoard"></createBoard>
      </div>
    </div>

    <section class="secondery-container flex align-items">
      <!-- <button v-if="user" @click="logout">LOGOUT</button> -->
      <div class="main-header-input flex" :class="{ focused: isInputFocused }" @click="focusInput">
        <span class="icon-search flex"></span>
        <input
          v-model="search"
          @blur="isInputFocused = false;"
          ref="headerInput"
          placeholder="Search"
        />
      </div>
      <span class="icon icon-info"></span>
      <span class="icon icon-bell"></span>
      <!-- <i class="fa-regular fa-bell notification-header"></i> -->
      <avatar v-if="user" size="32" color="white" :name="user.fullname" class="avatar-header"></avatar>
    </section>
  </header>
</template>


<script>
import { Search } from '@element-plus/icons-vue';
import createBoard from './create-board.vue';
import Avatar from 'vue3-avatar';

export default {
  data() {
    return {
      search: '',
      isCreateBoard: false,
      isInputFocused: false,
      Search,
    };
  },
  methods: {
    home() {
      this.$router.push('/board');
    },
    focusInput() {
      this.$refs.headerInput.focus();
      this.isInputFocused = true;
    },
    async logout() {
      await this.$store.dispatch({ type: 'logout' });
      this.$router.push('/login');
    }
  },
  computed: {
    user() {
      return this.$store.getters.user;
    },
    isBoard() {
      return this.$store.getters.currBoard
    }
  },
  components: {
    createBoard,
    Avatar,
  },
};
</script>

<style>
.main-input {
  cursor: pointer;
  height: 32px;
  border-radius: 3px;
  padding: 6px;
  border: none;
  box-shadow: inset 0 0 0 2px #dfe1e6;
  flex: 1;
  max-width: 200px;
  color: #172b4d;
  outline: 0;
}
</style>
