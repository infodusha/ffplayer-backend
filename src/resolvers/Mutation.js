export default {
  Mutation: {
    code(parent, args, context) {
      const {ip} = context;
      const {email} = args;
      return true;
    },
  },
};
