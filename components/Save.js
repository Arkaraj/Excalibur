import React from "react";
import { View, TextInput, Button, Image } from "react-native";
import firebase from "firebase";
require("firebase/firestore");
require("firebase/firebase-storage");

const Save = ({ navigation, route }) => {
  const [caption, setCaption] = React.useState("");

  const uploadImageToFirebase = async () => {
    const path = `post/${
      firebase.auth().currentUser.uid
    }/${Math.random().toString(36)}`;
    const uri = route.params.image;
    const res = await fetch(uri);

    const blob = await res.blob();
    const task = firebase.storage().ref().child(path).put(blob);

    const taskProgress = () => {
      console.log(`Transferred ${task.snapshot.bytesTransferred}`);
    };

    const taskCompleted = () => {
      task.snapshot.ref.getDownloadURL().then((snapshot) => {
        savePostData(snapshot);
        console.log(snapshot);
      });
    };

    const taskError = () => {
      console.log(task.snapshot);
    };

    task.on("state_changed", taskProgress, taskError, taskCompleted);
  };

  const savePostData = async (snapshot) => {
    firebase
      .firestore()
      .collection("posts")
      .doc(firebase.auth().currentUser.uid)
      .collection("userPosts")
      .add({
        snapshot,
        caption,
        creationDate: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        navigation.popToTop();
      });
  };

  console.log(route.params.image);
  return (
    <View style={{ flex: 1 }}>
      <Image source={{ uri: route.params.image }} style={{ flex: 1 }} />
      <TextInput
        placeholder="Caption..."
        onChangeText={(caption) => setCaption(caption)}
      />
      <Button title="Save" onPress={uploadImageToFirebase} />
    </View>
  );
};

export default Save;
