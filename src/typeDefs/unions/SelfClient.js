import apollo from 'apollo-server-express';

export const SelfClient = apollo.gql`
   union SelfClient = SelfUser | SelfTrainer
`;
