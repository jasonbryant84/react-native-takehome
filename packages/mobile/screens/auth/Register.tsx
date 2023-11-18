import {StatusBar} from 'expo-status-bar';
import { useContext, useEffect, useState } from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {StackScreens} from '../../App';

import { UserContext } from '../../utils/context'
import { ErrorType } from '../../../globalTypes'

import { AppForm, AppFormField, SubmitButton } from '../components/forms'
import Logo from '../components/Logo'
import { register } from '../../api/client'

export default function Register({navigation}: NativeStackScreenProps<StackScreens, 'Register'>) {
  const [error, setError] = useState<ErrorType>({})
  const { updateUser } = useContext(UserContext)

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <Logo navigation={navigation} />

      <AppForm
        initialValues={{
          username: '',
          password: ''
        }}
        onSubmit={async values => {
          const response = await register(values)
          const responseData = response?.data

          if (responseData.success === false) {
            setError(responseData)
            return
          }

          const newUser = responseData?.data?.user
          const { username } = newUser?.dataValues
          const token = newUser?.sessionToken
          
          setError({})
          updateUser({ username, token })
          navigation.navigate('App')
        }}
        error={error}
      >
        <AppFormField
          autoCapitalize='none'
          autoCorrect={false}
          keyboardType='default'
          name='username'
          textContentType='username'
          icon='account'
          placeholder='username'
          error={error.fieldMissing === 'username'}
        />

        <AppFormField
          autoCapitalize='none'
          autoCorrect={false}
          keyboardType='default'
          name='password'
          textContentType='password'
          icon='onepassword'
          placeholder='password'
          error={error.fieldMissing === 'password'}
        />

        <SubmitButton title='Register' />
        
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text>Already registered? Login</Text>
        </TouchableOpacity>
      </AppForm>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 50,
  },
});
