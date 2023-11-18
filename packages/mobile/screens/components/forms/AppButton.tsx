import React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'

import colors from '../../config/colors'

interface ButtonTypes {
    title: string;
    onPress: () => void;
    color?: string;
    style?: any;
}

export default function AppButton(buttonInfo: ButtonTypes) {
    const { title, onPress, color = 'primary', style = {} } = buttonInfo

    return (
        <TouchableOpacity 
            style={[styles.button, style /*, { backgroundColor: colors[color] }*/]}
            onPress={onPress}
        >
            <Text style={styles.text}>{title}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button : {
        backgroundColor: true ? colors.primary : colors.secondary,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
        width: '100%',
        marginVertical: 10
    },
    text: {
        fontSize: 18,
        color: colors.white,
        fontWeight: 'bold'
    }
})
