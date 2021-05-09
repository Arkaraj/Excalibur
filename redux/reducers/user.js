import { user_state_change, user_posts_state_change } from "../constants/index";
// Like a constructor
const initialState = {
  currentUser: null,
  posts: [],
};

export const user = (state = initialState, action) => {
  switch (action.type) {
    case user_state_change:
      return {
        ...state,
        currentUser: action.currentUser,
      };
    case user_posts_state_change:
      return {
        ...state,
        posts: action.posts,
      };
    default:
      return state;
  }
};
