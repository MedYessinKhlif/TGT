import React, { Component } from "react";
import { Button, Form, Message, Icon, List, Grid, Header, Container, Divider, Image, Menu, Segment, Sidebar, Visibility, } from "semantic-ui-react";

class NotFoundPage extends Component {
  componentDidMount = () => {
    document.title = "Page not found | The Great Tunisia";
  };

  render() {
    return (
      <Segment style={{ padding: '20em 0.1em 0.1em 0.1em' }} vertical>
        <Grid container stackable verticalAlign='middle' centered>
          <Grid.Row>
            <Grid.Column width={8}>
              <Message negative>
                <Message.Header>We're sorry. We can't find that page</Message.Header>
                <p>Please verify your page name</p>
              </Message>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    );
  }
}

export { NotFoundPage as default };
