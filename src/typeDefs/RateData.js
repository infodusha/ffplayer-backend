import apollo from 'apollo-server-express';

export const RateData = apollo.gql`
  type RateDistribution {
    value: Float
    n: Int
  }

  type RateVote {
    value: Int
    question: String
  }

  type RateData {
    distribution: [RateDistribution]
    vote: [RateVote]
  }
`;
