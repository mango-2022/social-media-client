import React from 'react';
import ReactDOM from 'react-dom/client'
import {BrowserRouter} from "react-router-dom";
import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider, createHttpLink,
    // useQuery,
    // gql
} from "@apollo/client";
import {setContext} from 'apollo-link-context'
import {AuthProvider} from "./context/auth-context";

import App from './App'

const httpLink = createHttpLink({
    uri: 'http://localhost:5000'
})
const authLink = setContext(() => {
    const token = localStorage.getItem('jwtToken')
    return {
        headers: {
            Authorization: token ? `Bearer ${token}` : ''
        }
    }
})

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ApolloProvider client={client}>
        <BrowserRouter>
            <AuthProvider>
                <App />
            </AuthProvider>
        </BrowserRouter>
    </ApolloProvider>
);
