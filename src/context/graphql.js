import {gql} from "@apollo/client";

export const FETCH_POSTS_QUERY = gql`
    {
        getPosts {
            id
            body
            createdAt
            username
            likeCount
            likes {username}
            commentCount
            comments {
                id
                username
                createdAt
                body
            }
        }
    }
`

export const FETCH_POST_QUERY = gql`
    query getPost($postId: ID!){
            getPost(postId: $postId){
                id body createdAt username
                commentCount
                comments {
                    id username createdAt body
                }
        }
    }
`