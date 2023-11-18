import {StatusBar} from 'expo-status-bar';
import {useContext, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {StackScreens} from '../../App';
import {WebView as NativeWebView} from 'react-native-webview';

import {UserContext} from '../../utils/context'

export default function WebView({navigation}: NativeStackScreenProps<StackScreens, 'App'>) {
  const { user } = useContext(UserContext)

  useEffect(() => {
    if (!user?.token) {
      navigation.navigate('Login')
    }
  })

  return (
    <View style={styles.container}>
      <NativeWebView source={{
        uri:  process.env.EXPO_PUBLIC_WEBAPP_ROOT as string,
        headers: {
          Cookie: `SESSION_TOKEN=${user?.token};`,
        },
      }} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
