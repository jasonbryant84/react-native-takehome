import React from 'react'
import { StyleSheet, View } from 'react-native';
import { useFormikContext } from 'formik'

import AppButton from './AppButton'

interface ButtonType {
    title: string;
}

export default function SubmitButton(buttonInfo: ButtonType) {
    const { title } = buttonInfo;

    const { handleSubmit } = useFormikContext()
    return (
        <AppButton
            style={styles.container}
            title={title}
            onPress={handleSubmit}
        />
    )
}

const styles = StyleSheet.create({
    container: {
      marginBottom: 40
    },
  });
  