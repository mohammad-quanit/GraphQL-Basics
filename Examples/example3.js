var express = require('express');
var graphQLHTTP = require('express-graphql');
var { buildSchema } = require('graphql');

var schema = buildSchema(`
  type Query {
    quoteOfTheDay: String
    random: Float!
    rollThreeDice: [Int]
  }
`);

var root = {
  quoteOfTheDay: () => Math.random() < 0.5 ? 'Take it Easy' : 'Salvation lies within!',
  random: () => Math.random(),
  rollThreeDice: () => [1, 2, 3].map(data => 1 + Math.floor(Math.random() * 6))
}

const app = express();

app.use('/graphql', graphQLHTTP({
  schema,
  rootValue: root,
  graphiql: true
}));


app.listen(4040, () => console.log('Running a GraphQL API server at http:localhost:4040/graphql'));