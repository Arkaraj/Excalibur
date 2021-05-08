import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Button, Image } from "react-native";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";

export default function Add({ navigation }) {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  useEffect(() => {
    (async () => {
      const camera = await Camera.requestPermissionsAsync();
      setHasCameraPermission(camera.status === "granted");

      const gallery = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(gallery.status === "granted");
    })();
  }, []);

  if (hasCameraPermission === null && hasGalleryPermission) {
    return <View />;
  }
  if (hasCameraPermission === false && hasGalleryPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const takePicture = async () => {
    if (camera) {
      const data = await camera.takePictureAsync(null);
      setImage(data.uri);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  return (
    <View style={styles.container}>
      <Camera
        ref={(ref) => setCamera(ref)}
        style={styles.camera}
        ratio={"1:1"}
        type={type}
      ></Camera>
      <View style={styles.buttonContainer}>
        <Button
          style={styles.button}
          onPress={() => {
            setType(
              type === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back
            );
          }}
          title="Flip"
        ></Button>
        <Button
          style={styles.button}
          onPress={takePicture}
          title="Take Picture"
        ></Button>
        <Button
          style={styles.button}
          onPress={pickImage}
          title="Pick Image from Gallery"
        ></Button>
        <Button
          style={styles.button}
          onPress={() => navigation.navigate("Save", { image })}
          title="Save"
        ></Button>
      </View>
      {image && <Image source={{ uri: image }} style={{ flex: 1 }} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  camera: {
    flex: 1,
    aspectRatio: 1,
  },
});
