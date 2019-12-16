import {gql} from '../modules/apollo.js';

export const Query = gql`
  type Query {
    trainers(rank: Rank, streamer: Boolean, game: ID, offset: Int, length: Int!): [Trainer]
    token(name: String, email: String!, code: String!): String @auth(required: false)
    news(offset: Int, length: Int!): [News]
    games: [Game]
    user(id: ID!): Client
    self: SelfClient @auth
    game(shortname: String!): Game
  }
`;
