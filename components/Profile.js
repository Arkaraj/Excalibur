import React from "react";
import { StyleSheet, View, Text, Image, FlatList } from "react-native";

// Redux Connecting
import { connect } from "react-redux";

const Profile = ({ navigation, currentUser, posts }) => {
  return (
    <View style={styles.container}>
      <View style={styles.containerInfo}>
        <Text>{currentUser.name}'s Profile</Text>
        <Text>{currentUser.email}</Text>
      </View>

      <View style={styles.containerGallery}>
        <FlatList
          numColumns={3}
          horizontal={false}
          data={posts}
          renderItem={({ item }) => (
            <View style={styles.imageContainer}>
              <Image style={styles.image} source={{ uri: item.snapshot }} />
            </View>
          )}
        />
      </View>
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
