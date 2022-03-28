import { userService } from '../../services/user-service';
// import { userManageService } from '../../services/user-manage-service';
import { utilService } from '../../services/utils-service';

export default {
  state: {
    loggedinUser: userService.getLoggedinUser(),
    allUsers: []
  },
  getters: {
    user(state) {
      return state.loggedinUser;
    },
    getAllUsers(state) {
      return state.allUsers;
    },
    miniUser({ loggedinUser }) {
      const miniUser = {
        _id: loggedinUser._id,
        fullname: loggedinUser.fullname,
        username: loggedinUser.username,
        imgUrl: loggedinUser.imgUrl,
      };
      return miniUser;
    },
  },
  mutations: {
    setLoggedinUser(state, { user }) {
      state.loggedinUser = user;
    },
    setUsers(state, { users }) {
      state.allUsers = users;
    },
  },
  actions: {
    async loadUsers({ commit, state }) {
      try {
        const users = await userService.getUsers();
        commit({ type: 'setUsers', users });
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    async login({ commit }, { cred }) {
      try {
        const user = await userService.login(cred);
        commit({ type: 'setLoggedinUser', user });
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    async signup({ commit }, { cred }) {
      try {
        const user = await userService.signup(cred);
        commit({ type: 'setLoggedinUser', user });
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    async logout({ commit }) {
      try {
        await userService.logout();
        commit({ type: 'setLoggedinUser', user: null });
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  },
};
