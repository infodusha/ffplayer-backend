import apollo from 'apollo-server-express';

export default apollo.gql`
  type User implements Client {
    id: ID!
    pic: String!
    name: String!
    games: [Game]
  }
`;
