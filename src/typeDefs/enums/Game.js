import apollo from 'apollo-server-express';

export default apollo.gql`
  enum Game {
    WOTB
    FRTN
    PUBG
  }
`;
