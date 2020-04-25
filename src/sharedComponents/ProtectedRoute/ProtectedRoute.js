import React from "react";
import { Route, Redirect } from "react-router-dom";

import routeConstants from "../../constants/routeConstants";
import useUser from "../../hooks/useUser";

const ProtectedRoute = ({ component: Component, path, ...rest }) => {
  const user = useUser();

  console.log("user", user);

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

          console.log("saraaaaaa");
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
