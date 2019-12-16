import {gql} from '../modules/apollo.js';

export const RateData = gql`
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
