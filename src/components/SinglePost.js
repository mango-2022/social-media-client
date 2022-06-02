import React, {useContext, useRef, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {gql, useMutation, useQuery} from "@apollo/client";
import moment from "moment";

import LikeButton from "./LikeButton";
import DeleteButton from "./DeleteButton";
import {AuthContext} from "../context/auth-context";
import Card from "../UI/Card";

import ForumRoundedIcon from '@mui/icons-material/ForumRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import {Button, TextField, CardActions, CardContent, Typography, Avatar} from "@mui/material";

import '../App.css'

const SinglePost = () => {
    const params = useParams()
    const navigate = useNavigate()
    const commentInputRef = useRef()
    const [comment, setComment] = useState('')

    const {user} = useContext(AuthContext)
    const postId = params.id

    const {data: {getPost} = {}} = useQuery(FETCH_POST_QUERY, {
        update(){
            setComment('')
            //input框失去焦点 out focus
            commentInputRef.current.blur()
        },
        variables: {
            postId,
            body: comment
        }
    })

    const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
        variables: {
            postId,
            body: comment
        }
    })

    const deletePostCallback = () => {
        navigate('/home', {replace:true})
    }

    let postMarkup;
    if (!getPost) {
        postMarkup = <p>Loading post...</p>
    } else {
        const {id, body, createdAt, username, comments, commentCount} = getPost
        const usernameAvatar = username.toString().charAt(0).toUpperCase()
        postMarkup = (
            <div className='single-page-container'>
                <div className='single-page-left'><Avatar sx={{width: 100, height: 100}}><h1>{usernameAvatar}</h1></Avatar></div>
                <div className='single-page-right'>
                    <Card>
                        <CardContent>
                            <Typography variant="h5" component="div">
                                <AccountCircleRoundedIcon/>&nbsp;{username}
                            </Typography>
                            <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                <AccessTimeRoundedIcon size='small'/>&nbsp;{moment(createdAt).fromNow(true)}
                            </Typography>
                            <Typography variant="h4">
                                {/*{`"${body}"`}*/}
                                {body}
                                <br />
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <LikeButton user={user} post={getPost}/>
                            <Button size="small"><ForumRoundedIcon/></Button>
                            {commentCount}
                            {user && user.username === username && <DeleteButton postId={id} callback={deletePostCallback}/>}
                        </CardActions>
                    </Card>

                    {user && (<form noValidate autoComplete='off'>
                        <TextField
                            label="Create a comment:"
                            placeholder="Leave your comment.."
                            name="body"
                            type="text"
                            value={comment}
                            onChange={event => setComment(event.target.value)}
                            ref={commentInputRef}
                            fullWidth
                            id="body" variant="outlined"/>
                        <br/>
                        <br/>
                        <Button
                            disabled={comment.trim() === ''}
                            onClick={submitComment}
                            type="submit"
                            variant="contained">Submit</Button>
                        <br/>
                    </form>)}
                    <div>
                        {comments.length > 0 ? <h2>Comments:</h2> : <h2>Leave your comment!</h2>}
                        {comments && comments.map(comment => (
                            <Card key={comment.id}>
                                <CardContent>
                                    <Typography variant="h5" component="div">
                                        <AccountCircleRoundedIcon/>&nbsp;{comment.username}&nbsp;
                                    </Typography>
                                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                        <AccessTimeRoundedIcon size='small'/>&nbsp;{moment(comment.createdAt).fromNow(true)}
                                    </Typography>
                                    <Typography variant="h4">
                                        {comment.body}
                                        <br />
                                    </Typography>
                                </CardContent>
                                {user && user.username === comment.username && (
                                    <DeleteButton postId={id} commentId={comment.id}/>
                                )}
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        )
        return postMarkup
    }

    return (
        <div>
            {postMarkup}
        </div>
    );
};

const SUBMIT_COMMENT_MUTATION = gql`
    mutation($postId: ID!, $body: String!){
        createComment(postId: $postId, body: $body){
            id
            comments {
                id body createdAt username
            }
            commentCount
        }
    }
`

const FETCH_POST_QUERY = gql`
    query($postId: ID!){
        getPost(postId: $postId) {
            id body createdAt username likeCount
            likes{
                username
            }
            commentCount
            comments{
                id username createdAt body
            }
        }
    }
`
export default SinglePost;
