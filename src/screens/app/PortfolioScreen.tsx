import { Screen } from '../../components/Screen.tsx';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius } from '../../theme.ts';
import { useTranslation } from 'react-i18next';

export function PortfolioScreen() {
  const { t } = useTranslation();

  return (
    <Screen style={styles.screen}>
      <View style={styles.content}>
        <Text style={styles.title}>{t('portfolio.title')}</Text>

        <View style={styles.card}>
          <View style={styles.statusIcon}>
            <Text style={styles.statusIconText}>•••</Text>
          </View>
          <Text style={styles.cardTitle}>{t('portfolio.inWork')}</Text>
          <Text style={styles.cardText}>
            {t('portfolio.body')}
          </Text>
        </View>

        <View style={styles.progressCard}>
          <Text style={styles.progressTitle}>{t('portfolio.comingNext')}</Text>
          <View style={styles.progressRow}>
            <View style={styles.dot} />
            <Text style={styles.progressText}>{t('portfolio.profileSummary')}</Text>
          </View>
          <View style={styles.progressRow}>
            <View style={styles.dot} />
            <Text style={styles.progressText}>{t('portfolio.savedPosts')}</Text>
          </View>
          <View style={styles.progressRow}>
            <View style={styles.dot} />
            <Text style={styles.progressText}>{t('portfolio.recentActivity')}</Text>
          </View>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.background,
  },

  content: {
    flex: 1,
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 22,
  },

  card: {
    minHeight: 210,
    borderRadius: radius.medium,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
  },

  statusIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.tealLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },

  statusIconText: {
    fontSize: 24,
    lineHeight: 28,
    color: colors.teal,
    fontWeight: '700',
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },

  cardText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
    textAlign: 'center',
  },

  progressCard: {
    marginTop: 16,
    borderRadius: radius.small,
    backgroundColor: colors.white,
    padding: 20,
  },

  progressTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 16,
  },

  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 28,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent,
  },

  progressText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});
