import React, {useState} from 'react';
import {gql, useMutation} from "@apollo/client";
import DeleteIcon from '@mui/icons-material/Delete';
import {Button, Modal, Typography, Box} from "@mui/material";
import {FETCH_POSTS_QUERY} from "../context/graphql";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const DeleteButton = ({postId, commentId, callback}) => {
    const [open, setOpen] = useState(false)

    //判断是删除评论还是删除post 只有commentId存在时才是删除评论
    const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION

    const [deleteMutation] = useMutation(mutation, {
        variables: {
            postId,
            commentId
        },
        //添加二次确认框
        update(proxy){
            //关闭modal
            setOpen(false)
            console.log(commentId)

            if (!commentId) {
                //remove post from cache
                const data = proxy.readQuery({
                    query: FETCH_POSTS_QUERY
                })
                // data.getPosts = data.getPosts.filter(p => p.id !== postId)
                proxy.writeQuery({
                    query: FETCH_POSTS_QUERY,
                    data: {
                        getPosts: data.getPosts.filter(p => p.id !== postId)
                    }})

                //如果有重定向callback 执行callback
                if (callback) {
                    callback()
                }
            }
        }
    })

    return (
        <div>
            <Button onClick={()=>setOpen(true)}><DeleteIcon/></Button>
            <Modal
                open={open}
                // aria-labelledby="modal-modal-title"
                // aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        {`Would you confirm to delete the ${commentId ? 'comment' : 'post'} ?`}
                    </Typography>
                    <br/>
                    <Button onClick={deleteMutation} size='small' variant="contained">CONFIRM</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                    <Button onClick={()=>setOpen(false)} size='small' variant='outlined'>CANCEL</Button>
                </Box>
            </Modal>
        </div>
    );
};



const DELETE_POST_MUTATION = gql`
    mutation deletePost($postId: ID!){
        deletePost(postId: $postId)
    }
`

const DELETE_COMMENT_MUTATION = gql`
    mutation deleteComment($postId: ID!, $commentId: ID!){
        deleteComment(postId: $postId, commentId: $commentId){
            id
            comments{
                id username createdAt body
            }
            commentCount
        }
    }
`

export default DeleteButton;
