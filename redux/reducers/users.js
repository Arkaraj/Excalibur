import {
  users_data_state_change,
  users_likes_state_change,
  users_posts_state_change,
  clear_data,
} from "../constants/index";
// Like a constructor
const initialState = {
  users: [],
  feed: [],
  usersLoaded: 0, // users Following Loaded
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
        feed: [...state.feed, ...action.posts],
      };
    case users_likes_state_change:
      return {
        ...state,
        feed: state.feed.map((post) =>
          post.id == action.postId
            ? { ...post, currentUserLike: action.currentUserLike }
            : post
        ),
      };
    case clear_data:
      return initialState;
    default:
      return state;
  }
};
