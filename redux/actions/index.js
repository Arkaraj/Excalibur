import {
  user_state_change,
  user_posts_state_change,
  user_following_state_change,
  users_posts_state_change,
  users_data_state_change,
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
          dispatch(fetchUsersData(following[i], true));
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
        const uid = snapshot.query.EP.path.segments[1];
        console.log({ snapshot, uid });
        const user = getState().usersState.users.find((el) => el.uid === uid);

        let posts = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data, user };
        });

        dispatch({ type: users_posts_state_change, uid, posts });
      });
  };
};
