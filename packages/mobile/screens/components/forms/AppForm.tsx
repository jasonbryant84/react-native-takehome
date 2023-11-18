import { Formik } from 'formik'
import { StyleSheet, Text, View} from 'react-native'

import { ErrorType } from '../../../../globalTypes';


export interface FormInputTypes {
    username: string;
    password: string;
}

interface FormTypes {
    initialValues: FormInputTypes,
    onSubmit: (values: FormInputTypes) => void,
    error?: ErrorType,
    children?: any
}

export default function AppForm(formInput: FormTypes) {
    const { initialValues, onSubmit, error, children } = formInput;

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
        >
            {() => (
                <>
                    {error && (
                        <View style={[styles.errorContainer]}>
                            <Text style={styles.errorMsg}>{error.message}</Text>
                        </View>
                    )}
                    {children}
                </>
            )}
        </Formik>
    )
}

const styles = StyleSheet.create({
    errorContainer: {
      display: 'flex',
      width: '100%',
      alignItems: 'center',
      height: 16,
      marginBottom: 8,
    },
    errorMsg: {
      color: 'red',
    }
});