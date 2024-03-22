import React, { Component } from "react";
import { Button, Form, Comment, Divider } from "semantic-ui-react";
import { connect } from "react-redux";
import { commentActions } from "../../actions/commentActions";
import TextInput from "react-autocomplete-input";
import "react-autocomplete-input/dist/bundle.css";
import { debounce } from "throttle-debounce";

function searchUser(q) {
  const requestOptions = {
    method: "POST",
    headers: {
      Authorization: JSON.parse(localStorage.getItem("user")).token,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ q })
  };

  return fetch("/api/user/searchByUsername", requestOptions).then(res => {
    return res;
  });
}

class PostForm extends Component {
  constructor() {
    super();
    this.state = {
      value: "",
      part: "",
      suggestions: []
    };

    this.debouncedRequestOptions = debounce(500, this.handleRequestOptions);
  }

  handleChange = value => {
    this.setState({ value });
  };

  handleRequestOptions = part => {
    this.setState({ part });

    if (part !== "") {
      searchUser(part).then(response => {
        if (part === this.state.part) {
          response.json().then(results => {
            this.setState({
              isLoading: false,
              suggestions: results.users.map(user => user.username)
            });
          });
        } else {
          // Ignore suggestions if input value changed
          this.setState({
            isLoading: false
          });
        }
      });
    }
  };

  handlePostCommentSubmit = () => {
    const {
      dispatch,
      post: { postId, authorId }
    } = this.props;
    const { value } = this.state;
    if (value !== "") {
      dispatch(commentActions.addComment({ value, postId, authorId }));
      this.setState({ value: "" });
    }
  };

  render() {
    const { value, suggestions } = this.state;
    return (
      <div>

        <Form reply onSubmit={this.handlePostCommentSubmit}>
          <TextInput
            rows={2}
            maxOptions={8}
            offsetY={20}
            minChars={1}
            type="textarea"
            name="commentText"
            placeholder="What Is Your Feedback?"
            value={value}
            onRequestOptions={this.debouncedRequestOptions}
            options={suggestions}
            onChange={this.handleChange}
            style={{ maxHeight: 80 }} />
          <Divider hidden horizontal />

          <Button
            content="Add Your Feedback"
            labelPosition="left"
            icon="edit"
            floated="right"
            size="medium" />
        </Form>

      </div>
    );
  }
}

export default connect(null)(PostForm);
