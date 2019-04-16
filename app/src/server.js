import App from './App'
import React from 'react'
import {StaticRouter} from 'react-router-dom'
import express from 'express'
import {renderToString} from 'react-dom/server'
import {ApolloProvider, getMarkupFromTree} from "react-apollo-hooks"
import {createHttpLink} from "apollo-link-http"
import {ApolloClient} from "apollo-client"
import {InMemoryCache} from "apollo-cache-inmemory"
import {ServerStyleSheets, ThemeProvider} from "@material-ui/styles"
import theme from "./theme"
import fetch from "node-fetch"
import serialize from "serialize-javascript"
import CssBaseline from "@material-ui/core/CssBaseline"

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST)


const server = express()
server
    .disable('x-powered-by')
    .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
    .get('/*', async (req, res) => {
        const context = {}

        const httpLink = createHttpLink({
            uri: "http://localhost:4000",
            fetch
        })

        const client = new ApolloClient({
            link: httpLink,
            cache: new InMemoryCache()
        })

        const sheets = new ServerStyleSheets()

        const markup = await getMarkupFromTree({
            tree: sheets.collect(
                <ApolloProvider client={client}>
                    <ThemeProvider theme={theme}>
                        <StaticRouter context={context} location={req.url}>
                            <CssBaseline />
                            <App/>
                        </StaticRouter>
                    </ThemeProvider>
                </ApolloProvider>
            ),
            renderFunction: renderToString
        })

        const css = sheets.toString()
        const initialState = client.extract()

        if (context.url) {
            res.redirect(context.url)
        } else {
            res.status(200).send(
                `<!doctype html>
    <html lang="">
    <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta charset="utf-8" />
        <title>Welcome to Razzle</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
     
        ${
                    assets.client.css
                        ? `<link rel="stylesheet" href="${assets.client.css}">`
                        : ''
                    }
        ${
                    process.env.NODE_ENV === 'production'
                        ? `<script src="${assets.client.js}" defer></script>`
                        : `<script src="${assets.client.js}" defer crossorigin></script>`
                    }
        <style id="jss-server-side">${css}</style>
    </head>
    <body>
        <div id="root">${markup}</div>
        <script>
            window.__PRELOADED_STATE__ = ${serialize(initialState)}
        </script>
    </body>
</html>`
            )
        }
    })

export default server
