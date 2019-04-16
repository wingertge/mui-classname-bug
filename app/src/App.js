import React from 'react';
import Route from 'react-router-dom/Route';
import Switch from 'react-router-dom/Switch';
import Home from './Home';
import './App.css';
import {useQuery} from "react-apollo-hooks"
import CircularProgress from "@material-ui/core/CircularProgress"
import Typography from "@material-ui/core/Typography"
import TextField from "@material-ui/core/TextField"
import gql from "graphql-tag"

const query = gql`
    query {
        test
    }
`

const App = () => {
    const {data, loading, error} = useQuery(query)
    const result = data && data.test

    if(error) return <Typography variant="h5" color="error">{error.message}</Typography>
    if(loading) return <CircularProgress />

    return (
        <div>
            <TextField value={result} />
            <Switch>
                <Route exact path="/" component={Home}/>
            </Switch>
        </div>
    )
};

export default App;
