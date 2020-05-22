module.exports = {
  css: {
    loaderOptions: {
      scss: {
        prependData: `
            @import "./src/assets/style/regular";
            @import "./src/assets/style/media";
          `,
      },
    },
  },
  pluginOptions: {
    apollo: {
      enableMocks: true,
      enableEngine: true,
      lintGQL: true,
      timeout: 10000,
    },
  },
};
