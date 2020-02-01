var express = require('express');
var graphQLHTTP = require('express-graphql');
var { graphql, buildSchema, GraphQLObjectType, GraphQLSchema, GraphQLList, GraphQLInt, GraphQLString } = require('graphql');

const customers = [
  { id: '1', name: 'Quanit', email: 'quanit@gmail.com', age: 22 },
  { id: '2', name: 'Ali', email: 'ali@gmail.com', age: 23 },
  { id: '3', name: 'Asif', email: 'Asif@gmail.com', age: 24 },
  { id: '4', name: 'Amir', email: 'Amir@gmail.com', age: 25 }
]

const userType = new GraphQLObjectType({
  name: 'Users',
  fields: {
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
  }
});

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    description: 'Query for graphql',
    fields: () => ({
      customers: {
        type: new GraphQLList(userType),
        resolve: (parent, args) => customers
      },
      customer: {
        type: userType,
        args: {
          id: { type: GraphQLInt }
        },
        resolve: (parent, args) => {
          const singleCustomer = customers.filter(customer => customer.id == args.id);
          return singleCustomer[0];
        }
      }
    })
  })
});

const app = express();

app.use('/graphql', graphQLHTTP({
  schema,
  graphiql: true
}));

app.get('/', (req, res) => {
  const query = `query {customers{id name age}}`;
  graphql(schema, `{customers{id name age}}`, query)
    .then(resp => res.send(resp))
    .catch(err => res.send(err));
});

app.get('/:id', (req, res) => {
  const query = `query {customer(id: ${req.params.id}){id name age}}`;
  graphql(schema, query)
    .then(resp => res.send(resp))
    .catch(err => res.send(err));
});

app.listen(4040, () => console.log('Running a GraphQL API server at http:localhost:4040/graphql'));