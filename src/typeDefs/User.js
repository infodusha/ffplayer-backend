import apollo from 'apollo-server-express';

export const User = apollo.gql`
  type User implements Client {
    id: ID!
    pic: String!
    name: String!
    games: [Game]
    reviews: [Review]
    trains: Int!
    online: Boolean!
  }
`;
