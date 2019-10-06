import apollo from 'apollo-server-express';

export default apollo.gql`
  type Query {
    "Filtered trainers list part"
    trainers(rank: Rank, streamer: Boolean, game: ID, first: Int, length: Int!): [Trainer]
    "Token by code"
    token(name: String, email: String!, code: String!): String @auth(required: false)
    "News part"
    news(first: Int, length: Int!): [News]
    "All site games"
    games: [Game]
  }
`;
