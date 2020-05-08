import React from "react";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import "antd/dist/antd.css";

import routeConstants from "./constants/routeConstants";
import Register from "./pages/Auth/Register/";
import Login from "./pages/Auth/Login/";
import ForgotSend from "./pages/Auth/Forgot/Send/ForgotSend";
import ForgotReset from "./pages/Auth/Forgot/Reset/ForgotReset";
import Dashboard from "./pages/Dashboard/";
import Profile from "./pages/Profile/";
import ProtectedRoute from "./sharedComponents/ProtectedRoute";
import "./App.scss";

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <ProtectedRoute
            exact
            path={routeConstants.REGISTER}
            component={Register}
          />
          <ProtectedRoute exact path={routeConstants.LOGIN} component={Login} />
          <ProtectedRoute
            exact
            path={routeConstants.FORGOT_SEND}
            component={ForgotSend}
          />
          <ProtectedRoute
            exact
            path={routeConstants.FORGOT_RESET}
            component={ForgotReset}
          />
          <ProtectedRoute
            path={routeConstants.DASHBOARD}
            component={Dashboard}
          />
          <ProtectedRoute path={routeConstants.PROFILE} component={Profile} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
