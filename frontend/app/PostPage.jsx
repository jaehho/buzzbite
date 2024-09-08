import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useEffect, useRef, useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image, Pressable} from 'react-native';
import { SymbolView } from 'expo-symbols';
import * as FileSystem from 'expo-file-system';
import api from '../services/api';

export default function PostPage() {

  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();

  const [cameraMode, setCameraMode] = useState("video");
  const [isRecording, setIsRecording] = useState(false);
  const [photo, setPhoto] = useState("");
  const [videoSegments, setVideoSegments] = useState();
  const cameraRef = useRef(null);


  useEffect(() => {
    console.log(videoSegments);
  }, [videoSegments]);


  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }
  const uploadVideo = async () => {
    if (!videoUri) return;

    const videoData = await FileSystem.readAsStringAsync(videoUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const response = await api.post('todo', {
      video: videoData,
      fileName: 'video.mp4',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.ok) {
      console.log('Video uploaded successfully');
    } else {
      console.error('Failed to upload video');
    }
  };

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  const handleTakePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      console.log(photo);
      setPhoto(photo.uri);
    }
  }

  async function toggleRecord() {
    if (isRecording) {
      cameraRef.current.stopRecording();
      setIsRecording(false);
    } else {
      setIsRecording(true);
      console.log("recording");
      try{
        const response = await cameraRef.current.recordAsync();
        setVideoSegments((prevSegments) => [...prevSegments, response.uri]);
      } catch (error) {
        console.log(error);
      }
      
    }
  }

  // const endVideoRecording = async () => {
  //   try {
  //     console.log("attempting to merge")
  //     const data = await VideoManager.merge(videoSegments);
    
  //     console.log("merged video path", uri);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }  


  if (photo) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: photo }} style={styles.camera} />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <CameraView 
      style={styles.camera} 
      facing={facing}
      ref={cameraRef}
      mode='video'
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={cameraMode === "picture" ? handleTakePicture : toggleRecord} style={styles.recordButtonContainer}>
        <SymbolView
          name={
            cameraMode === "picture"
              ? "circle"
              : isRecording
              ? "record.circle"
              : "circle.circle"
          }
          size={90}
          type="hierarchical"
          tintColor={isRecording ? "#0a7ea4": "white"}
          animationSpec={{
            effect: {
              type: isRecording ? "pulse" : "bounce",
            },
            repeating: isRecording,
          }}
          // fallback={} TODO: Add a fallback for android
        />
      </TouchableOpacity>
      <Pressable style={{    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,}}onPress = {endVideoRecording}>
        <Text style={styles.text}>End Recording</Text>
      </Pressable>
        </View>
      </CameraView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  recordButtonContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 100,
    position: "absolute",
    bottom: 45,
  },
});
