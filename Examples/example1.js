const { graphql, buildSchema } = require('graphql');

/* Basic syntax for GraphQL */

// Construct a schema, using GraphQL schema language
var schema = buildSchema(
  `type Query {
    hello: String
  }`
);

// The root provides a resolver function for each API endpoint
const root = {
  hello: () => 'Hello World!'
}

// Run the GraphQL query '{ hello }' and print out the response
graphql(schema, '{hello}', root).then(res => console.log(res));