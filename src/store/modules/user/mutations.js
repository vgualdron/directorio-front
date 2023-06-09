import types from './types';

export default {
  [types.mutations.SET_USERS](state, payload) {
    state.users = payload;
  },
  [types.mutations.SET_STATUS_ADD_USER](state, payload) {
    state.statusAddUser = payload;
  },
  [types.mutations.SET_STATUS_CHANGE_PASSWORD_USER](state, payload) {
    state.statusChangePasswordUser = payload;
  },
};
