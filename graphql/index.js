import { HttpLink, split } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { InMemoryCache } from "@apollo/client/cache";
// import { RetryLink } from "@apollo/client/link/retry";
import { setContext } from "@apollo/client/link/context";
// import { onError } from "@apollo/client/link/error";
import getEnvVars from "../env";
const { GQL_HTTP_URL, EIGHT_BASE_WORKSPACE_ID } = getEnvVars();
import MeshStore from "../utils/meshStore";
import { BatchHttpLink } from "@apollo/client/link/batch-http";
import { SubscriptionLink } from "@8base/apollo-links";
import { CachePersistor, AsyncStorageWrapper } from "apollo3-cache-persist";

// initialize storage
MeshStore.init();

// create cache
const cache = new InMemoryCache();

const persistor = new CachePersistor({
  cache,
  storage: new AsyncStorageWrapper(MeshStore),
});

// Create an http link:
const httpLink = new HttpLink({
  uri: GQL_HTTP_URL,
});

const batchHttp = new BatchHttpLink({
  uri: GQL_HTTP_URL,
  // batchInterval: 50,
});

const wsLink = new SubscriptionLink({
  uri: "wss://ws.8base.com",
  getAuthState: async () => {
    const token = await MeshStore.getItem("ATHARES_TOKEN");
    return {
      token: token ? token : "",
      workspaceId: EIGHT_BASE_WORKSPACE_ID,
    };
  },
  onAuthError: (error) => {
    console.error("log", "[Subscription error]:", error);
  },
});

const withToken = setContext(async () => {
  const token = await MeshStore.getItem("ATHARES_TOKEN");

  return {
    headers: {
      authorization: token ? "Bearer " + token : "",
    },
  };
});

// const errorLink = onError(({ graphQLErrors, networkError }) => {
//     if (graphQLErrors)
//         graphQLErrors.forEach(({ message, locations, path, ...rest }) =>
//             console.log(
//                 rest,
//                 new Error(
//                     `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(
//                         locations
//                     )}, Path: ${path}`
//                 )
//             )
//         );
//     if (networkError) {
//         console.log(`[Network error]: ${networkError}`);
//     }
// });

// const authFlowLink = withToken.concat(resetToken);

// Three-way split to determine if this is a websocket request,
// a request to be batched with others,
// or a high-priority one-off request
const link = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  split(
    // split based on operation importance
    // If we need the operation to run by itself
    // otherwise, batch requests for efficiency
    (operation) => {
      return operation.getContext().important;
    },
    withToken.concat(httpLink),
    withToken.concat(batchHttp)
  )
);

// const link = ApolloLink.from([errorLink, splitLink]);

export { link, cache, persistor };
