import { Screen } from '../../components/Screen';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BackButton } from '../../components/BackButton.tsx';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getComments, getPost, Post } from '../../api.ts';
import { RootStackParams } from '../../navigationTypes.ts';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, radius } from '../../theme.ts';
import { useTranslation } from 'react-i18next';

interface PostScreenParams extends RootStackParams{}

export function PostScreen ({navigation, route}: NativeStackScreenProps<PostScreenParams, 'Post'>) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const cachedPost = queryClient
    .getQueriesData<Post[]>({ queryKey: ['posts'] })
    .flatMap(([, posts]) => posts ?? [])
    .find(post => post.id === route.params.postId);
  const postQuery = useQuery({
    queryKey: ['post', route.params.postId],
    queryFn: () => getPost(route.params.postId),
    initialData: cachedPost,
    initialDataUpdatedAt: 0,
  });
  const commentsQuery = useQuery({
    queryKey: ['comments', route.params.postId],
    queryFn: () => getComments(route.params.postId)
  })

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.postScreen}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.postHeader}>
          <BackButton
            style={styles.backButton}
            onPress={() => {
              if (navigation.canGoBack()) {
                navigation.goBack();
                return;
              }

              navigation.navigate('Main');
            }}
          />
          <View style={styles.headerTopSpacer} />
          <Text style={styles.postTitle}>
            {postQuery.data?.title ?? t('post.fallbackTitle')}
          </Text>
          <View style={styles.postImageWrapper}>
            <Image
              source={require('../../assets/images/postImage.png')}
              style={styles.postImage}
            />
          </View>
        </View>

        <View style={styles.postAbout}>
          <Text style={styles.postAboutTitle}>{t('post.about')}</Text>
          <View style={styles.postAboutWrapper}>
            <Text style={styles.postAboutText}>
              {postQuery.data?.body ?? t('post.fallbackDetails')}
            </Text>
          </View>
        </View>
        {postQuery.error && !postQuery.data ? (
          <Text>{t('post.unavailable')}</Text>
        ) : null}

        <View style={styles.postComments}>
          <Text style={styles.postCommentsTitle}>{t('post.comments')}</Text>

          <View style={styles.postsWrapper}>
            {commentsQuery.data?.map(comment => (
              <View key={comment.id} style={styles.post}>
                <Text style={styles.postName}>{comment.name}</Text>
                <Text style={styles.postEmail}>{comment.email}</Text>
                <Text style={styles.postBody}>{comment.body}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  postScreen: {},
  postHeader: {
    backgroundColor: colors.white,
    borderBottomLeftRadius: radius.medium,
    borderBottomRightRadius: radius.medium,
    height: 480,
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 16,
    top: 16,
    zIndex: 1,
  },
  headerTopSpacer: {
    height: 24,
  },
  postTitle: {
    fontSize: 32,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  postImageWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  postImage: {
    alignItems: 'center',
  },
  postAbout: {
    padding: 16,
    gap: 8,
  },
  postAboutTitle: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  postAboutWrapper: {
    backgroundColor: colors.white,
    borderRadius: radius.small,
    padding: 24,
  },
  postAboutText: {
    fontSize: 15,
    lineHeight: 32,
  },
  postComments: {
    marginTop: 48,
    paddingHorizontal: 16,
    gap: 8,
  },
  postCommentsTitle: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  postsWrapper: {
    gap: 12,
  },
  post: {
    backgroundColor: colors.white,
    padding: 12,
    borderRadius: radius.small,
  },
  postName: {
    fontSize: 18,
    fontWeight: '600',
  },
  postEmail: {
    fontSize: 15,
    marginBottom: 12,
    fontWeight: '600',
  },
  postBody: {fontSize: 14,
  lineHeight:19},
});
