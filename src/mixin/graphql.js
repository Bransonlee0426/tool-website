export default {
  methods: {
    $_queryApi(data, result, error) {
      this.$apollo.query({
        query: data.name,
        variables: data.variables,
        client: data.client,
        fetchPolicy: 'no-cache',
      }).then((res) => {
        result(res);
      }).catch((err) => {
        error(err);
      });
    },
    $_mutationApi(data, result, error) {
      this.$apollo.mutate({
        mutation: data.name,
        variables: data.variables,
        client: data.client,
        fetchPolicy: 'no-cache',
      }).then((res) => {
        result(res);
      }).catch((err) => {
        error(err);
      });
    },
  },
};
