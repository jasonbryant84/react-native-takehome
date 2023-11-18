import React from 'react'
import { DimensionValue, StyleSheet, TextInput, View } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'

import defaultStyles from '../../config/styles'


interface AppTextFormInputTypes {
    icon?: string | any;
    width?: DimensionValue;
    onBlur?: () => void;
    onChangeText?: (text: any) => void;
    textContentType?: string;
    value: any;
    error: boolean;
}

export default function AppTextInput(formTextFieldInput: AppTextFormInputTypes) {
    const { icon, textContentType = '', width = '100%', error, ...otherProps } = formTextFieldInput;

    return (
        <View style={[styles.container, { width }, error && styles.errorBorder]}>
            { icon && 
                <MaterialCommunityIcons 
                    name={icon} 
                    size={20} 
                    color={defaultStyles.colors.medium} 
                    style={styles.icon} 
                /> 
            }
            <TextInput 
                style={[defaultStyles.text, styles.text]}
                secureTextEntry={textContentType === 'password'}
                placeholderTextColor={defaultStyles.colors.medium}
                {...otherProps} 
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        backgroundColor: defaultStyles.colors.light,
        borderRadius: 30,
        flexDirection: 'row',
        paddingVertical: 15,
        paddingLeft: 16,
        marginBottom: 20,
        borderColor: defaultStyles.colors.medium,
        borderWidth: 1,
    },
    icon: {
        paddingTop: 3,
        marginRight: 10
    },
    text: {
        width: '100%'
    },
    errorBorder: {
        borderColor: defaultStyles.colors.danger,
    }
})