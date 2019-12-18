import apollo from 'apollo-server-express';

export const SelfUser = apollo.gql`
  type SelfUser {
    id: ID!
    pic: String!
    name: String!
    games: [Game]
    reviews: [Review]
    trains: Int!
    online: Boolean!
  }
`;
