import apollo from 'apollo-server-express';

export default apollo.gql`
  interface Client {
    id: ID!
    pic: String!
    name: String!
    games: [Game]
    trains: Int!
    online: Boolean!
  }
`;
