import { split, concat, ApolloLink } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";
import { InMemoryCache } from "apollo-cache-inmemory";
// import { RetryLink } from "apollo-link-retry";
import { setContext } from "apollo-link-context";
import { onError } from "apollo-link-error";
import getEnvVars from "../env";
const { GQL_HTTP_URL, GQL_WS_URL } = getEnvVars();
import MeshStore from "../utils/meshStore";

// Create an http link:
const httpLink = new HttpLink({
  uri: GQL_HTTP_URL,
});

let token;

// Create a WebSocket link:
const wsLink = setContext(async () => {
  if (!token) {
    token = await MeshStore.getItem("ATHARES_TOKEN");
  }
  return new WebSocketLink({
    uri: GQL_WS_URL,
    options: {
      reconnect: true,
      connectionParams: {
        authToken: token ? "Bearer " + token : "",
      },
    },
  });
});

// create cache
const cache = new InMemoryCache();

const withToken = setContext(async (request) => {
  if (!token) {
    token = await MeshStore.getItem("ATHARES_TOKEN");
  }
  return {
    headers: {
      authorization: token ? "Bearer " + token : "",
    },
  };
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path, ...rest }) =>
      console.log(
        rest,
        new Error(
          `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(
            locations
          )}, Path: ${path}`
        )
      )
    );
  if (networkError) {
    console.log(`[Network error]: ${networkError}`);
  }
});

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

export { link, cache };
