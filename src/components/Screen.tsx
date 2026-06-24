import { ReactNode, useRef, useEffect } from 'react';
import {
  Animated,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { Edge } from 'react-native-safe-area-context';
import { colors } from '../theme.ts';
interface ScreenProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  edges?: Edge[];
}

export function Screen({
  children,
  style,
  edges = ['top', 'left', 'right'],
}: ScreenProps) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    })
  }, [opacity]);

  return (
    <SafeAreaView style={styles.safe} edges={edges}>
      <Animated.View style={[styles.screen, style]}>
        {children}
      </Animated.View>
    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
  safe: {flex:1, backgroundColor: colors.white,},
  screen: {flex:1, backgroundColor: colors.background},
})
