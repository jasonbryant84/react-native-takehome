
import axios from 'axios'

import { FormInputTypes } from '../screens/components/forms/AppForm'

import { UserType } from '../../globalTypes'

const baseURL = 'http://127.0.0.1:50000'
const authPath = `${baseURL}/auth`

const login = async (loginInfo: FormInputTypes) => {
    return await axios.post(`${authPath}/login`, loginInfo)
        .catch((error) => {
            return {
                status: error.response.status,
                data: error.response.data
            }
        })
}

const logout = async (user: UserType | null, updateUser: Function) => {
    if(user) {
        updateUser({ username: null, token: null })
        await axios.post(`${authPath}/logout`, { user })
        return true
    }
    
    return false
}

const register = async (registerInfo: FormInputTypes) => {
    return await axios.post(`${authPath}/register`, registerInfo)
        .catch((error) => {
            return {
                status: error.response.status,
                data: error.response.data
            }
        })
}

export {
    login,
    logout,
    register
}