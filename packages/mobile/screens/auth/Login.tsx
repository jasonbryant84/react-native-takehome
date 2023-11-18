import {StatusBar} from 'expo-status-bar';
import { useContext, useEffect, useState } from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {StackScreens} from '../../App';

import { AppForm, AppFormField, SubmitButton } from '../components/forms'
import Logo from '../components/Logo'
import { login } from '../../api/client'

import { UserContext } from '../../utils/context'
import { ErrorType } from '../../../globalTypes'

export default function Login({navigation}: NativeStackScreenProps<StackScreens, 'Login'>) {
  const [error, setError] = useState<ErrorType>({})
  const { user, updateUser } = useContext(UserContext)

  // If user is already logged in the navigate 'Home'
  useEffect(() => {
    if (user?.token) navigation.navigate('Home')
  }, [user])

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
          const response = await login(values)
          const responseData = response?.data

          const userObj = {
            username: responseData.success ? values.username : null,
            token: responseData?.success ? responseData?.data?.token : null
          }
          updateUser(userObj)

          if (response.data.success === false) {
            setError(responseData)
          } else {
            setError({})
            navigation.navigate('App')
          }
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

        <SubmitButton title='Login' />

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text>No account? Sign Up</Text>
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
