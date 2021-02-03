import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./home/Home";
import Profile from "./profile/Profile";
import Login from "./login/Login";

class RouterModule extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <Router>
        <div className="main-container">
          <Route exact path="/" render={(props) => <Login {...props} />} />
          <Route exact path="/home" render={(props) => <Home {...props} />} />
          <Route
            exact
            path="/profile"
            render={(props) => <Profile {...props} />}
          />
        </div>
      </Router>
    );
  }
}

export default RouterModule;
