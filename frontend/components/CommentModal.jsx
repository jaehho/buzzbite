import { useState, useRef, useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import api from '../services/api';
import {
  View,
  Text,
  Modal,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Pressable,
  PanResponder,
  Animated,
} from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import Comment from './Comment';

const CommentModal = ({ visible, onClose, video_id }) => {
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);
  const { user_id } = useLocalSearchParams();

  // Pan animation for the entire modal
  const pan = useRef(new Animated.ValueXY()).current;

  // Create a PanResponder but ONLY for the top "drag handle"
  const panResponder = useRef(
    PanResponder.create({
      // We only want the top area to respond to touches
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderMove: (evt, gestureState) => {
        // Only allow dragging downward
        if (gestureState.dy > 0) {
          pan.setValue({ x: 0, y: gestureState.dy });
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        // If user pulls down past a threshold, close the modal
        if (gestureState.dy > 100) {
          onClose();
        } else {
          // Otherwise, snap back to original position
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  //when reopend, reset the position of the modal
  useEffect(() => {
    if (visible) {
      pan.setValue({ x: 0, y: 0 });
    }
  }, [visible, pan]);

  // Fetch comments on mount
  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await api.get('/content/comments/', {
        video_id,
        user_id,
      });
      console.log(response.data);
      setComments(response.data); // assuming response.data is an array
    } catch (error) {
      console.log('error fetching comments', error);
    }
  };

  const onAddComment = (comment) => {
    api
      .post('/content/comments/', {
        video_id,
        comment,
      })
      .then((response) => {
        console.log(response.status);
        setComments((prev) => [
          ...prev,
          {
            profile_picture:
              'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png',
            username: 'You',
            likes: 0,
            timestamp: new Date().toISOString(),
            comment_text: comment,
          },
        ]);
      })
      .catch((error) => {
        console.log('Error posting comment', error);
      });
  };

  const handleAddComment = () => {
    onAddComment(newComment);
    setNewComment('');
  };

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <Animated.View
          style={[styles.modalContent, { transform: pan.getTranslateTransform() }]} 
          
        >

          {/* ====== TITLE (optional) ====== */}
          <View style={styles.header} {...panResponder.panHandlers}>
            <Text style={styles.title}>Comments</Text>
          </View>

          {/* ====== CLOSE BUTTON ON TOP RIGHT ====== */}
          <Pressable onPress={onClose} style={styles.closeButton}>
            <Feather name="x" size={24} color="black" />
          </Pressable>

          {/* ====== REST OF YOUR CONTENT (FlatList, Input, etc.) ====== */}
          {comments.length === 0 && (
            <Text style={styles.noCommentsText}>No comments yet</Text>
          )}

          <FlatList
            data={comments}
            keyExtractor={(item, index) => `${index}`}
            renderItem={({ item }) => (
              <Comment
                profile_picture={
                  item.profile_picture ||
                  'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png'
                }
                username={item.username}
                likes={item.likes}
                timestamp={item.commented_at || item.timestamp}
                comment_text={item.comment || item.comment_text}
              />
            )}
          />

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={newComment}
              onChangeText={setNewComment}
              placeholder="Add a comment..."
            />
            <Button title="Post" onPress={handleAddComment} />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    height: '66%',
  },
  header: {
    // Possibly no flexDirection or 'justifyContent' if you just want the title centered
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  // Absolutely position the close button
  closeButton: {
    position: 'absolute',
    top: 20,    // adjust as needed
    right: 20,  // adjust as needed
    zIndex: 10, // ensure it is on top
  },
  noCommentsText: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 16,
    color: '#888',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
});

export default CommentModal;