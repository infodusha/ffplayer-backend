import apollo from 'apollo-server-express';

export const auth = apollo.gql`
directive @auth(
  required: Boolean = true,
) on OBJECT | FIELD_DEFINITION
`;
