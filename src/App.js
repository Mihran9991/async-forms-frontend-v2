import React from "react";
import { BrowserRouter as Router, Switch } from "react-router-dom";

import routeConstants from "./constants/routeConstants";
import Register from "./pages/Auth/Register/";
import Login from "./pages/Auth/Login/";
import Dashboard from "./pages/Dashboard/";
import ProtectedRoute from "./sharedComponents/ProtectedRoute";
import "./App.scss";
import "antd/dist/antd.css";

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
            path={routeConstants.DASHBOARD}
            component={Dashboard}
          />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
