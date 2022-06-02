import React, {useState, useContext} from 'react';
import {useNavigate} from 'react-router-dom'
import {useMutation, gql} from "@apollo/client";

import {Button, TextField} from '@mui/material';

import {AuthContext} from "../context/auth-context";
import {useForm} from "../hooks/useForm";
import '../App.css'

const Register = () => {
    const authCtx = useContext(AuthContext)
    const navigate = useNavigate()
    const [errors, setErrors] = useState({})

    const {onChange, onSubmit, values} = useForm(registerUser, {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    })

    const [addUser] = useMutation(REGISTER_USER, {
        update(_, {data: {register: userData}}) {
            // console.log(result)
            authCtx.login(userData)
            navigate('/home', {replace: true})
        },

        onError(error) {
            setErrors(error.graphQLErrors[0].extensions.errors)
            console.log(error.graphQLErrors[0].extensions.errors)
        },
        variables: values
    })

    //function开头的函数都会先加载
    function registerUser() {
        addUser()
    }

    return (
        <div className='form-container'>
            <form onSubmit={onSubmit} noValidate autoComplete='off'>
                <h1>Register</h1>
                <TextField
                    label="Username"
                    placeholder="Username"
                    name="username"
                    type="text"
                    value={values.username}
                    error={!!errors.username}
                    onChange={onChange}
                    fullWidth
                    id="username" variant="outlined"/>
                <br/>
                <br/>
                <TextField
                    label="Email"
                    placeholder="Email"
                    name="email"
                    type="email"
                    value={values.email}
                    error={!!errors.email}
                    onChange={onChange}
                    fullWidth
                    id="email" variant="outlined"/>
                <br/>
                <br/>
                <TextField
                    label="Password"
                    placeholder="Password"
                    name="password"
                    type="password"
                    value={values.password}
                    error={!!errors.password}
                    onChange={onChange}
                    fullWidth
                    id="password" variant="outlined"/>
                <br/>
                <br/>
                <TextField
                    label="ConfirmPassword"
                    placeholder="ConfirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={values.confirmPassword}
                    error={!!errors.confirmPassword}
                    onChange={onChange}
                    fullWidth
                    id="confirmPassword" variant="outlined"/>
                <br/>
                <br/>
                <Button size='large' type="submit" variant="contained">Register</Button>
            </form>
            <br/>
            {Object.keys(errors).length > 0 && (
                <div>
                    <ul>
                        {Object.values(errors).map(value => (
                            <li key={value}>{value}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

const REGISTER_USER = gql`
    mutation register(
        $username: String!
        $email: String!
        $password: String!
        $confirmPassword: String!
    ){
        register(
            registerInput: {
                username: $username
                email: $email
                password: $password
                confirmPassword: $confirmPassword
            }){
            id email username createdAt token
        }
    }
`

export default Register;
