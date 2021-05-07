import React from "react";
import { View, Text } from "react-native";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchUser } from "../redux/actions/index";

const Main = ({ fetchUser, currentUser }) => {
  React.useEffect(() => {
    fetchUser();
  }, []);

  console.log();

  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <Text>
        {currentUser ? currentUser.name + " is Logged In" : "Logged In"}
      </Text>
    </View>
  );
};

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators({ fetchUser }, dispatch);

export default connect(mapStateToProps, mapDispatchProps)(Main);
