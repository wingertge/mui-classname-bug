const gql = require("graphql-tag")
const makeExecutableSchema = require("graphql-tools").makeExecutableSchema
const ApolloServer = require("apollo-server").ApolloServer

const baseSchema = gql`
    type Query {
        test: Int
    }
`

const resolvers = {
    Query: {
        test: () => 3
    }
}

const schema = makeExecutableSchema({
    typeDefs: [baseSchema],
    resolvers: [resolvers]
})

new ApolloServer({
    schema
}).listen(4000).then(() => console.log("Server started on port 4000"))
