import App from './App';
import BrowserRouter from 'react-router-dom/BrowserRouter';
import React, {useEffect} from 'react'
import { hydrate } from 'react-dom';
import ThemeProvider from "@material-ui/styles/ThemeProvider"
import theme from "./theme"
import {createHttpLink} from "apollo-link-http"
import {ApolloClient} from "apollo-client"
import {InMemoryCache} from "apollo-cache-inmemory"
import {ApolloProvider} from "react-apollo-hooks"
import CssBaseline from "@material-ui/core/CssBaseline"

const httpLink = createHttpLink({
    uri: "http://localhost:4000"
})

const cache = new InMemoryCache().restore(window.__PRELOADED_STATE__)

const client = new ApolloClient({
    link: httpLink,
    cache
})

const Main = () => {
    useEffect(() => {
        const jssStyles = document.querySelector("#jss-server-side")
        if (jssStyles) {
            jssStyles.parentNode.removeChild(jssStyles)
        }
    }, [])

    return (
        <ApolloProvider client={client}>
            <ThemeProvider theme={theme}>
                <BrowserRouter>
                    <CssBaseline />
                    <App />
                </BrowserRouter>
            </ThemeProvider>
        </ApolloProvider>
    )
}

hydrate(
  <Main />,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept();
}
