import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import {
  Modal,
  Dimmer,
  Icon,
  Loader,
  List,
  Divider,
  Message,
  Grid,
  Card,
  Image,
  Header,
  Button, Item, Label, Statistic, Segment, Container

} from "semantic-ui-react";
import { Link } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import { userActions } from "../actions/userActions";
import { EditProfileModal } from "../components/EditProfileModal";
import Messages from "../components/Messages";
import Linkify from "linkifyjs/react";
import * as linkify from "linkifyjs";
import hashtag from "linkifyjs/plugins/hashtag";
import mention from "linkifyjs/plugins/mention";
import FollowingFollowerList from "../components/FollowingFollowerList";
import Post from "../components/Post/Post";

hashtag(linkify);
mention(linkify);

const staticStyle = {
  display: "block",
  textAlign: "center"
}
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

class ProfilePage extends Component {
  componentDidMount = () => {
    document.title = "Profile | The Great Tunisia";
  };

  fetchData = () => {
    const { dispatch, user } = this.props;
    const lastId = user.data.posts[user.data.posts.length - 1]._id;
    dispatch(userActions.getPosts({ userId: user.data._id, lastId }));
  };

  getFollowings = () => {
    const { dispatch, user } = this.props;
    dispatch(userActions.getFollowings(user.data._id));
  };

  getFollowers = () => {
    const { dispatch, user } = this.props;
    dispatch(userActions.getFollowers(user.data._id));
  };

  render() {
    const { user, alert } = this.props;
    const hasMore =
      user.data.postsCount === user.data.posts.length ? false : true;
    const posts = user.data.posts.map(post => {
      return (

        <Modal
          key={post._id}
          trigger={
            <Card fluid>
              <Card.Content>
                <Image
                  floated='left'
                  size='mini'
                  src={`/images/profile-picture/100x100/${user.data.profilePicture}`} rounded />
                <Card.Header>{user.data.username}</Card.Header>
                <Card.Meta>{user.data.firstName + " " + user.data.lastName}</Card.Meta>
                
              </Card.Content>
              <Image src={`/images/post-images/thumbnail/${post.photo}`} wrapped ui={false} />

              <Card.Content extra>

                <Statistic floated="right" size='mini'>
                  <Statistic.Value style={{ cursor: "pointer" }}><Icon name="feed" />{post.comments}</Statistic.Value>
                  <Statistic.Label>Feed</Statistic.Label>
                </Statistic>

                <Statistic floated="right" size='mini'>
                  <Statistic.Value style={{ cursor: "pointer" }}><Icon name="arrow up" />{post.likes}</Statistic.Value>
                  <Statistic.Label>Ups</Statistic.Label>
                </Statistic>

              </Card.Content>
            </Card>
          }
        >

          <Post
            post={{
              ...post,
              author: [
                {
                  profilePicture: user.data.profilePicture,
                  username: user.data.username,
                  _id: user.data._id
                }
              ]
            }}
          />
        </Modal>
      );
    });

    const followingList = user.data.follwingUsers.length
      ? user.data.follwingUsers.map(({ user }) => (
        <FollowingFollowerList
          key={user._id}
          user={user}
        ></FollowingFollowerList>
      ))
      : "No followings";

    const followerList = user.data.followerUsers.length
      ? user.data.followerUsers.map(({ user }) => (
        <FollowingFollowerList
          key={user._id}
          user={user}
        ></FollowingFollowerList>
      ))
      : "No followers";

    return (

      <div>
        {user.loadingUser ? (
          <Dimmer active>
            <Loader />
          </Dimmer>
        ) : (
            <Fragment>
              {user.deleting ? (
                <Dimmer active>
                  <Loader />
                </Dimmer>
              ) : null}
              <Segment style={{ padding: '10em 0.1em 0.1em 0.1em' }} vertical>
                <Grid container stackable verticalAlign='middle' centered>
                  <Grid.Row>
                    <Grid.Column width={8}>
                      <Item.Group>
                        {alert.type ? <Messages alert={alert} /> : null}
                        <Item>
                          <Item.Image src={`/images/profile-picture/${user.data.profilePicture}`} rounded />

                          <Item.Content>
                            <EditProfileModal>
                              <Button basic circular size="huge" icon='settings' floated="right" />
                            </EditProfileModal>
                            <Item.Header>{user.data.username}  <Icon size='tiny' color='blue' name='check' circular /></Item.Header>
                            <Item.Meta>
                              {user.data.firstName + " " + user.data.lastName}
                            </Item.Meta>
                            <Item.Description>
                              <Linkify options={linkifyOptions}>
                                {"Bio: " + "“" + user.data.bio + "”"}
                              </Linkify>
                            </Item.Description>
                          </Item.Content>
                        </Item>
                      </Item.Group>

                      <Statistic.Group size="mini" style={staticStyle}>
                        <Statistic>
                          <Statistic.Value>{user.data.postsCount}</Statistic.Value>
                          <Statistic.Label>Posts</Statistic.Label>
                        </Statistic>
                        <Modal
                          trigger={
                            <Statistic onClick={this.getFollowers} style={{ cursor: "pointer" }}>
                              <Statistic.Value>{user.data.followers}</Statistic.Value>
                              <Statistic.Label as="a">Followers</Statistic.Label>
                            </Statistic>}>
                          <Modal.Header>Followers</Modal.Header>
                          <Modal.Content scrolling>
                            <Modal.Description>
                              <List verticalAlign="middle" size="huge">
                                {followerList}
                              </List>
                            </Modal.Description>
                          </Modal.Content>
                        </Modal>
                        <Modal
                          trigger={
                            <Statistic onClick={this.getFollowings} style={{ cursor: "pointer" }}>
                              <Statistic.Value>{user.data.followings}</Statistic.Value>
                              <Statistic.Label>Following</Statistic.Label>
                            </Statistic>}>
                          <Modal.Header>Following</Modal.Header>
                          <Modal.Content scrolling>
                            <Modal.Description>
                              <List verticalAlign="middle" size="huge">
                                {followingList}
                              </List>
                            </Modal.Description>
                          </Modal.Content>
                        </Modal>
                      </Statistic.Group>
                      <Divider hidden />

                      {user.data.postsCount === 0 ? (
                        <div>
                          <Segment attached='top'>
                            You have no posts. Share your first post:{" "}
                          </Segment>
                          <Button
                            as={Link}
                            to="/posts/upload"
                            attached="bottom">
                          <Icon name="upload" />Add post</Button>
                          <Divider hidden />
                        </div>
                      ) : (
                          <InfiniteScroll
                            dataLength={user.data.posts.length} //This is important field to render the next data
                            next={this.fetchData}
                            hasMore={hasMore}
                            loader={<h4></h4>}
                            style={{ padding: '0.1em 0.1em 0.1em 0.1em' }}>
                            {posts}
                          </InfiniteScroll>
                        )}
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Segment>
            </Fragment>
          )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
  alert: state.alert
});

const connectedProfilePage = connect(mapStateToProps)(ProfilePage);
export { connectedProfilePage as default };
