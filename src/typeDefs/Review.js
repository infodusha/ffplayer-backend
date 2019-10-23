import apollo from 'apollo-server-express';

export default apollo.gql`
  type Review {
    rate: Float
    title: String
    text: String
    date: Date
    user: User
  }
`;
