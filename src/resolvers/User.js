export default {
  User: {
    __resolveType(user, context, info) {
      if (user.rank) {
        return 'Trainer';
      }

      return 'User';
    },
  },
};
