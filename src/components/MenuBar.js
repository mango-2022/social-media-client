import * as React from 'react';
import {useContext} from "react";
import {Link} from "react-router-dom";

import {AuthContext} from "../context/auth-context";

import {AppBar, Box, Toolbar, Typography, Button, IconButton} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

import './MenuBar.css'

export default function MenuBar() {
    const {user, logout} = useContext(AuthContext)
    const menuBar = user
        ? (<Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography as={Link} to='/home' variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Welcome Back {user.username} !
                    </Typography>
                    <Button
                        color="inherit"
                        onClick={logout}
                    >Logout</Button>
                </Toolbar>
            </AppBar>
        </Box>)
        : (<Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
            <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                >
                    <MenuIcon />
                </IconButton>
                <Typography as={Link} to='/home' variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Posts
                </Typography>
                <Button color="inherit" as={Link} to='/login'>Login</Button>
                <Button color="inherit" as={Link} to='/register'>Register</Button>
            </Toolbar>
        </AppBar>
    </Box>)

    return menuBar;
}

