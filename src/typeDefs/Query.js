import apollo from 'apollo-server-express';

export default apollo.gql`
  type Query {
    trainers(rank: Rank, streamer: Boolean, game: ID, offset: Int, length: Int!): [Trainer]
    token(name: String, email: String!, code: String!): String @auth(required: false)
    news(offset: Int, length: Int!): [News]
    games: [Game]
    user(id: ID!): Client
    game(shortname: String!): Game
  }
`;
