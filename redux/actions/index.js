import {
  user_state_change,
  user_posts_state_change,
  user_following_state_change,
  users_posts_state_change,
  users_data_state_change,
  users_likes_state_change,
  clear_data,
} from "../constants/index";
import firebase from "firebase";

export const fetchUser = () => {
  return (dispatch) => {
    firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          // console.log(snapshot);
          dispatch({ type: user_state_change, currentUser: snapshot.data() });
        } else {
          console.log("User does not exist");
        }
      });
  };
};

export const fetchUserPosts = () => {
  return (dispatch) => {
    firebase
      .firestore()
      .collection("posts")
      .doc(firebase.auth().currentUser.uid)
      .collection("userPosts")
      .orderBy("creationDate", "asc")
      .get()
      .then((snapshot) => {
        let posts = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });

        dispatch({ type: user_posts_state_change, posts });
      });
  };
};

export const fetchUserFollowing = () => {
  return (dispatch) => {
    firebase
      .firestore()
      .collection("following")
      .doc(firebase.auth().currentUser.uid)
      .collection("userFollowing")
      .onSnapshot((snapshot) => {
        let following = snapshot.docs.map((doc) => {
          const id = doc.id;
          return id;
        });

        dispatch({ type: user_following_state_change, following });
        for (let i = 0; i < following.length; i++) {
          dispatch(fetchUserData(following[i], true));
        }
      });
  };
};

export const fetchUserData = (uid, getPosts) => {
  return (dispatch, getState) => {
    const found = getState().usersState.users.some((el) => el.uid === uid);

    if (!found) {
      firebase
        .firestore()
        .collection("users")
        .doc(uid)
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            let user = snapshot.data();
            user.uid = snapshot.id;

            // for (let i = 0; i < posts.length; i++) {
            //   dispatch(fetchUsersFollowingLikes(uid, posts[i].id));
            // }

            dispatch({ type: users_data_state_change, user });
          } else {
            console.log("User does not exist");
          }
          if (getPosts) {
            dispatch(fetchUserFollowingPosts(uid));
          }
        });
    }
  };
};

export const fetchUserFollowingPosts = (uid) => {
  return (dispatch, getState) => {
    firebase
      .firestore()
      .collection("posts")
      .doc(uid)
      .collection("userPosts")
      .orderBy("creationDate", "asc")
      .get()
      .then((snapshot) => {
        // const uid = snapshot.query.EP.path.segments[1];
        const uid = snapshot.docs[0].ref.path.split("/")[1];
        console.log(uid);
        // console.log({ snapshot, uid });
        const user = getState().usersState.users.find((el) => el.uid === uid);

        let posts = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data, user };
        });

        for (let i = 0; i < posts.length; i++) {
          dispatch(fetchUserFollowingLikes(uid, posts[i].id));
        }
        dispatch({ type: users_posts_state_change, uid, posts });
      });
  };
};
export const fetchUserFollowingLikes = (uid, postId) => {
  return (dispatch, getState) => {
    firebase
      .firestore()
      .collection("posts")
      .doc(uid)
      .collection("userPosts")
      .doc(postId)
      .collection("likes")
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((snapshot) => {
        // const postId = snapshot.ZE.path.segments[3];
        console.log(snapshot.ref.path.split("/")[3]);
        const postId = snapshot.ref.path.split("/")[3];

        let currentUserLike = snapshot.exists; // ?true:false

        dispatch({ type: users_likes_state_change, postId, currentUserLike });
      });
  };
};

export const clearData = () => {
  return (dispatch) => {
    dispatch({ type: clear_data });
  };
};
