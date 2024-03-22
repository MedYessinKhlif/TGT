import React, { Fragment } from "react";
import { Icon, Modal, List, Statistic, Header, Divider } from "semantic-ui-react";
import { postActions } from "../../actions/postActions";
import { connect } from "react-redux";
import FollowingFollowerList from "../FollowingFollowerList";

const LikePost = ({
  dispatch,
  post: { postId, likes, authorId },
  postLikes,
  postLikeList
}) => {
  const handlePostLike = () => {
    dispatch(postActions.likePost(postId, authorId, postLikes));
  };

  const getPostLikes = () => {
    dispatch(postActions.getPostLikes(postId));
  };

  const handleClose = () => {
    dispatch({ type: "CLEAR_POST_LIKES" });
  };

  const list = postLikeList.length
    ? postLikeList.map(({ author }) => (
      <FollowingFollowerList
        key={author._id}
        user={author}
      ></FollowingFollowerList>
    ))
    : null;

  return (

    <Fragment>
      {postLikes.some(e => e === postId) ? (

        <Statistic onClick={handlePostLike} style={{ cursor: "pointer" }} size="mini">
          <Statistic.Value>
            <Icon.Group>
              <Icon name="arrow up" style={{ color: "#e89700" }} />
              <Icon corner name="add" style={{ color: "#e89700" }} />
            </Icon.Group>      </Statistic.Value>
          <Statistic.Label style={{ color: "#e89700" }}>UP</Statistic.Label>
        </Statistic>

      ) : (
          <Statistic onClick={handlePostLike} style={{ cursor: "pointer" }} size="mini">
            <Statistic.Value>
              <Icon.Group>
                <Icon name="arrow up" />
                <Icon corner name="add" />
              </Icon.Group>      </Statistic.Value>
            <Statistic.Label>UP</Statistic.Label>
          </Statistic>

        )}

      <Modal trigger={
        <Statistic floated="right" size="mini">
          <Statistic.Value style={{ cursor: "pointer" }} onClick={getPostLikes}>{likes}</Statistic.Value>
          <Statistic.Label>Ups</Statistic.Label>
        </Statistic>} onClose={handleClose}>

        <Modal.Header>Ups</Modal.Header>
        <Modal.Content scrolling>
          <Modal.Description>
            <List verticalAlign="middle" size="huge">
              {list}
            </List>
          </Modal.Description>
        </Modal.Content>
      </Modal>
    </Fragment>
  );
};

const mapStateToProps = state => ({
  postLikes: state.user.data.postLikes,
  postLikeList: state.post.postLikes
});

export default connect(mapStateToProps)(LikePost);
