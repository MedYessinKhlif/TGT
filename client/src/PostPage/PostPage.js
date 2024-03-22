import React, { Component } from "react";
import { connect } from "react-redux";
import { postActions } from "../actions/postActions";
import Post from "../components/Post/Post";
import Messages from "../components/Messages";
import { Button, Form, Message, Icon, List, Grid, Header, Container, Divider, Image, Menu, Segment, Sidebar, Visibility, } from "semantic-ui-react";

class PostPage extends Component {
  componentDidMount = () => {
    const { match, dispatch } = this.props;
    dispatch(postActions.getPost(match.params.postId));
  };

  render() {
    const { post, loadingUser, alert } = this.props;
    if (alert.type) {
      return (
        <Messages alert={alert} />
      );
    } else {
      return (
        <Segment style={{ padding: '10em 0.1em 0.1em 0.1em' }} vertical>
          <Grid container stackable verticalAlign='middle' centered>
            <Grid.Row>
              <Grid.Column width={8}>
                {!post.fetching && !loadingUser ? <Post post={post} /> : null}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>

      );
    }
  }
}

const mapStateToProps = state => ({
  post: state.post.post,
  loadingUser: state.user.loadingUser,
  alert: state.alert
});

const connectedHomePage = connect(mapStateToProps)(PostPage);
export { connectedHomePage as default };
