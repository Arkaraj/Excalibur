import { user_state_change } from "../constants/index";
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
          console.log(snapshot);
          dispatch({ type: user_state_change, currentUser: snapshot.data() });
        } else {
          console.log("User does not exist");
        }
      });
  };
};
