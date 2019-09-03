import apollo from 'apollo-server-express';

export default apollo.gql`
  type Query {
    "Filtered trainers list"
    trainers(rank: Rank, streamer: Boolean, game: Game): [Trainer]
    "Token by code"
    token(code: String!): String @auth(required: false)
    "News part"
    news(first: Int, length: Int!): [News]
  }
`;
