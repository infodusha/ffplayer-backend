import apollo from 'apollo-server-express';

export default apollo.gql`
  type Query {
    """
      Get filtered trainers list
    """
    trainers(rank: Rank, streamer: Boolean, game: Game): [Trainer]
    token(code: String!): String @auth(required: false)
  }
`;
