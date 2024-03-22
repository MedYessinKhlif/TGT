import React, { Component } from "react";
import { connect } from "react-redux";
import Feed from "../components/Post/Feed";
import { NewUsersList } from "../components/NewUsersLIst";
import { Grid, Segment } from "semantic-ui-react";
import { AutosuggestExample } from "../components/Autosuggestion";


const mainStyle = { marginTop: "100px" }

class HomePage extends Component {
  componentDidMount = () => {
    document.title = "The Great Tunisia";
  };

  render() {
    return (

      <Segment style={{ padding: '0.1em 0.1em 0.1em 0.1em' }} vertical>
        <Grid style={mainStyle} container stackable verticalAlign='middle' centered>
          <Grid.Row>
            <Grid.Column width={8}>
              <Feed />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>

    );
  }
}

const mapStateToProps = state => ({
  fetching: state.post
});

const connectedHomePage = connect(mapStateToProps)(HomePage);
export { connectedHomePage as default };
