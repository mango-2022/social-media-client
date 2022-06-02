import React, {useContext} from 'react';
import {Link} from "react-router-dom";
import moment from "moment";

import {CardActions, CardContent, Button, Typography} from '@mui/material';
import ForumRoundedIcon from '@mui/icons-material/ForumRounded';
import NoteAltRoundedIcon from '@mui/icons-material/NoteAltRounded';

import {AuthContext} from "../context/auth-context";
import LikeButton from "./LikeButton";
import DeleteButton from "./DeleteButton";
import Card from "../UI/Card";

import '../App.css'

export default function PostCard(props) {
    const {user} = useContext(AuthContext);
    const {id, username, createdAt, likeCount, likes, commentCount, body} = props.post
    return (
        <Card  className='post-card' >
            <CardContent>
                <Typography variant="h5" component="div">
                    {username}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    {moment(createdAt).fromNow(true)}
                </Typography>
                <Typography variant="h4">
                    <NoteAltRoundedIcon size='large'/>&nbsp;{body}
                    <br />
                </Typography>
            </CardContent>
            <CardActions>
                <LikeButton user={user} post={{id, likes, likeCount}}/>
                {/*<Button size="small">Likes {likeCount}</Button>*/}
                <Link to={`/post/${id}`}>
                    <Button size="small"><ForumRoundedIcon/></Button>
                </Link>
                {commentCount}
                {user && user.username === username && <DeleteButton postId={id}/>}
            </CardActions>
        </Card>
    );
}
