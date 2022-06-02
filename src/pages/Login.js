import React, {useContext, useState} from 'react';
import {useNavigate} from 'react-router-dom'
import {useMutation, gql} from "@apollo/client";

import {Button, TextField} from '@mui/material';

import {AuthContext} from "../context/auth-context";
import {useForm} from "../hooks/useForm";
import '../App.css'

const Login = () => {
    const authCtx = useContext(AuthContext)

    const navigate = useNavigate()

    const [errors, setErrors] = useState({})

    const {onChange, onSubmit, values} = useForm(loginUserCallBack, {
        username: '',
        password: '',
    })

    const [loginUser] = useMutation(LOGIN_USER, {
        update(_, {data: {login: userData}}){
            // console.log(result.data.login)
            // console.log(userData)
            //useContext login pass user data
            authCtx.login(userData)
            //redirect
            navigate('/home', {replace: true})
        },
        onError(error) {
            setErrors(error.graphQLErrors[0].extensions.errors)
            console.log(error.graphQLErrors[0].extensions.errors)
        },
        variables: values
    })

    //function开头的函数都会先加载
    function loginUserCallBack(){
        loginUser()
    }

    return (
        <div className='form-container'>
            <form onSubmit={onSubmit} noValidate autoComplete='off'>
                <h1>Login</h1>
                <TextField
                    label="Username"
                    placeholder="Username"
                    name="username"
                    type="text"
                    value={values.username}
                    error={!!errors.username}
                    onChange={onChange}
                    fullWidth
                    id="username" variant="outlined" />
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
                    id="password" variant="outlined" />
                <br/>
                <br/>
                <Button size='large' type="submit" variant="contained">Login</Button>
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

const LOGIN_USER = gql`
    mutation login(
        $username: String!
        $password: String!
    ){
        login(
                username: $username
                password: $password
            ){
            id email username createdAt token
        }
    }
`
export default Login;
