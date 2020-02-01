const app = require("express")();
const expressGraphQL = require("express-graphql");
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLInt,
  GraphQLString,
  GraphQLNonNull
} = require("graphql");

const books = [
  {
    id: 1,
    name: "Harry Potter and the Chamber of Secrets",
    authorId: 1
  },
  {
    id: 2,
    name: "Harry Potter and the Prisoner of Azkaban",
    authorId: 1
  },
  { id: 3, name: "Harry Potter and the Goblet of Fire", authorId: 1 },
  { id: 4, name: "The Fellowship of the Ring", authorId: 2 },
  { id: 5, name: "The Two Towers", authorId: 2 },
  { id: 6, name: "The Return of the King", authorId: 2 },
  { id: 7, name: "The Way of Shadows", authorId: 3 },
  { id: 8, name: "Beyond the Shadows", authorId: 3 }
];

// const schema = new GraphQLSchema({
//   query: new GraphQLObjectType({
//     name: 'HelloWorld',
//     fields: () => ({
//       message: { type: GraphQLString, resolve: () => "Hello from GQL" }
//     })
//   })
// });
const AuthorType = new GraphQLObjectType({
  name: "Author",
  description: "This represents an Author of a book",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    books: {
      type: GraphQLList(BookType),
      resolve: author => {
        return books.filter(book => book.authorId === author.id);
      }
    }
  })
});

const BookType = new GraphQLObjectType({
  name: "Book",
  description: "This represents a book written by an author",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    authorId: { type: GraphQLNonNull(GraphQLInt) },
    author: {
      type: AuthorType,
      resolve: book => {
        return authors.find(author => author.id === book.authorId);
      }
    }
  })
});

const RootQueryType = new GraphQLObjectType({
  name: "Query",
  description: "Root Query",
  fields: () => ({
    book: {
      type: BookType,
      description: "Getting Single Book",
      args: {
        id: { type: GraphQLInt }
      },
      resolve: (parent, args) => books.find(book => book.id == args.id)
    },
    author: {
      type: AuthorType,
      description: "Getting Single Author",
      args: {
        id: { type: GraphQLInt }
      },
      resolve: (parent, args) => authors.find(author => author.id === args.id)
    },
    books: {
      type: new GraphQLList(BookType),
      description: "List of Books",
      resolve: () => books
    },
    authors: {
      type: new GraphQLList(AuthorType),
      description: "List of all authors",
      resolve: () => authors
    }
  })
});

const RootMutationType = new GraphQLObjectType({
  name: "Mutation",
  description: "Root Mutation",
  fields: () => ({
    addBook: {
      type: BookType,
      description: "Inserting a new Book",
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        authorId: { type: GraphQLNonNull(GraphQLInt) }
      },
      resolve: (parent, { name, authorId }) => {
        const book = { id: books.length + 1, name, authorId };
        console.log(book);
        books.push(book);
        return book;
      }
    },
    updateBook: {
      type: BookType,
      description: "Updating a Book",
      args: {
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: (parent, { id, name }) => {
        const book = books.find(book => book.id === id);
        book.name = name;
        // book.map(bookObj => books.find(bookObj2 => bookObj2.id === bookObj.id) || bookObj);   
        return book;
      }
    }
  })
});

const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType
});

app.use(
  "/graphql",
  expressGraphQL({
    schema,
    graphiql: true
  })
);

app.listen(4040, () => console.log(`Server is running on port 4040`));

const authors = [
  { id: 1, name: "J. K. Rowling" },
  { id: 2, name: "J. R. R. Tolkien" },
  { id: 3, name: "Brent Weeks" },
  { id: 4, name: "Jabir bin hayan" }
];
