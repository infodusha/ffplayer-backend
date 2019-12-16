import {gql} from '../modules/apollo.js';

export const Review = gql`
  type Review {
    rate: Float
    title: String
    text: String
    date: Date
    user: User
  }
`;
