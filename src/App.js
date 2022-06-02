import {useContext} from "react";
import {Routes, Route, Navigate} from 'react-router-dom'

import {AuthContext} from "./context/auth-context";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MenuBar from "./components/MenuBar";
import SinglePost from "./components/SinglePost";


const App = () => {
    const {user} = useContext(AuthContext)
    return (
        <div className='App'>
            <MenuBar/>
            <Routes>
                <Route path='/' element={<Navigate to='/home'/>}/>
                <Route path='/home' element={<Home/>}/>
                <Route path={'/post/:id'} element={<SinglePost/>}/>
                <Route path='/login' element={user ? <Navigate to='/home'/> : <Login/>}/>
                <Route path='/register' element={user ? <Navigate to='/home'/> : <Register/>}/>
                <Route path='*' element={<Navigate to='/home'/>}/>
            </Routes>
        </div>
    );
}

export default App;