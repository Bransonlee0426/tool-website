import Vue from 'vue';
import VueApollo from 'vue-apollo';
import { createApolloClient, restartWebsockets } from 'vue-cli-plugin-apollo/graphql-client';
import { onError } from 'apollo-link-error';
import ElementUI from 'element-ui';
import config from '../config/config.json';

// Install the vue plugin
Vue.use(VueApollo);
// Name of the localStorage item
const AUTH_TOKEN = 'admin-token';

function getUserToken() {
  return localStorage.getItem(AUTH_TOKEN);
}

// 全局錯誤攔截器
const mylink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message, locations, path }) => console.log(
      `[GraphQL error]: Message: ${message}, L ocation: ${locations}, Path: ${path}`,
    ));
  }
  // 可寫token如果錯誤要跳轉的路徑
  if (networkError) {
    ElementUI.Message({
      message: networkError,
      type: 'error',
      showClose: true,
    });
    console.log(`[Network error]: ${networkError}`);
  }
});

// Config
export const defaultOptions = {
  // You can use `https` for secure connection (recommended in production)
  // httpEndpoint,
  // You can use `wss` for secure connection (recommended in production)
  // Use `null` to disable subscriptions
  wsEndpoint: null,
  // LocalStorage token
  tokenName: AUTH_TOKEN,
  // Enable Automatic Query persisting with Apollo Engine
  persisting: false,
  // Use websockets for everything (no HTTP)
  // You need to pass a `wsEndpoint` for this to work
  websocketsOnly: false,
  // Is being rendered on the server?
  ssr: false,
  // Override default apollo link
  // note: don't override httpLink here, specify httpLink options in the
  // httpLinkOptions property of defaultOptions.
  link: mylink,
  // Override default cache
  // cache: myCache
  // Override the way the Authorization header is set
  getAuth: () => getUserToken(),
  // Additional ApolloClient options
  // apollo: { ... }
  // Client local data (see apollo-link-state)
  // clientState: { resolvers: { ... }, defaults: { ... } }
};

// const adminAPI = {
//   httpEndpoint: (config.dev) ? `${config.adminHost}management/v1/query` : '/members',
// };
// const backendAPI = {
//   httpEndpoint: (config.dev) ? `${config.backendHost}backend/v1/query` : '/backend',
// };

const adminAPI = {
  httpEndpoint: `${config.adminHost}management/v1/query`,
};
const backendAPI = {
  httpEndpoint: `${config.backendHost}backend/v1/query`,
};

// Call this in the Vue app file
export function createProvider(options = {}) {
  // Create apollo client
  const { apolloClient, wsClient } = createApolloClient({
    ...defaultOptions,
    ...options,
  });
  apolloClient.wsClient = wsClient;

  const createA = createApolloClient({
    ...defaultOptions,
    ...adminAPI,
  });

  const createB = createApolloClient({
    ...defaultOptions,
    ...backendAPI,
  });

  const admin = createA.apolloClient;
  const backend = createB.apolloClient;
  // Create vue apollo provider
  const apolloProvider = new VueApollo({
    defaultClient: apolloClient,
    defaultOptions: {
      $query: {
        fetchPolicy: 'no-cache',
      },
    },
    clients: {
      admin,
      backend,
    },
    // eslint-disable-next-line no-dupe-keys
    defaultClient: backend,
    errorHandler(error) {
      // eslint-disable-next-line no-console
      console.log('%cError', 'background: red; color: white; padding: 2px 4px; border-radius: 3px; font-weight: bold;', error.message);
    },
  });
  return apolloProvider;
}

// Manually call this when user log in
export async function onLogin(apolloClient, token) {
  if (typeof localStorage !== 'undefined' && token) {
    localStorage.setItem(AUTH_TOKEN, token);
  }
  if (apolloClient.wsClient) restartWebsockets(apolloClient.wsClient);
  try {
    await apolloClient.resetStore();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('%cError on cache reset (login)', 'color: orange;', e.message);
  }
}

// Manually call this when user log out
export async function onLogout(apolloClient) {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(AUTH_TOKEN);
  }
  if (apolloClient.wsClient) restartWebsockets(apolloClient.wsClient);
  try {
    await apolloClient.resetStore();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('%cError on cache reset (logout)', 'color: orange;', e.message);
  }
}

export default {
};
