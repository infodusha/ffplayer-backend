import apollo from 'apollo-server-express';

export default apollo.gql`
  type RateVote {
    value: Int
    question: String
  }

  type RateData {
    distribution: [Int]
    vote: [RateVote]
  }
`;
