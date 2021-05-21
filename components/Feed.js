import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Image, FlatList, Button } from "react-native";

import firebase from "firebase";
require("firebase/firestore");
import { connect } from "react-redux";

function Feed({ currentUser, usersLoaded, following, users, route }) {
  const [userPosts, setUserPosts] = useState([]);
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    let posts = [];

    if (usersLoaded == following.length) {
      for (let i = 0; i < following.length; i++) {
        const user = users.find((el) => el.uid === following[i]);

        if (user != undefined) {
          posts = [...posts, ...user.posts];
        }
      }

      posts.sort((curr, next) => {
        return curr.creationDate - next.creationDate;
      });

      setPosts(posts);
    }
  }, [usersLoaded]);

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
  users: store.userState.users,
  usersLoaded: store.userState.usersLoaded,
});

export default connect(mapStateToProps, null)(Feed);
