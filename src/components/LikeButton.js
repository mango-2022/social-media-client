import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import {gql, useMutation} from "@apollo/client";

import Button from "@mui/material/Button";
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';

const LikeButton = ({user, post}) => {
    const {id, likes, likeCount} = post
    const [liked, setLiked] = useState(false)
    useEffect(()=>{
        if (user && likes.find(like => like.username === user.username)) {
            setLiked(true)
        } else {
            setLiked(false)
        }
    }, [user, likes])

    const [likePost] = useMutation(LIKE_POST_MUTATION, {
        variables: {postId: id}
    })

    //有user 判断是否like， 没user，点击跳转login
    const likeButton = user
        ? (liked
            ? <Button size='small'><FavoriteRoundedIcon/></Button>
            : <Button size='small'><FavoriteBorderRoundedIcon/></Button>)
        : <Button size="small" as={Link} to='/login'><FavoriteBorderRoundedIcon /></Button>
    return (
        <div onClick={likePost}>
            {likeButton}
            {likeCount}
        </div>
    );
};

const LIKE_POST_MUTATION = gql`
    mutation likePost($postId: ID!){
        likePost(postId: $postId){
            id
            likes{
                id username
            }
            likeCount
        }
    }
`

export default LikeButton;
