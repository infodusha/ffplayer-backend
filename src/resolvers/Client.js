export const Client = {
  Client: {
    __resolveType(user, context, info) {
      if (user.rank !== null && user.rank !== undefined) {
        return 'Trainer';
      }

      return 'User';
    },
  },
};
