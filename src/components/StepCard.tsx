import { StyleSheet, Text, View } from 'react-native';
import { colors, radius } from '../theme';
import ArrowRight from '../assets/icons/ArrowRight.tsx';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface StepCardProps {
  title: string;
  color: string;
  steps: number;
  icon?: ReactNode;
}

export function StepCard({title, color, steps, icon}: StepCardProps) {
  const { t } = useTranslation();

  return (
    <View style={[styles.stepCard, {backgroundColor: color}]}>
      <View style={styles.topContainer}>
        <View style={styles.stepIcon}>
          <Text style={styles.stepIconText}>{icon}</Text>
        </View>
        <Text style={styles.stepTitle}>{title}</Text>
      </View>
      <View style={styles.botContainer}>
        <Text style={styles.stepFooter}>{t('home.steps', { count: steps })}</Text>
        <ArrowRight />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  stepCard: {
    width: 233,
    height: 152,
    borderRadius: radius.small,
    paddingVertical: 24,
    paddingHorizontal: 16,
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  stepIcon:{
    width: 48,
    height: 48,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    display:'flex',
    backgroundColor: colors.accent,
  },
  stepIconText: {

  },
  topContainer: {
    display: 'flex',
    flexDirection: "row",
    alignItems: 'center',
  },
  stepTitle: {
    width: 130,
    color: colors.white,
    fontSize: 15,
    lineHeight: 24,
    fontWeight: 'medium',
    paddingLeft: 10,
  },
  stepFooter: {
    // width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 'auto',
    color: colors.white
  },
  stepArrow: {

  },
  botContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
  },
})
