import React, { Component } from "react";
import { Icon, Button, Dropdown, Modal, Segment, Card, Image, Label, Menu, Header, Container, Statistic, Divider, Accordion } from "semantic-ui-react";
import { connect } from "react-redux";
import { postActions } from "../../actions/postActions";
import { commentActions } from "../../actions/commentActions";
import PostComments from "../Comments/PostComments";
import { Link } from "react-router-dom";
import LikePost from "./LikePost";
import PostForm from "./PostForm";
import Linkify from "linkifyjs/react";
import * as linkify from "linkifyjs";
import hashtag from "linkifyjs/plugins/hashtag";
import mention from "linkifyjs/plugins/mention";
import { history } from "../../_helpers/history";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";





dayjs.extend(relativeTime);

hashtag(linkify);
mention(linkify);

const linkifyOptions = {
  formatHref: function (href, type) {
    if (type === "hashtag") {
      href = "/hashtags/" + href.substring(1);
    }
    if (type === "mention") {
      href = "/" + href.substring(1);
    }
    return href;
  },
  attributes: {
    target: {
      url: "_blank"
    }
  }
};

class Post extends Component {


  state = {
    open: false,
    loadedImg: false,
    value: "",
    showTags: false,
    optionsLoggedIn: [
      { key: "copy", icon: "copy", text: "Copy link", value: "copy" },
      {
        key: "goto",
        icon: "point",
        text: "Go to post",
        value: "goto"
      },
      { key: "delete", icon: "delete", text: "Delete", value: "delete" }
    ],
    optionsNotLoggedIn: [
      { key: "copy", icon: "copy", text: "Copy link", value: "copy" },
      {
        key: "goto",
        icon: "point",
        text: "Go to post",
        value: "goto"
      }
    ]
  };




  close = () => this.setState({ open: false, value: "" });

  handleToggleTags = () => {
    this.setState({ showTags: !this.state.showTags });
  };

  getPostComments = () => {
    const { dispatch, post, comments } = this.props;

    if (
      !comments[post._id].comments.length &&
      !comments[post._id].fetching &&
      post.comments
    ) {
      dispatch(
        commentActions.getPostComments(post._id, { initialFetch: true })
      );
    }
  };

  deletePost = () => {
    const { dispatch, post } = this.props;
    dispatch(postActions.deletePost(post._id));
  };

  handleChange = (e, { name, value }) => {
    this.setState({ value, open: false });
    if (value === "goto") {
      history.push("/p/" + this.props.post._id);
      this.setState({ value, open: false });
    }
    if (value === "delete") {
      this.setState({ value, open: true });
    }
    if (value === "copy") {
      navigator.clipboard.writeText(
        window.location.host + "/p/" + this.props.post._id
      );
    }
  };

  handleClose = () => {
    this.setState({ value: "", open: false });
  };

  render() {

    const { post, _id, username } = this.props;
    const {
      open,
      optionsLoggedIn,
      optionsNotLoggedIn,
      value,
      showTags,
    } = this.state;

    const renderDivs = post.tags.map(div => (

      <Label as="a" key={div.id}>
        {div.value === username ? (
          <Link style={{ color: "black" }} to={"/profile"}>{div.value}</Link>
        ) : (
            <Link style={{ color: "black" }} to={"/" + div.value}>{div.value}</Link>
          )}
      </Label>
    ));

    const ribbon = post.tags.length ? (
      <Label.Group></Label.Group>
    ) : null;

    return (

        <Card fluid>
          <Card.Content>
            {post.author[0]._id === _id ? (
              <Dropdown icon='chevron down'
                direction='left'
                style={{ float: "right" }}
                selectOnNavigation={false}
                onChange={this.handleChange}
                value={value}
                options={optionsLoggedIn}
                trigger={<React.Fragment />}
              />
            ) : (
                <Dropdown icon='chevron down'
                  direction='left'
                  style={{ float: "right" }}
                  selectOnNavigation={false}
                  onChange={this.handleChange}
                  value={value}
                  options={optionsNotLoggedIn}
                  trigger={<React.Fragment />}
                />
              )}
            <Image
              rounded
              floated="left"
              size="mini"
              src={`/images/profile-picture/100x100/${post.author[0].profilePicture}`}/>
              <Card.Header><Link style={{ color: "black" }} to={post.author[0].username === username ? "/profile" : "/" + post.author[0].username}>{post.author[0].username}</Link></Card.Header>
            <Card.Meta>{post.location && post.location.address !== "" ? (<Link to={`/location/${post.location.coordinates[0]},${post.location.coordinates[1]}`}>{post.location.address}</Link>) : null}<span>{dayjs(post.createdAt).fromNow()}</span></Card.Meta>
            <Card.Description>
              <p style={{ fontSize: "1.1em", color: "black" }}>
                {post.description ? (
                  <Linkify options={linkifyOptions}>{post.description}</Linkify>
                ) : null}
              </p>
            </Card.Description>
            <Divider hidden />
            <Label.Group>
              {ribbon}
              {renderDivs}
            </Label.Group>
          </Card.Content>
          {this.state.loadedImg ? null : (
            <Segment loading>
              <Image src={`/images/post-images/thumbnail/${post.photo}`} />
            </Segment>
          )}
          <Image
            onClick={this.handleToggleTags}
            onLoad={() => this.setState({ loadedImg: true })}
            src={`/images/post-images/${post.photo}`}
            alt=""
          />
          <Card.Content extra>
            <Statistic floated="right" size='mini'>
              <Statistic.Value style={{ cursor: "pointer" }} onClick={this.getPostComments}><Icon name="feed" />{post.comments}</Statistic.Value>
              <Statistic.Label>Feed</Statistic.Label>
            </Statistic>
            <LikePost
              post={{
                postId: post._id,
                photo: post.photo,
                authorId: post.author[0]._id,
                likes: post.likes
              }} />

            <PostComments
              post={{
                postId: post._id,
                commentsCount: post.comments,
                photo: post.photo,
                authorId: post.author[0]._id
              }}
            />

            <PostForm
              post={{
                postId: post._id,
                authorId: post.author[0]._id,
                photo: post.photo
              }} />
          </Card.Content>
        </Card>
    );
  }
}

const mapStateToProps = state => {
  const { _id, username } = state.user.data;
  return {
    _id,
    username,
    comments: state.comments
  };
};

export default connect(mapStateToProps)(Post);
