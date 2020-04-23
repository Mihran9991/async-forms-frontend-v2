import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import routeConstants from "./constants/routeConstants";
import Register from "./pages/Auth/Register/";
import Login from "./pages/Auth/Login/";
import Dashboard from "./pages/Dashboard/";
import "./App.scss";
import "antd/dist/antd.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path={routeConstants.REGISTER} component={Register} />
          <Route path={routeConstants.LOGIN} component={Login} />
          <Route path={routeConstants.DASHBOARD} component={Dashboard} />
          <Route path={routeConstants.USERS}>Users</Route>
          <Route path={routeConstants.HOME}>Home</Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
