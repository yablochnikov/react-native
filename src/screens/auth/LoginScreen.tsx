import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import axios from 'axios';

import { AuthShell } from './AuthShell.tsx';
import { TextField } from '../../components/TextField.tsx';
import { AppButton } from '../../components/AppButton.tsx';
import { login } from '../../api.ts';
import { AppDispatch, authActions, profileActions } from '../../store/store.ts';
import { colors } from '../../theme.ts';
import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParams } from '../../navigationTypes.ts';
import { useTranslation } from 'react-i18next';

type LoginForm = {
  username: string;
  password: string;
};

export function LoginScreen() {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParams>>();

  const [apiError, setApiError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    defaultValues: {
      username: 'emilys',
      password: 'emilyspass',
    },
  });

  const submit = handleSubmit(async values => {
    setSubmitting(true);
    setApiError('');

    try {
      const response = await login(values.username, values.password);

      const user = {
        id: response.id,
        username: response.username,
        email: response.email,
        firstName: response.firstName,
        lastName: response.lastName,
        gender: response.gender,
        image: response.image,
      };

      dispatch(profileActions.setUser(user));
      dispatch(authActions.authenticated());
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setApiError(error.response?.data?.error || t('auth.loginFailed'));
      } else if (error instanceof Error) {
        setApiError(`${t('auth.unknownError')}: ${error.message}`);
      } else {
        setApiError(t('auth.unknownError'));
      }
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <AuthShell
      title={t('auth.signIn')}
      subtitle={t('auth.personalAccount')}
      onGoBack={() => {navigation.navigate('Welcome')}}
      footer={
        <>
          <AppButton
            title={t('common.continue')}
            onPress={submit}
            disabled={submitting}
          />
          <AppButton
            title={t('auth.createAccount')}
            onPress={() => navigation.navigate('SignUp')}
            variant='text'
          />
        </>
      }
    >
      <View style={styles.fields}>
        <Controller
          control={control}
          name="username"
          rules={{ required: t('validation.usernameRequired') }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              label={t('auth.name')}
              placeholder={t('auth.firstName')}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.username?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          rules={{ required: t('validation.passwordRequired') }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              label={t('auth.password')}
              placeholder={t('auth.yourPassword')}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.password?.message}
              secureTextEntry
            />
          )}
        />

        {apiError ? <TextFieldError message={apiError} /> : null}
      </View>
    </AuthShell>
  );
}

function TextFieldError({ message }: { message: string }) {
  return <Text style={styles.apiError}>{message}</Text>;
}

const styles = StyleSheet.create({
  fields: {
    gap: 16,
  },

  apiError: {
    color: colors.error,
    fontSize: 14,
  },
});
