import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import routeConstants from "./constants/routeConstants";
import "./App.scss";
import Register from "./pages/Auth/Register/";
import Login from "./pages/Auth/Login/";
import ForgotSend from "./pages/Auth/Forgot/Send/ForgotSend";
import ForgotReset from "./pages/Auth/Forgot/Reset/ForgotReset";
import Dashboard from "./pages/Dashboard/";

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path={routeConstants.REGISTER} component={Register} />
          <Route path={routeConstants.LOGIN} component={Login} />
          <Route path={routeConstants.FORGOT_SEND} component={ForgotSend} />
          <Route path={routeConstants.FORGOT_RESET} component={ForgotReset} />
          <Route path={routeConstants.DASHBOARD} component={Dashboard} />
          <Route path={routeConstants.USERS}>Users</Route>
          <Route path={routeConstants.HOME}>Home</Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
