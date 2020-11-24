import { HttpLink, split } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { InMemoryCache } from "@apollo/client/cache";
// import { RetryLink } from "@apollo/client/link/retry";
import { setContext } from "@apollo/client/link/context";
// import { onError } from "@apollo/client/link/error";
import getEnvVars from "../env";
const { GQL_HTTP_URL, EIGHT_BASE_WORKSPACE_ID } = getEnvVars();
import MeshStore from "../utils/meshStore";

import { SubscriptionLink } from "@8base/apollo-links";

// Create an http link:
const httpLink = new HttpLink({
  uri: GQL_HTTP_URL,
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

// create cache
const cache = new InMemoryCache();

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

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent

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
  withToken.concat(httpLink)
);

// const link = ApolloLink.from([errorLink, splitLink]);

export { link, cache };
