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
import { userActions } from "../actions/userActions";

import Post from "../components/Post/Post";
import InfiniteScroll from "react-infinite-scroll-component";
import { FollowButton } from "../components/FollowButton";
import Messages from "../components/Messages";
import Linkify from "linkifyjs/react";
import * as linkify from "linkifyjs";
import hashtag from "linkifyjs/plugins/hashtag";
import mention from "linkifyjs/plugins/mention";
import FollowingFollowerList from "../components/FollowingFollowerList";

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

class UserProfile extends Component {
  state = { username: "" };

  getFollowings = () => {
    const { dispatch, userProfileData } = this.props;
    dispatch(userActions.getUserProfileFollowings(userProfileData.data._id));
  };

  getFollowers = () => {
    const { dispatch, userProfileData } = this.props;
    dispatch(userActions.getUserProfileFollowers(userProfileData.data._id));
  };

  componentDidMount = () => {
    const { dispatch, userProfileData, match } = this.props;
    if (userProfileData.data.username !== match.params.username) {
      dispatch(userActions.getUserProfileData(match.params.username));
    }
  };

  fetchData = () => {
    const { dispatch, userProfileData } = this.props;
    const lastId =
      userProfileData.data.posts[userProfileData.data.posts.length - 1]._id;

    dispatch(
      userActions.getUserPosts({ userId: userProfileData.data._id, lastId })
    );
  };

  render() {
    const { userProfileData, fetchingUserData, alert } = this.props;
    const hasMore =
      userProfileData.data.postsCount === userProfileData.data.posts.length
        ? false
        : true;
    if (alert.type) {
      return (
          <Messages alert={alert} />
      );
    }
    if (userProfileData.loadingUser || fetchingUserData) {
      return (
        <Dimmer active>
          <Loader />
        </Dimmer>
      );
    } else {
      const posts = userProfileData.data.posts.map(post => {
        return (
          <Modal
            key={post._id}
            size="small"
            trigger={
              <Card fluid>
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
            </Card>}>

            <Post
              post={{
                ...post,
                author: [
                  {
                    profilePicture: userProfileData.data.profilePicture,
                    username: userProfileData.data.username,
                    _id: userProfileData.data._id
                  }
                ]
              }}/>
          </Modal>
        );
      });

      const followingList = userProfileData.data.follwingUsers.length
        ? userProfileData.data.follwingUsers.map(({ user }) => (
          <FollowingFollowerList
            key={user._id}
            user={user}
          ></FollowingFollowerList>
        ))
        : "No followings";

      const followerList = userProfileData.data.followerUsers.length
        ? userProfileData.data.followerUsers.map(({ user }) => (
          <FollowingFollowerList
            key={user._id}
            user={user}
          ></FollowingFollowerList>
        ))
        : "No followers";

      return (
            <Segment style={{ padding: '10em 0.1em 0.1em 0.1em' }} vertical>
              <Grid container stackable verticalAlign='middle' centered>
                <Grid.Row>
                  <Grid.Column width={8}>
                    <Item.Group>
                      <Item>
                        <Item.Image src={`/images/profile-picture/100x100/${userProfileData.data.profilePicture}`} rounded />
                        <Item.Content>
                          <Item.Header>{userProfileData.data.username}<Icon size='tiny' color='blue' name='check' circular /></Item.Header>
                          <Item.Meta>
                            {userProfileData.data.firstName + " " + userProfileData.data.lastName}
                          </Item.Meta>
                          <Item.Description>
                            <Linkify options={linkifyOptions}>
                              {"Bio: " + "“" + userProfileData.data.bio + "”"}
                            </Linkify>
                          </Item.Description>
                        </Item.Content>
                      </Item>
                    </Item.Group>

                    <Statistic.Group size="mini" style={staticStyle}>
                      <Statistic>
                        <Statistic.Value>{userProfileData.data.postsCount}</Statistic.Value>
                        <Statistic.Label>Posts</Statistic.Label>
                      </Statistic>

                      <Modal
                        trigger={
                          <Statistic onClick={this.getFollowers} style={{ cursor: "pointer" }}>
                            <Statistic.Value>{userProfileData.data.followers}</Statistic.Value>
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
                            <Statistic.Value>{userProfileData.data.followings}</Statistic.Value>
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


                    <FollowButton userId={userProfileData.data._id}></FollowButton>
                    <Divider hidden />

                    {userProfileData.data.postsCount === 0 ? (
                      <div>
                      <Segment attached='top'>This user has no posts yet.</Segment>
                      <Divider hidden />
                    </div>

                    ) : (
                        
                        <InfiniteScroll
                          className="gallery"
                          dataLength={userProfileData.data.posts.length} //This is important field to render the next data
                          next={this.fetchData}
                          hasMore={hasMore}
                          style={{ padding: '0.1em 0.1em 0.1em 0.1em' }}>
                          {posts}
                        </InfiniteScroll>
                      )}

                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Segment>
 
      );
    }
  }
}

const mapStateToProps = state => ({
  userProfileData: state.userProfile,
  fetchingUserData: state.user.loadingUser,
  user: state.user.data,
  alert: state.alert
});

const connectedProfilePage = connect(mapStateToProps)(UserProfile);
export { connectedProfilePage as default };
