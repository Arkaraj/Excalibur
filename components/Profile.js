import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Image, FlatList } from "react-native";
import firebase from "firebase";
require("firebase/firestore");

// Redux Connecting
import { connect } from "react-redux";

const Profile = ({ navigation, currentUser, posts, route }) => {
  const [user, setUser] = useState([]);
  const [userPost, setUserPost] = useState(null);

  useEffect(() => {
    if (route.params.uid === firebase.auth().currentUser.uid) {
      // Set Info from Redux
      console.log(route.params.uid);
      setUser(currentUser);
      setUserPost(posts);
    } else {
      firebase
        .firestore()
        .collection("users")
        .doc(route.params.uid)
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            setUser(snapshot.data());
          } else {
            console.log("User does not exist");
          }
        });

      firebase
        .firestore()
        .collection("posts")
        .doc(route.params.uid)
        .collection("userPosts")
        .orderBy("creationDate", "asc")
        .get()
        .then((snapshot) => {
          let posts = snapshot.docs.map((doc) => {
            const data = doc.data();
            const id = doc.id;
            return { id, ...data };
          });

          setUserPost(posts);
        });
    }
  }, [route.params.uid]);

  return (
    <View style={styles.container}>
      <View style={styles.containerInfo}>
        <Text>{user && user.name}'s Profile</Text>
        <Text>{user && user.email}</Text>
      </View>

      {userPost && (
        <View style={styles.containerGallery}>
          <FlatList
            numColumns={3}
            horizontal={false}
            data={userPost}
            renderItem={({ item }) => (
              <View style={styles.imageContainer}>
                <Image style={styles.image} source={{ uri: item.snapshot }} />
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
};

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
  imageContainer: {
    flex: 1 / 3,
  },
  image: {
    flex: 1,
    aspectRatio: 1 / 1,
  },
});

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  posts: store.userState.posts,
});

export default connect(mapStateToProps, null)(Profile);
