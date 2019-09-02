export default {
  Mutation: {
    sendToken(parent, args, context) {
      const {ip} = context;
      const {email} = args;
      return true;
    },
  },
};
