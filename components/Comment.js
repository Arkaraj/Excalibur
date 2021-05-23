import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Button, TextInput } from "react-native";

import firebase from "firebase";
require("firebase/firestore");

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchUserData } from "../redux/actions";

const Comment = ({ route, users, fetchUserData }) => {
  const [comments, setComments] = useState([]);
  const [postId, setPostId] = useState("");
  const [text, setText] = useState("");

  useEffect(() => {
    const matchUserToComment = (comments) => {
      for (let i = 0; i < comments.length; i++) {
        if (comments[i].hasOwnProperty("user")) {
          continue;
        }

        const usr = users.find((x) => x.uid === comments[i].creator);

        if (!usr) {
          // user == undifined
          fetchUserData(commnets[i].creator, false);
        } else {
          comments[i].user = usr;
        }
      }
      setComments(comments);
    };

    if (route.params.postId !== postId) {
      firebase
        .firestore()
        .collection("posts")
        .doc(route.params.userId)
        .collection("userPosts")
        .doc(route.params.postId)
        .collection("comments")
        .get()
        .then((snapshot) => {
          let comment = snapshot.docs.map((doc) => {
            const data = doc.data(); // will contain comment and user created
            const id = doc.id;
            return { id, ...data };
          });

          matchUserToComment(comment);
          setPostId(route.params.postId);
        });
    } else {
      matchUserToComment(comments);
    }
  }, [route.params.postId, users]);

  const onCommentSend = () => {
    firebase
      .firestore()
      .collection("posts")
      .doc(route.params.userId)
      .collection("userPosts")
      .doc(route.params.postId)
      .collection("comments")
      .add({
        creator: firebase.auth().currentUser.uid,
        text,
      });
  };

  return (
    <View>
      <FlatList
        numColumns={1}
        horizontal={false}
        data={comments}
        renderItem={({ item }) => (
          <View>
            {item.user ? <Text>{item.user.name}</Text> : null}
            <Text>{item.text}</Text>
          </View>
        )}
      />

      <View>
        <TextInput
          placeholder="comment"
          onChangeText={(text) => setText(text)}
        />
        <Button onPress={() => onCommentSend()} title="Send" />
      </View>
    </View>
  );
};

const mapStateToProps = (store) => ({
  users: store.usersState.users,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators({ fetchUserData }, dispatch);

export default connect(mapStateToProps, mapDispatchProps)(Comment);
