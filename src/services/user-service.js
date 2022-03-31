import { httpService } from './http-service.js';
const ENDPOINT = 'auth';

const LOGGEDIN_USER_KEY = 'loggedinUser';

export const userService = {
  login,
  signup,
  logout,
  getLoggedinUser,
  getUsers,
  getUserById,
  getGuestUser
};

function getUsers() {
  return httpService.get(`user`);
}

async function getUserById(userId) {
  const user = await httpService.get(`user/${userId}`)
  // gWatchedUser = user;
  return user;
}

async function login(cred) {
  const user = await httpService.post(ENDPOINT + '/login', cred)
  // socketService.emit('set-user-socket', user._id);
  if (user) return _saveLocalUser(user)
}

async function signup(cred) {
  const user = await httpService.post(ENDPOINT + '/signup', cred)
  return _saveLocalUser(user)
}

function logout() {
  sessionStorage.removeItem(LOGGEDIN_USER_KEY);
  return httpService.post(ENDPOINT + '/logout');
}

function getGuestUser() {
  return {
    fullname: 'Guest',
    username: 'guest',
    password: 'guest',
  };
}

function _saveLocalUser(user) {
  const { activities, ...userToSave } = user;
  sessionStorage.setItem(LOGGEDIN_USER_KEY, JSON.stringify(userToSave))
  return user
}

function getLoggedinUser() {
  return JSON.parse(sessionStorage.getItem(LOGGEDIN_USER_KEY) || 'null')
}