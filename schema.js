const axios = require('axios');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} = require('graphql');


//HARDCODED DATA
// const customers = [
//   { id: '1', name: 'Quanit', email: 'quanit@gmail.com', age: 22 },
//   { id: '2', name: 'Ali', email: 'ali@gmail.com', age: 23 },
//   { id: '3', name: 'Asif', email: 'Asif@gmail.com', age: 24 },
//   { id: '4', name: 'Amir', email: 'Amir@gmail.com', age: 25 }
// ]



//CUSTOMER TYPE
const customerType = new GraphQLObjectType({
  name: 'Customer',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    age: { type: GraphQLInt },
  })
});

//ROOT QUERY
const rootQuery = new GraphQLObjectType({
  name: 'RootQuerytype',
  fields: {
    customer: {
      type: customerType,
      args: {
        id: { type: GraphQLString }
      },
      resolve(parentValue, args) {
        // for (let i = 0; i < customers.length; i++) {
        //   if (customers[i].id === args.id) {
        //     return customers[i];
        //   }
        // }
        return axios.get('http://localhost:3000/customers/' + args.id)
          .then(res => res.data)

      }
    },
    customers: {
      type: new GraphQLList(customerType),
      resolve(parentValue, args) {
        // return customers;
        return axios.get('http://localhost:3000/customers/')
          .then(res => res.data);
      }
    }

  }
});

const mutation = new GraphQLObjectType({
  name: 'mutation',
  fields: {
    addCustomer: {
      type: customerType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) }
      },
      resolve(parentValue, args) {
        return axios.post('http://localhost:3000/customers/', {
          name: args.name,
          email: args.email,
          age: args.age
        }).then(res => res.data)
      }
    },
    deleteCustomer: {
      type: customerType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parentValue, args) {
        return axios.delete('http://localhost:3000/customers/' + args.id)
          .then(res => res.data)
      }
    },
    updateCustomer: {
      type: customerType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        age: { type: GraphQLInt }
      },
      resolve(parentValue, args) {
        return axios.patch('http://localhost:3000/customers/' + args.id, args)
          .then(res => res.data)
      }
    },
  }
});



module.exports = new GraphQLSchema({
  query: rootQuery,
  mutation
});