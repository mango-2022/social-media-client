import React from 'react';
import {gql, useMutation} from "@apollo/client";

import {useForm} from "../hooks/useForm";
import {FETCH_POSTS_QUERY} from "../context/graphql";

import {TextField, Button} from "@mui/material";

const PostForm = () => {
    const {values, onChange, onSubmit} = useForm(createPostCallback, {
        body: ''
    })

    const [createPost, {error}] = useMutation(CREATE_POST_MUTATION, {
        variables: values,
        //apollo cache 每次创建post的时候都去后台拿所有数据 并把最新的写在第一个
        //client side query
        update(proxy, result) {
            const data = proxy.readQuery({
                query: FETCH_POSTS_QUERY
            })
            proxy.writeQuery({
                query: FETCH_POSTS_QUERY,
                data: {
                    ...data,
                    getPosts: [result.data.createPost, ...data.getPosts],
                },
            });
            console.log(result)
            values.body = ''
        }
    })

    function createPostCallback() {
        createPost()
    }

    return (
        <div>
            <form onSubmit={onSubmit} noValidate autoComplete='off'>
                <TextField
                    label="Create a Post:"
                    placeholder="Hi world!"
                    name="body"
                    type="text"
                    value={values.body}
                    // error={!!errors.password}
                    onChange={onChange}
                    fullWidth
                    id="body" variant="outlined"/>
                <br/>
                <br/>
                <Button type="submit" variant="contained">Submit</Button>
                <br/>
                <br/>
            </form>
            {error && (
                <div>
                    <ul>
                        <li>{error.graphQLErrors[0].message}</li>
                    </ul>
                </div>
            )}
        </div>
    );
};

const CREATE_POST_MUTATION = gql`
    mutation createPost($body: String!){
        createPost(body: $body){
            id body createdAt username
            likeCount
            likes{
                id username createdAt
            }
            commentCount
            comments{
                id body username createdAt
            }
        }
    }
`

export default PostForm;
