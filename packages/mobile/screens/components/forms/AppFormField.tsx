import React from 'react'
import { DimensionValue, View } from 'react-native'
import { useFormikContext } from 'formik'

import AppTextInput from './AppTextInput'

interface FormFieldTypes {
    name: string;
    width?: DimensionValue;
    otherProps?: any;
    autoCapitalize?: string;
    autoCorrect?: boolean;
    keyboardType?: string;
    textContentType?: string;
    icon?: string;
    placeholder?: string;
    error: boolean;
}

interface FormikContextTypes {
    [key: string]: string
}

export default function FormField(fieldInput: FormFieldTypes) {
    const { name, icon, textContentType = '', width = '100%', error, ...otherProps } = fieldInput;

    const { 
        setFieldTouched, 
        setFieldValue,
        values
    } = useFormikContext<FormikContextTypes>()

    return (
        <View style={[{ width }]}>
            <AppTextInput
                onBlur={() => setFieldTouched(name)}
                onChangeText={text => setFieldValue(name, text)}
                textContentType={textContentType}
                value={values[name]}
                icon={icon}
                error={error}
                { ...otherProps }
            />
        </View>
    )
}