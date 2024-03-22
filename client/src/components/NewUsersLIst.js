import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { List, Image, Dimmer, Loader, Button, Search, Container, Divider, Grid, Header, Icon, Menu, Segment, Sidebar, Visibility, } from "semantic-ui-react";
import { connect } from "react-redux";
import { userActions } from "../actions/userActions";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { AutosuggestExample } from "../components/Autosuggestion";

dayjs.extend(relativeTime);

class NewUsersList extends Component {
  componentDidMount = () => {
    const { dispatch, newUsers } = this.props;
    if (!newUsers.users.length) {
      dispatch(userActions.getNewUsers({ initialFetch: true }));
    }
  };

  fetchMoreUsers = () => {
    const {
      dispatch,
      newUsers: { users, fetchingNewUsers }
    } = this.props;

    if (!fetchingNewUsers) {
      const lastId = users[users.length - 1]._id;
      dispatch(userActions.getNewUsers({ initialFetch: false, lastId }));
    }
  };

  render() {
    const { newUsers, username } = this.props;

    const users = newUsers.users.map(user => {
      return (
        <List.Item as="a" href={user.username === username ? "/profile" : "/" + user.username} key={user._id}>
          <Image size="mini" src={`/images/profile-picture/100x100/${user.profilePicture}`} rounded/>
          <List.Content>
            <List.Header>
              {user.username}
            </List.Header>
            <List.Description>joined {dayjs(user.date).fromNow()}</List.Description>
          </List.Content>
        </List.Item>
      );
    });
    return (
      <Segment style={{ padding: '12em 0em' }} vertical>
        <Grid container stackable>
          <Grid.Row>
            <Grid.Column width={12}>
              <Container text>
                <Header as='h3' style={{ fontSize: '2em' }}>Fetch Users For An Extensive Network!</Header>
                <p style={{ fontSize: '1.33em' }}>
                By continually putting yourself out there and following new people, you're effectively stepping out of the box. The more you network, the more you'll grow and learn how to make lasting connections.</p>
              </Container>
              <Divider hidden horizontal />

              <Grid celled='internally' columns='equal' stackable>
                <Grid.Row>
                  <Grid.Column style={{ paddingBottom: '5em', paddingTop: '5em' }}>
                    <List size="big" divided relaxed>
                      {newUsers.fetching ? (
                        <Dimmer active>
                          <Loader />
                        </Dimmer>
                      ) : null}
                      {users}
                      {newUsers.usersCount - newUsers.users.length !== 0 ? (
                        <Button fluid loading={newUsers.fetchingNewUsers} onClick={() => this.fetchMoreUsers()}>More users</Button>
                      ) : null}
                    </List>
                  </Grid.Column>

                  <Grid.Column style={{ paddingBottom: '5em', paddingTop: '5em' }}>
                    <AutosuggestExample />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    );
  }
}

const mapStateToProps = state => ({
  newUsers: state.newUsers,
  username: state.user.data.username
});

const connectedNewUsersList = connect(mapStateToProps)(NewUsersList);
export { connectedNewUsersList as NewUsersList };
