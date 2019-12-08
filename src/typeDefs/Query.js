import apollo from 'apollo-server-express';

export const Query = apollo.gql`
  type Query {
    trainers(rank: Rank, streamer: Boolean, game: ID, offset: Int, length: Int!): [Trainer]
    token(name: String, email: String!, code: String!): String @auth(required: false)
    news(offset: Int, length: Int!): [News]
    games: [Game]
    user(id: ID!): Client
    self: Client @auth
    game(shortname: String!): Game
  }
`;
