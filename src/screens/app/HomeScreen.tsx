import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  StatusBar,
  Text,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';

import {
  RootState,
} from '../../store/store.ts';
import { colors, radius } from '../../theme.ts';
import { usePosts } from '../../usePosts.ts';
import { Screen } from '../../components/Screen.tsx';
import { StepCard } from '../../components/StepCard.tsx';
import { PostCard } from '../../components/PostCard.tsx';
import LinkIcon from '../../assets/icons/LinkIcon.tsx';
import ArrowIcon from '../../assets/icons/ArrowIcon.tsx';
import {useNavigation} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParams } from '../../navigationTypes.ts';
import { Post } from '../../api.ts';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

export function HomeScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const topInset = Math.max(insets.top, StatusBar.currentHeight ?? 0);
  const user = useSelector((state: RootState) => state.profile.user);
  const {data, isPending, error} = usePosts({limit: 3});
  const name = user ? `${user.firstName} ${user.lastName}` : 'John Doe';
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParams>>();
  return (
    <Screen style={styles.canvas} edges={['left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.homeContent}
      >
        <ImageBackground
          source={require('../../assets/images/blurredBg.png')}
          resizeMode="cover"
          style={[
            styles.homeHero,
            {
              height: styles.homeHero.height + topInset,
              paddingTop: topInset,
            },
          ]}
        >
          <Text style={styles.heroEyebrow}>{t('home.eyebrow')}</Text>
          <Text style={styles.heroName}> {name}</Text>
        </ImageBackground>

        <View style={styles.advisor}>
          <View style={styles.advisorCopy}>
            <Text style={styles.advisorTitle}>{t('home.advisor')}</Text>
            <Text style={styles.advisorBody}>{t('home.advisorBody')}</Text>
            <View style={styles.advisorLinkRow}>
              <Text style={styles.advisorLink}>{t('home.call')}</Text>
              <View style={styles.advisorArrow}>
                <ArrowIcon color={colors.teal} />
              </View>
            </View>
          </View>
          <Image
            source={require('../../assets/images/goToCall.png')}
            resizeMode="cover"
            style={styles.advisorImage}
          />
        </View>

        <Text style={styles.dividerText}>{t('home.before')}</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.stepRow}
        >
          <StepCard
            color={colors.textSecondary}
            icon={<LinkIcon />}
            title={t('home.linkBank')}
            steps={2}
          />
          <StepCard
            color={colors.teal}
            icon={<LinkIcon />}
            title={t('home.addWallet')}
            steps={3}
          />
        </ScrollView>

        <Text style={styles.dividerText}>{t('home.posts')}</Text>
        <View style={styles.posts}>
          {isPending ? <Text>{t('home.loading')}</Text> : null}
          {error && !data ? <Text>{t('home.postsUnavailable')}</Text> : null}
          {data?.map((post: Post) => (
            <PostCard
              key={post.id}
              post={post}
              onPress={() => {
                navigation.navigate('Post', { postId: post.id });
              }}
            />
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  canvas: { backgroundColor: colors.background },
  pressed: { opacity: 0.7 },
  homeContent: { paddingBottom: 26 },
  homeHero: {
    height: 296,
    backgroundColor: colors.accent,
    borderBottomLeftRadius: radius.big,
    borderBottomRightRadius: radius.big,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  heroEyebrow: { fontSize: 12, color: '#FFF5ED' },
  heroName: {
    fontSize: 25,
    color: colors.background,
    fontWeight: '800',
    marginTop: 7,
  },
  heroGlow: {
    position: 'absolute',
    width: 260,
    height: 90,
    borderRadius: 130,
    backgroundColor: '#FFAF77',
    opacity: 0.22,
    bottom: -48,
  },
  advisor: {
    margin: 16,
    paddingVertical: 16,
    paddingLeft: 24,
    paddingRight: 16,
    minHeight: 116,
    backgroundColor: colors.white,
    borderRadius: radius.small,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  advisorCopy: {
    flex: 1,
    gap: 5,
    justifyContent: 'center',
    minHeight: 116,
  },
  advisorTitle: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  advisorBody: {
    fontSize: 13,
    lineHeight: 17,
    color: colors.textSecondary,
  },
  advisorLink: {
    fontSize: 15,
    color: colors.teal,
  },
  advisorLinkRow: {
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  advisorArrow: {
    transform: [{ rotate: '180deg' }],
  },
  advisorImage: {
    width: 127,
    height: 128,
    borderRadius: radius.small,
  },
  stepRow: {
    gap: 16,
    padding:16,
  },
  screen: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.white,
    justifyContent: 'space-between',
  },
  dividerText: {
    fontSize: 15,
    color: colors.textSecondary,
    marginHorizontal: 16,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
  },

  text: {
    marginTop: 8,
    fontSize: 16,
    color: colors.textSecondary,
  },

  posts: {
    gap: 16,
    marginTop: 16,
    paddingHorizontal: 16,
  }
});
