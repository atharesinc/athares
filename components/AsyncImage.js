import React, { Suspense } from "react";
import { Image, StyleSheet } from "react-native";
import Loader from "./Loader";
import imgCache from "../utils/imgCache";
import ErrorBoundary from "./ErrorBoundary";

function AsyncImage({ source, style = {}, alt = "", ...rest }) {
  return (
    <ErrorBoundary>
      {imgCache.read(source) && (
        <Image
          alt={alt}
          source={source}
          style={[
            style,
            {
              position: "absolute",
              resizeMode: "contain",
            },
          ]}
          {...rest}
        />
      )}
    </ErrorBoundary>
  );
}

export default function SuspenseImage(props) {
  return (
    <Suspense fallback={<Loader size={25} style={styles.default} />}>
      <AsyncImage {...props} />
    </Suspense>
  );
}

const styles = StyleSheet.create({
  default: {
    flex: 1,
  },
});
