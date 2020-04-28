import React from "react";
import { Redirect, Route } from "react-router-dom";

import routeConstants from "../../constants/routeConstants";
import useUser from "../../hooks/useUser";

const ProtectedRoute = ({ component: Component, path, ...rest }) => {
  const user = useUser();

  return (
    <Route
      {...rest}
      render={(props) => {
        if (user) {
          if (
            path === routeConstants.LOGIN ||
            path === routeConstants.REGISTER
          ) {
            return (
              <Redirect
                to={{
                  pathname: routeConstants.DASHBOARD,
                  state: {
                    from: props.location,
                  },
                }}
              />
            );
          }
          return <Component path={path} {...rest} {...props} />;
        } else {
          if (
            path === routeConstants.LOGIN ||
            path === routeConstants.REGISTER
          ) {
            return <Component path={path} {...rest} {...props} />;
          }

          return (
            <Redirect
              to={{
                pathname: routeConstants.LOGIN,
                state: {
                  from: props.location,
                },
              }}
            />
          );
        }
      }}
    />
  );
};

export default ProtectedRoute;
