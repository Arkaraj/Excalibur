import {
  users_data_state_change,
  users_posts_state_change,
} from "../constants/index";
// Like a constructor
const initialState = {
  users: [],
  usersLoaded: 0,
};

export const users = (state = initialState, action) => {
  switch (action.type) {
    case users_data_state_change:
      return {
        ...state,
        users: [...state.users, action.user],
      };
    case users_posts_state_change:
      return {
        ...state,
        usersLoaded: state.usersLoaded + 1,
        users: state.users.map((user) =>
          user.uid == action.uid ? { ...user, posts: action.posts } : user
        ),
      };
    default:
      return state;
  }
};
