import {
  user_state_change,
  user_posts_state_change,
  user_following_state_change,
} from "../constants/index";
// Like a constructor
const initialState = {
  currentUser: null,
  posts: [],
  following: [],
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
    case user_following_state_change:
      return {
        ...state,
        following: action.following,
      };
    default:
      return state;
  }
};
