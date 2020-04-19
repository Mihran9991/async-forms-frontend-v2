import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import routeConstants from "./constants/routeConstants";
import "./App.scss";
import Auth from "./pages/Auth/";
import Dashboard from "./pages/Dashboard/";

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path={routeConstants.AUTH} component={Auth} />
          <Route path={routeConstants.DASHBOARD} component={Dashboard} />
          <Route path={routeConstants.USERS}>Users</Route>
          <Route path={routeConstants.HOME}>Home</Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
