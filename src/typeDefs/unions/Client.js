import apollo from 'apollo-server-express';

export const Client = apollo.gql`
   union Client = User | Trainer
`;
