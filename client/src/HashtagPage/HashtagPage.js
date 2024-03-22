import React, { Component } from "react";
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
import { postActions } from "../actions/postActions";
import Messages from "../components/Messages";
import InfiniteScroll from "react-infinite-scroll-component";

class HashtagPage extends Component {
  componentDidMount = () => {
    const {
      dispatch,
      match,
      data: { hashtag }
    } = this.props;
    if (hashtag !== match.params.hashtag) {
      dispatch(
        postActions.getPostsByHashtag(match.params.hashtag, {
          initialFetch: true
        })
      );
    }
    document.title = "Hashtag Page | The Great Tunisia";
  };

  fetchData = () => {
    const {
      dispatch,
      data: { postsByHashtag },
      match
    } = this.props;
    const lastId = postsByHashtag[postsByHashtag.length - 1]._id;
    dispatch(
      postActions.getPostsByHashtag(match.params.hashtag, {
        initialFetch: false,
        lastId
      })
    );
  };

  render() {
    const {
      data: { postsByHashtag, totalPostsByHashtag },
      alert,
      match
    } = this.props;
    const hasMore =
      postsByHashtag.length === totalPostsByHashtag ? false : true;
    const hashtagPosts = postsByHashtag.map(post => {
      return (
        <Card fluid href={"/p/" + post._id} key={post._id}>
          <Image
            src={`/images/post-images/thumbnail/${post.photo}`} rounded />

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

      );
    });
    if (alert.type) {
      return (
        <div className="container">
          <Messages alert={alert} />
        </div>
      );
    }
    return (
      <Segment style={{ padding: '10em 0.1em 0.1em 0.1em' }} vertical>
        <Grid container stackable verticalAlign='middle' centered>
          <Grid.Row>
            <Grid.Column width={8}>

              <Statistic size='mini'>
                <Statistic.Value>
                  <Icon name='hashtag' />{match.params.hashtag}
                </Statistic.Value>
              </Statistic>

              <Statistic size='mini' floated="right">
                <Statistic.Value>
                  <Icon name='hashtag' />{totalPostsByHashtag}
                </Statistic.Value>
                <Statistic.Label>Posts</Statistic.Label>
              </Statistic>

              <Divider />
              <InfiniteScroll
                style={{ padding: '0.1em 0.1em 0.1em 0.1em' }}
                dataLength={hashtagPosts.length} //This is important field to render the next data
                next={this.fetchData}
                hasMore={hasMore}
              >
                {hashtagPosts}
              </InfiniteScroll>

            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    );
  }
}
const mapStateToProps = state => ({
  data: state.post,
  alert: state.alert
});

const connectedHashtagPage = connect(mapStateToProps)(HashtagPage);
export { connectedHashtagPage as default };
