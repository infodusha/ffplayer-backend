import apollo from 'apollo-server-express';

export const Review = apollo.gql`
  type Review {
    rate: Float
    title: String
    text: String
    date: Date
    user: User
  }
`;
