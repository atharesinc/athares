import React from "react";

export const navigationRef = React.createRef();

export function navigate(name, params) {
  // add in some stuff to update the document.title on web
  navigationRef.current.navigate(name, params);
}
