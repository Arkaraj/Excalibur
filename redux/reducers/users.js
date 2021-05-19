import {
  users_data_state_change,
  user_posts_state_change,
  user_following_state_change,
} from "../constants/index";
// Like a constructor
const initialState = {
  users: [],
  userLoaded: 0,
};

export const users = (state = initialState, action) => {
  switch (action.type) {
    case users_data_state_change:
      return {
        ...state,
        users: [...state.users, action.user],
      };
    default:
      return state;
  }
};
