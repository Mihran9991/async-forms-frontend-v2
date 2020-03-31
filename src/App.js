import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.scss";
import Login from "./pages/Auth";

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/users">Users</Route>
          <Route path="/">Home</Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
