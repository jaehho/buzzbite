import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Feather from '@expo/vector-icons/Feather';

/**
 * Props:
 * - profile_picture: URI or a static file reference for the user's profile image
 * - username: user's name
 * - likes: number of likes for the comment
 * - timestamp: when the comment was posted
 * - comment_text: the actual comment
 */
const CommentItem = ({ profile_picture, username, likes, timestamp, comment_text }) => {
  return (
    <View style={styles.container}>
      {/* User icon */}
      <Image source={{ uri: profile_picture }} style={styles.profile_picture} />

      {/* Main content (username, comment text, etc.) */}
      <View style={styles.commentContent}>
        <View style={styles.headerRow}>
          <Text style={styles.username}>{username}</Text>
          <Text style={styles.timestamp}>{timestamp}</Text>
        </View>

        <Text style={styles.comment_text}>{comment_text}</Text>

        <View style={styles.likesContainer}>
          <Feather name="heart" size={16} color="#e74c3c" />
          <Text style={styles.likesCount}>{likes}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'flex-start',
  },
  profile_picture: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  commentContent: {
    flex: 1,
    justifyContent: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  username: {
    fontWeight: 'bold',
    marginRight: 5,
    fontSize: 14,
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
  },
  comment_text: {
    fontSize: 14,
    marginBottom: 5,
  },
  likesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likesCount: {
    marginLeft: 5,
    fontSize: 14,
    color: '#333',
  },
});

export default CommentItem;
