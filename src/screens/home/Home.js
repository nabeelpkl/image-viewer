import React, { Component } from "react";
import { Grid, FormControl } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Avatar from "@material-ui/core/Avatar";
import Header from "../../common/Header";
import profileImage from "../../assets/upgrad.png";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import IconButton from "@material-ui/core/IconButton";
import FavoriteIcon from "@material-ui/icons/Favorite";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import Button from "@material-ui/core/Button";
import { Redirect } from "react-router-dom";
import "./Home.css";

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  grid: {
    padding: "20px",
    "margin-left": "10%",
    "margin-right": "10%",
  },
  card: {
    maxWidth: "100%",
  },
  media: {
    height: "50%",
    width: "100%",
  },
  avatar: {
    margin: 10,
    width: 60,
    height: 60,
  },
  title: {
    "font-weight": "600",
  },

  addCommentBtn: {
    "margin-left": "15px",
  },

  comment: {
    "flex-direction": "row",
    "margin-top": "25px",
    "align-items": "baseline",
    "justify-content": "center",
  },

  commentUsername: {
    fontSize: "inherit",
  },
});

class Home extends Component {
  constructor() {
    super();
    this.state = {
      images: [],
      comments: [],
      profile_picture: "",
      userName: "",
      commentText: "",
      searchOn: false,
      baseImageArr: {},
      isLoggedIn: sessionStorage.getItem("access-token") == null ? false : true,
      accessToken: sessionStorage.getItem("access-token"),
      count: 1,
    };
  }

  UNSAFE_componentWillMount() {
    // Get data from first API endpoint
    let that = this;
    if (this.state.isLoggedIn) {
      let url =
        "https://graph.instagram.com/me/media?fields=id,caption&access_token=" +
        this.state.accessToken;
      fetch(url, {
        method: "GET",
      })
        .then((response) => {
          return response.json();
        })
        .then((jsonResponse) => {
          that.setState({
            api1data: jsonResponse.data,
          });
          //console.log('data',jsonResponse.data)
          let api1data = jsonResponse.data;

          api1data.forEach((element) => {
            var date = parseInt(element.created_time, 10);
            date = new Date(date * 1000);
            //changing the format to Locale String
            element.created_time = date.toLocaleString();
            //console.log('element_id',element.id)
            let url2 =
              "https://graph.instagram.com/" +
              element.id +
              "?fields=id,media_type,media_url,username,timestamp&access_token=" +
              this.state.accessToken;
            console.log("url2", url2);
            fetch(url2, {
              method: "GET",
            })
              .then((response1) => {
                //console.log(response1)
                return response1.json();
              })
              .then((jsonResponse1) => {
                that.setState({
                  api2data: jsonResponse1.data,
                });
                let api2data = jsonResponse1;
                api2data = {
                  ...api2data,
                  id: element.id,
                  caption: element.caption,
                  likes_count: 5,
                  user_has_liked: false,
                };
                let findata = [];
                if (this.state.images.length > 0) {
                  this.state.images.forEach((ima) => {
                    findata.push(ima);
                  });
                }
                findata.push(api2data);
                that.loadHomePage(findata);
                //console.log('api2data:',api2data)
              })
              .catch((error) => {
                console.log("error user data", error);
              });
          });
        })
        .catch((error) => {
          console.log("error user data", error);
        });
    }
  }

  //This method takes the image array as sets it to the state images array triggering rerender
  loadHomePage = (imageArr) => {
    //console.log('imageArr:',imageArr)
    this.setState({
      ...this.state,
      images: imageArr,
    });
  };

  //Method used to handle changes in the comment input text
  onCommentTextChangeHandler = (event, imageId) => {
    var comment = {
      id: imageId,
      text: event.target.value,
    };
    this.setState({
      ...this.state,
      commentText: comment,
    });
  };

  //This method is to handle the ADD button beside the comment text box
  onClickAddBtn = (imageId) => {
    var count = this.state.count;
    var comment = {
      id: count,
      imageId: imageId,
      username: this.state.userName,
      text: this.state.commentText.text,
    };
    count++;
    var comments = [...this.state.comments, comment];
    this.setState({
      ...this.state,
      count: count,
      comments: comments,
      commentText: "",
    });
  };

  // This Handles when the like button is clicked.
  likeBtnHandler = (imageId) => {
    var i = 0;
    var imageArray = this.state.images;

    for (i; i < imageArray.length; i++) {
      //console.log('imageID',imageId)
      if (imageArray[i].id === imageId) {
        if (imageArray[i].user_has_liked === true) {
          imageArray[i].user_has_liked = false;
          imageArray[i].likes_count--;
          this.setState({
            images: imageArray,
            abcd: imageArray,
          });
          break;
        } else {
          imageArray[i].user_has_liked = true;
          imageArray[i].likes_count++;
          this.setState({
            images: imageArray,
            abcd: imageArray,
          });
          break;
        }
      }
    }
  };
  //This method is called from the header,this is passed as a props to the header
  onSearchTextChange = (keyword) => {
    if (!(keyword === "")) {
      var baseImageArr = [];
      this.state.searchOn
        ? (baseImageArr = this.state.baseImageArr)
        : (baseImageArr = this.state.images);
      var updatedImageArr = [];
      var searchOn = true;
      keyword = keyword.toLowerCase();
      baseImageArr.forEach((element) => {
        var caption = element.caption.split(" ")[0];
        caption.toLowerCase();
        if (caption.includes(keyword)) {
          updatedImageArr.push(element);
        }
      });
      if (!this.state.searchOn) {
        this.setState({
          ...this.state,
          searchOn: searchOn,
          images: updatedImageArr,
          baseImageArr: baseImageArr,
        });
      } else {
        this.setState({
          ...this.state,
          images: updatedImageArr,
        });
      }
    } else {
      searchOn = false;
      this.setState({
        ...this.state,
        searchOn: searchOn,
        images: this.state.baseImageArr,
        baseImageArr: [],
      });
    }
  };

  render() {
    console.log("render images:", this.state.images);
    const { classes } = this.props;
    return (
      <div>
        <Header
          profile_picture={this.state.profile_picture}
          showSearchBox={this.state.isLoggedIn ? true : false}
          showProfileIcon={this.state.isLoggedIn ? true : false}
          onSearchTextChange={this.onSearchTextChange}
          showMyAccount={true}
        />
        {this.state.isLoggedIn === true ? ( //checking isLoggedIn is true only then the images are shown
          <div className="flex-container">
            <Grid
              container
              spacing={3}
              wrap="wrap"
              alignContent="center"
              className={classes.grid}
            >
              {this.state.images.map((
                image //Iteration over images array and rendering each element of array as per the design.
              ) => (
                // components are data to the components are given as per the design and guidelines given
                //Grid Used to create two coloumns
                //Card used to show the images in two columns
                //Card Header to set the header of the card
                //Card Content to set the card content

                <Grid key={image.id} item xs={12} sm={6} className="grid-item">
                  <Card className={classes.card}>
                    <CardHeader
                      classes={{
                        title: classes.title,
                      }}
                      avatar={
                        <Avatar
                          src={profileImage}
                          className={classes.avatar}
                        ></Avatar>
                      }
                      title={image.username}
                      subheader={image.timestamp}
                      className={classes.cardheader}
                    />

                    <CardContent>
                      <img
                        src={image.media_url}
                        alt={profileImage}
                        className={classes.media}
                      />
                      <div className="horizontal-rule"></div>
                      <div className="image-caption">
                        {image.caption.split(" ")[0]}
                      </div>
                      <div className="image-hashtags">
                        {image.caption.split(" ")[1]}
                      </div>
                      <div>
                        <IconButton
                          className="like-button"
                          aria-label="like-button"
                          onClick={() => this.likeBtnHandler(image.id)}
                        >
                          {/* Based on the condition of the icon will be filled red or only the border */}
                          {image.user_has_liked ? (
                            <FavoriteIcon
                              className="image-liked-icon"
                              fontSize="large"
                            />
                          ) : (
                            <FavoriteBorderIcon
                              className="image-like-icon"
                              fontSize="large"
                            />
                          )}
                        </IconButton>
                        {/* if like count is 1 it will show like or else likes */}
                        {image.likes_count === 1 ? (
                          <span>{image.likes_count} like</span>
                        ) : (
                          <span>{image.likes_count} likes</span>
                        )}
                      </div>

                      {/* Input to add comment consist of Input ,InputLabel and ADD button */}
                      <FormControl className={classes.comment} fullWidth={true}>
                        <InputLabel htmlFor="comment">Add a comment</InputLabel>
                        <Input
                          id="comment"
                          className="comment-text"
                          name="commentText"
                          onChange={(event) =>
                            this.onCommentTextChangeHandler(event, image.id)
                          }
                          value={
                            image.id === this.state.commentText.id
                              ? this.state.commentText.text
                              : ""
                          }
                        />
                        <Button
                          variant="contained"
                          color="primary"
                          className={classes.addCommentBtn}
                          onClick={() => this.onClickAddBtn(image.id)}
                        >
                          ADD
                        </Button>
                      </FormControl>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </div>
        ) : (
          <Redirect to="/" />
        )}
      </div>
    );
  }
}

export default withStyles(styles)(Home);
