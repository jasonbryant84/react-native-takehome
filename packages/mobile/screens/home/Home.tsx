import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {StackScreens} from '../../App';
import {StatusBar} from 'expo-status-bar';
import {useCallback, useContext} from 'react';
import {StyleSheet, View} from 'react-native';

import { AppButton } from '../components/forms';
import Logo from '../components/Logo';
import { UserContext } from '../../utils/context';

import { logout } from '../../api/client'

export default function Home({navigation}: NativeStackScreenProps<StackScreens, 'Home'>) {
  const { user, updateUser } = useContext(UserContext)

  const handleLoginPress = useCallback(() => navigation.navigate('Login'), [navigation?.navigate]);
  const handleRegisterPress = useCallback(() => navigation.navigate('Register'), [navigation?.navigate]);
  const handleWebviewPress = useCallback(() => navigation.navigate('App'), [navigation?.navigate]);

  const handleLogoutPress = () => logout(user, updateUser);

  return (
    <View style={styles.container}>
      <Logo />

      {!user?.token && ( // Logged Out
        <>
          <AppButton title="Login" onPress={handleLoginPress} />
          <AppButton title="Register" onPress={handleRegisterPress} />
          <AppButton title="Skip to Webview" onPress={handleLoginPress} />
        </>
      )}

      {user?.token && ( // Logged In
        <>
          <AppButton title="Sign out" onPress={handleLogoutPress} />
          <AppButton title="Skip to Webview" onPress={handleWebviewPress} />
        </>
      )}

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 50,
    marginTop: -50
  },
});
