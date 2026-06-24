import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Controller, useForm } from 'react-hook-form';

import { AppButton } from '../../components/AppButton.tsx';
import { TextField } from '../../components/TextField.tsx';
import { AuthShell } from './AuthShell.tsx';
import { RootStackParams } from '../../navigationTypes.ts';
import { colors } from '../../theme.ts';
import { emailRegEx, passRegEx } from '../../validation.ts';
import SignUpIcon from '../../assets/icons/SignUpIcon.tsx';
import { useTranslation } from 'react-i18next';

type SignUpForm = {
  name: string;
  email: string;
  password: string;
};

export function SignUpScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();
  const [submitted, setSubmitted] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm<SignUpForm>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const submit = handleSubmit(() => {
    setSubmitted(true);
  });

  return (
    <AuthShell
      title={t('auth.signUp')}
      subtitle={t('auth.createPersonalAccount')}
      onGoBack={() => navigation.navigate('Welcome')}
      icon={<SignUpIcon />}
      footer={
        <>
          <AppButton title={t('auth.createAccount')} onPress={submit} />
          <AppButton
            title={t('auth.alreadyHaveAccount')}
            onPress={() => navigation.navigate('Login')}
            variant="text"
          />
        </>
      }
    >
      <View style={styles.fields}>
        <Controller
          control={control}
          name="name"
          rules={{
            required: t('validation.nameRequired'),
            validate: value =>
              value.trim().length > 0 || t('validation.nameString'),
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              label={t('auth.name')}
              placeholder={t('auth.yourName')}
              autoCapitalize="words"
              onBlur={onBlur}
              onChangeText={text => {
                setSubmitted(false);
                onChange(text);
              }}
              value={value}
              error={errors.name?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="email"
          rules={{
            required: t('validation.emailRequired'),
            pattern: {
              value: emailRegEx,
              message: t('validation.emailInvalid'),
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              label={t('auth.email')}
              placeholder={t('auth.emailPlaceholder')}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              onBlur={onBlur}
              onChangeText={text => {
                setSubmitted(false);
                onChange(text);
              }}
              value={value}
              error={errors.email?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          rules={{
            required: t('validation.passwordRequired'),
            pattern: {
              value: passRegEx,
              message: t('validation.passwordRules'),
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              label={t('auth.password')}
              placeholder={t('auth.createPassword')}
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry
              onBlur={onBlur}
              onChangeText={text => {
                setSubmitted(false);
                onChange(text);
              }}
              value={value}
              error={errors.password?.message}
            />
          )}
        />

        {submitted && isSubmitted ? (
          <Text style={styles.success}>{t('auth.registrationValid')}</Text>
        ) : null}
      </View>
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  fields: {
    gap: 16,
  },

  success: {
    fontSize: 14,
    color: colors.teal,
  },
});
