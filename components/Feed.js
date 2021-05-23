import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Image, FlatList, Button } from "react-native";

import firebase from "firebase";
require("firebase/firestore");
import { connect } from "react-redux";

function Feed({
  currentUser,
  navigation,
  usersLoaded,
  following,
  users,
  feed,
  route,
}) {
  // const [userPosts, setUserPosts] = useState([]);
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    if (usersLoaded == following.length && following.length !== 0) {
      feed.sort((curr, next) => {
        return curr.creationDate - next.creationDate;
      });

      setPosts(feed);
    }
  }, [usersLoaded, feed]);

  const onLikePress = (uid, postId) => {
    firebase
      .firestore()
      .collection("posts")
      .doc(uid)
      .collection("userPosts")
      .doc(postId)
      .collection("likes")
      .doc(firebase.auth().currentUser.uid)
      .set({});
  };
  const onDisLikePress = (uid, postId) => {
    firebase
      .firestore()
      .collection("posts")
      .doc(uid)
      .collection("userPosts")
      .doc(postId)
      .collection("likes")
      .doc(firebase.auth().currentUser.uid)
      .delete();
  };

  return (
    <View style={styles.container}>
      <View style={styles.containerInfo}>
        <Text>{user.name}</Text>
        <Text>{user.email}</Text>
      </View>

      <View style={styles.containerGallery}>
        <FlatList
          numColumns={1}
          horizontal={false}
          data={posts}
          renderItem={({ item }) => (
            <View style={styles.containerImage}>
              <Text style={styles.container}>{item.user.name}</Text>
              <Image style={styles.image} source={{ uri: item.snapshot }} />

              {item.currentUserLike ? (
                <Button
                  title="Dislike"
                  onPress={() => onDisLikePress(item.user.uid, item.id)}
                />
              ) : (
                <Button
                  title="Like"
                  onPress={() => onLikePress(item.user.uid, item.id)}
                />
              )}

              <Text
                onPress={() =>
                  navigation.navigate("Comment", {
                    postId: item.id,
                    userId: item.user.uid,
                  })
                }
              >
                View Comments
              </Text>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerInfo: {
    margin: 20,
  },
  containerGallery: {
    flex: 1,
  },
  containerImage: {
    flex: 1 / 3,
  },
  image: {
    flex: 1,
    aspectRatio: 1 / 1,
  },
});
const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  following: store.userState.following,
  feed: store.usersState.feed,
  usersLoaded: store.userState.usersLoaded,
});

export default connect(mapStateToProps, null)(Feed);
