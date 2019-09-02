import apollo from 'apollo-server-express';

export default apollo.gql`
directive @auth(
  required: Boolean = true,
) on OBJECT | FIELD_DEFINITION
`;
