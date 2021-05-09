import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";
import firebase from "firebase";
import { fetchUser } from "../redux/actions";

const Search = ({ navigation }) => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async (search) => {
    firebase
      .firestore()
      .collection("users")
      .where("name", ">=", search)
      .get()
      .then((snapshot) => {
        let users = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });

        setUsers(users);
      });
  };

  return (
    <View>
      <TextInput
        placeholder="Search Users..."
        onChangeText={(e) => {
          fetchUsers(e);
        }}
      />

      <FlatList
        numColumns={1}
        horizontal={false}
        data={users}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Profile", { uid: item.id });
            }}
          >
            <Text>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default Search;
