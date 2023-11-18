import React from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';

const logoImage = require('../../assets/LogoBlack.png')

interface LogoType {
  navigation?: any;
}

const handleNav = (navigation: any) => {
    if (!navigation) return

    navigation.navigate('Home')
}

export default function Logo(logoInfo: LogoType) {
  const { navigation } = logoInfo;

  return (
    <>
      {navigation ? (
        <TouchableOpacity onPress={() => handleNav(navigation)} activeOpacity={1}>
          <Image source={logoImage} style={styles.image} />
        </TouchableOpacity>
        ) : (
        <Image source={logoImage} style={styles.image} />
      )}
    </>
  )
}

const styles = StyleSheet.create({
  image: {
    width: 151, // 251
    height: 38, // 64
    marginBottom: 5,
  },
});
