import React, {useContext} from 'react';
import {useQuery} from "@apollo/client";

import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";
import {AuthContext} from "../context/auth-context";
import {FETCH_POSTS_QUERY} from "../context/graphql";

import '../App.css'

const Home = () => {
    const {user} = useContext(AuthContext)
    const {loading, data} = useQuery (FETCH_POSTS_QUERY)

    return (
        <>
            <h1>Recent Posts:</h1>
            {user && <PostForm/>}
            <div className='post-card-container'>
                {loading
                    ? (<h1>Loading posts...</h1>)
                    : (data.getPosts.map(post =>
                        <PostCard key={post.id} post={post}/>
                    ))}
            </div>
        </>
    );
};



export default Home;
