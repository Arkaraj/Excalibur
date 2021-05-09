import { user_state_change, user_posts_state_change } from "../constants/index";
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
