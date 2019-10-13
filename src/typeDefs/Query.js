import apollo from 'apollo-server-express';

export default apollo.gql`
  type Query {
    "Filtered trainers list part"
    trainers(rank: Rank, streamer: Boolean, game: ID, cursor: ID, length: Int!): [Trainer]
    "Token by code"
    token(name: String, email: String!, code: String!): String @auth(required: false)
    "News part"
    news(cursor: ID, length: Int!): [News]
    "All site games"
    games: [Game]
    "User data"
    user(id: ID): Client
  }
`;
