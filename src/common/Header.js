import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Redirect } from "react-router-dom";
import SearchIcon from "@material-ui/icons/Search";
import Input from "@material-ui/core/Input";
import IconButton from "@material-ui/core/IconButton";
import profileImage from "../assets/upgrad.png";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { MenuList } from "@material-ui/core";
import { Link } from "react-router-dom";
import "./Header.css";

const styles = (theme) => ({
  searchText: {
    position: "relative",
    width: "100%",
  },
});

class Header extends Component {
  constructor() {
    super();
    this.state = {
      isLoggedIn: true,
    };
  }

  onSearchChangeHandler = (event) => {
    this.props.onSearchTextChange(event.target.value);
  };

  redirectToLogin = () => {
    if (!this.state.isLoggedIn) {
      return <Redirect to="/" />;
    }
  };

  openMenu = () =>
    this.setState({
      ...this.state,
      menuIsOpen: !this.state.menuIsOpen,
    });

  onLogOutClicked = (event) => {
    sessionStorage.removeItem("access-token"); //Clearing access-token
    this.setState({
      isLoggedIn: false,
    });
  };

  profileButtonClicked = (event) => {
    this.state.anchorEl
      ? this.setState({ anchorEl: null })
      : this.setState({ anchorEl: event.currentTarget });
    this.openMenu();
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
          {this.props.showSearchBox ? ( //checking if the showSearchBox is true,only then it is shown
            <span className="header-searchbox">
              <SearchIcon id="search-icon"></SearchIcon>
              <Input
                className={classes.searchText}
                placeholder="Search…"
                disableUnderline={true}
                onChange={this.onSearchChangeHandler}
              />
            </span>
          ) : (
            <span className="header-searchbox-false" />
          ) //To maintain the design stability
          }
          {this.props.showProfileIcon ? ( // checking if the showSearchBox is true,only then it is shown
            <span>
              <IconButton
                id="profile-icon"
                onClick={(event) => this.profileButtonClicked(event)}
              >
                <img
                  src={profileImage}
                  alt={profileImage}
                  id="profile-picture"
                />
              </IconButton>
              <Menu
                id="profile-menu"
                anchorEl={this.state.anchorEl}
                open={this.state.menuIsOpen}
                onClose={this.profileButtonClicked}
              >
                <MenuList className={classes.menuList}>
                  {this.props.showMyAccount === true ? (
                    <div>
                      <Link
                        to={"/profile"}
                        className={classes.menuItems}
                        underline="none"
                        color={"default"}
                      >
                        <MenuItem
                          className={classes.menuItems}
                          onClick={this.onMyAccountClicked}
                          disableGutters={false}
                        >
                          My account
                        </MenuItem>
                      </Link>

                      <div className="horizontal-line"> </div>
                    </div>
                  ) : (
                    ""
                  )}
                  <MenuItem
                    className="menu-items"
                    onClick={this.onLogOutClicked}
                  >
                    Logout
                  </MenuItem>
                </MenuList>
              </Menu>
            </span>
          ) : (
            ""
          )}
        </header>
      </div>
    );
  }
}

export default withStyles(styles)(Header);
