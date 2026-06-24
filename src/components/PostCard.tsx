import { Post } from "../api"
import {JSX} from "react";
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, radius } from '../theme.ts';

interface PostCardProps {
  post: Post;
  onPress?: () => void;
}

export function PostCard({post, onPress}: PostCardProps): JSX.Element {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.postCard, pressed && styles.pressed]}
    >
      <Text style={styles.postTitle}>{post.title}</Text>
      <Text style={styles.postBody}>{post.body}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  postCard: {
    gap: 8,
    padding: 12,
    backgroundColor: colors.white,
    borderRadius: radius.small,
  },
  postTitle: {
    fontSize: 18,
    color: colors.textPrimary,
  },
  postBody: {
    color: colors.textSecondary,
    fontSize: 16,
  },
  pressed: {
    opacity: 0.75,
    transform: [{ scale: 0.99 }],
  },
});