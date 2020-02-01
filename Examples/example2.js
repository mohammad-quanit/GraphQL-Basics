const express = require('express');
const graphQLHTTP = require('express-graphql');
const { buildSchema } = require('graphql');

/* counstruct a schema, using GraphQL schema Language */
const schema = buildSchema(`
  type Query {
    hello: String
  }
`);

/* The root provides a resolver fucntion for each API endpoint */
const root = {
  hello: () => 'Hello World!'
};

const app = express();

app.use('/graphql', graphQLHTTP({
  schema,
  rootValue: root,
  graphiql: true
}));


app.listen(4040, () => console.log('Running a GraphQL API server at http:localhost:4040/graphql'));

