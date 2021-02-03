import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Redirect } from "react-router-dom";
import "./Header.css";

const styles = (theme) => ({});

class Header extends Component {
  constructor() {
    super();
    this.state = {
      isLoggedIn: true,
    };
  }

  redirectToLogin = () => {
    if (!this.state.isLoggedIn) {
      return <Redirect to="/" />;
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        {this.redirectToLogin()}
        <header className="app-header">
          <a href="/home" id="app-logo">
            Image Viewer
          </a>
        </header>
      </div>
    );
  }
}

export default withStyles(styles)(Header);
