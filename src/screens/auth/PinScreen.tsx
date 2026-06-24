import { useDispatch, useSelector } from 'react-redux';
import { authActions, RootState } from '../../store/store.ts';
import { useEffect, useState } from 'react';
import * as Keychain from 'react-native-keychain';
import { BIOMETRY_SERVICE, PIN_SERVICE } from '../../api.ts';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Screen } from '../../components/Screen.tsx';
import { colors } from '../../theme.ts';
import { AppButton } from '../../components/AppButton.tsx';
import PhoneIcon from '../../assets/icons/PhoneIcon.tsx';
import { useTranslation } from 'react-i18next';

const PIN_LENGTH = 5;

export function PinScreen() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const session = useSelector((state: RootState) => state.auth.session);
  const mode = session === 'pinSetup' ? 'setup' : 'unlock';

  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [biometry, setBiometry] = useState<Keychain.BIOMETRY_TYPE | null>(null);
  const [biometryEnabled, setBiometryEnabled] = useState(false);

  const codeLength = Array(PIN_LENGTH).fill(0);

  useEffect(() => {
    const initBiometry = async () => {
      try {
        const supportedBiometry = await Keychain.getSupportedBiometryType();

        const hasBiometryCredentials = await Keychain.hasGenericPassword({
          service: BIOMETRY_SERVICE,
        });

        setBiometry(supportedBiometry);
        setBiometryEnabled(hasBiometryCredentials);
      } catch {
        setBiometry(null);
        setBiometryEnabled(false);
      }
    };

    initBiometry();
  }, []);

  const getBiometryLabel = () => {
    if (biometry === Keychain.BIOMETRY_TYPE.FACE_ID) {
      return 'Face ID';
    }

    if (biometry === Keychain.BIOMETRY_TYPE.TOUCH_ID) {
      return 'Touch ID';
    }

    return t('pin.biometrics');
  };

  const askEnableBiometry = () => {
    const label = getBiometryLabel();

    return new Promise<boolean>(resolve => {
      Alert.alert(
        t('pin.useBiometryTitle', { label }),
        t('pin.useBiometryMessage', { label }),
        [
          {
            text: t('pin.notNow'),
            style: 'cancel',
            onPress: () => resolve(false),
          },
          {
            text: t('pin.enable'),
            onPress: () => resolve(true),
          },
        ],
        { cancelable: false },
      );
    });
  };

  const enableBiometry = async () => {
    await Keychain.setGenericPassword('unlock', 'enabled', {
      service: BIOMETRY_SERVICE,
      accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET,
      accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    });

    setBiometryEnabled(true);
  };

  const pressDigit = (digit: number) => {
    setError('');

    setPin(current =>
      current.length < PIN_LENGTH ? `${current}${digit}` : current,
    );
  };

  const removeDigit = () => {
    setError('');
    setPin(current => current.slice(0, -1));
  };

  const submit = async () => {
    if (pin.length !== PIN_LENGTH) {
      setError(t('pin.enterAllDigits'));
      return;
    }

    if (mode === 'setup') {
      await Keychain.setGenericPassword('pin', pin, {
        service: PIN_SERVICE,
        accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      });

      if (biometry) {
        const shouldEnableBiometry = await askEnableBiometry();

        if (shouldEnableBiometry) {
          try {
            await enableBiometry();
          } catch {
            Alert.alert(
              t('pin.unavailableTitle'),
              t('pin.setupUnavailableMessage'),
            );
          }
        }
      }

      dispatch(authActions.unlock());
      return;
    }

    const storedPin = await Keychain.getGenericPassword({
      service: PIN_SERVICE,
    });

    if (storedPin && storedPin.password === pin) {
      dispatch(authActions.unlock());
    } else {
      setPin('');
      setError(t('pin.wrongPin'));
    }
  };

  const unlockWithBiometry = async () => {
    try {
      const result = await Keychain.getGenericPassword({
        service: BIOMETRY_SERVICE,
        accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET,
        authenticationPrompt: {
          title: t('pin.unlockTitle'),
          cancel: t('pin.usePin'),
        },
      });

      if (result) {
        dispatch(authActions.unlock());
      }
    } catch {
      Alert.alert(t('pin.unavailableTitle'), t('pin.unlockUnavailableMessage'));
    }
  };

  const title = mode === 'setup' ? t('pin.createTitle') : t('pin.enterTitle');
  const subtitle =
    mode === 'setup' ? t('pin.createSubtitle') : t('pin.enterSubtitle');

  const showBiometryButton = mode === 'unlock' && biometry && biometryEnabled;

  return (
    <Screen style={styles.pinScreenWrapper}>
      <View style={styles.topContent}>
        <View style={styles.pinScreenTop}>
          <View style={styles.topIcon}>
            <PhoneIcon />
          </View>

          <Text style={styles.topText}>{title}</Text>
        </View>

        <View style={styles.codeViewWrapper}>
          <Text style={styles.codeViewTitle}>{subtitle}</Text>

          <View style={styles.codeView}>
            {codeLength.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.pinEmpty,
                  {
                    backgroundColor: pin[index]
                      ? colors.accent
                      : colors.textSecondary,
                  },
                ]}
              />
            ))}
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>

        {showBiometryButton ? (
          <AppButton
            title={t('pin.unlockWith', { label: getBiometryLabel() })}
            variant="text"
            onPress={unlockWithBiometry}
          />
        ) : null}
      </View>

      <View style={styles.bottomContent}>
        <View style={styles.numbersView}>
          <View style={styles.row}>
            {[1, 2, 3].map(number => (
              <TouchableOpacity
                key={number}
                style={styles.key}
                onPress={() => pressDigit(number)}
              >
                <Text style={styles.number}>{number}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.row}>
            {[4, 5, 6].map(number => (
              <TouchableOpacity
                key={number}
                style={styles.key}
                onPress={() => pressDigit(number)}
              >
                <Text style={styles.number}>{number}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.row}>
            {[7, 8, 9].map(number => (
              <TouchableOpacity
                key={number}
                style={styles.key}
                onPress={() => pressDigit(number)}
              >
                <Text style={styles.number}>{number}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.row}>
            <View style={styles.key} />

            <TouchableOpacity style={styles.key} onPress={() => pressDigit(0)}>
              <Text style={styles.number}>0</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.key} onPress={removeDigit}>
              <Text style={styles.delete}>⌫</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <AppButton
            title={t('common.continue')}
            onPress={submit}
            disabled={pin.length !== PIN_LENGTH}
          />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  pinScreenWrapper: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: colors.white,
  },

  topContent: {
    alignItems: 'center',
  },

  pinScreenTop: {
    marginTop: 32,
    alignItems: 'center',
  },

  topText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },

  topIcon: {
    width: 64,
    height: 64,
    backgroundColor: colors.tealLight,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },

  codeViewWrapper: {
    gap: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 48,
  },

  codeViewTitle: {
    fontSize: 20,
    color: colors.textSecondary,
  },

  codeView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },

  pinEmpty: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },

  error: {
    color: colors.error,
    fontSize: 14,
  },

  bottomContent: {
    backgroundColor: colors.white,
  },

  numbersView: {
    paddingHorizontal: 64,
    gap: 28,
    paddingBottom: 24,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  key: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },

  number: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.textPrimary,
  },

  delete: {
    fontSize: 28,
    color: colors.textPrimary,
  },

  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
});
