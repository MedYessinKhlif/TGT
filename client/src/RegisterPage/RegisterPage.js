import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Button, Form, Message, Icon, List, Grid, Header, Container, Divider, Image, Menu, Segment, Sidebar, Visibility, } from "semantic-ui-react";
import { userActions } from "../actions/userActions";
import Messages from "../components/Messages";

class RegisterPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
        retypepassword: ""
      },
      submitted: false,
      retTypePasswordError: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount = () => {
    document.title = "Sign up | The Great Tunisia";
  };

  handleChange = event => {
    const { name, value } = event.target;
    const { user } = this.state;
    this.setState({
      user: {
        ...user,
        [name]: value
      }
    });
  };

  handleRetypePassword = event => {
    const { name, value } = event.target;
    const { user } = this.state;
    if (value !== this.state.user.password) {
      this.setState({
        user: {
          ...user,
          [name]: value
        },
        retTypePasswordError: true
      });
    } else {
      this.setState({
        user: {
          ...user,
          [name]: value
        },
        retTypePasswordError: false
      });
    }
  };

  handleSubmit(event) {
    event.preventDefault();

    this.setState({ submitted: true });
    const { user } = this.state;
    const { dispatch } = this.props;
    if (
      user.firstName &&
      user.lastName &&
      user.username &&
      user.password &&
      user.retypepassword &&
      !this.state.retTypePasswordError
    ) {
      dispatch(userActions.register(user));
    }
  }

  render() {
    const { registering, alert } = this.props;
    const { user, submitted, retTypePasswordError } = this.state;
    return (
      <div>
        <Segment style={{ padding: '6em 0em' }} vertical>
          <Grid container stackable verticalAlign='middle'>
            <Grid.Row>
              <Grid.Column width={10}>
                <Header as='h1' style={{ fontSize: '3.5em' }}>The Great Tunisia</Header>
                <p style={{ fontSize: '1.5em' }}>
                Create an account so we can connect you with Tunisia's change makers!
            </p>

                <Form
                  size="large"
                  success={alert.type === "success" ? true : false}
                  error={alert.type === "error" ? true : false}
                  name="form"
                  onSubmit={this.handleSubmit}
                >
                  <Form.Group widths="equal">
                    <Form.Input
                      required
                      label="First Name"
                      placeholder="First Name"
                      type="text"
                      name="firstName"
                      value={user.firstName}
                      error={submitted && !user.firstName ? true : false}
                      onChange={this.handleChange}
                    />

                    <Form.Input
                      required
                      label="Last Name"
                      placeholder="Last Name"
                      type="text"
                      name="lastName"
                      value={user.lastName}
                      error={submitted && !user.lastName ? true : false}
                      onChange={this.handleChange}
                    />
                  </Form.Group>
                  <Form.Group widths="equal">
                    <Form.Input
                      required
                      autoCapitalize="none"
                      label="Username"
                      placeholder="Username"
                      type="text"
                      name="username"
                      value={user.username}
                      error={submitted && !user.username ? true : false}
                      onChange={this.handleChange}
                    />
                    <Form.Input
                      required
                      label="Email"
                      placeholder="Email"
                      type="email"
                      name="email"
                      value={user.email}
                      error={submitted && !user.email ? true : false}
                      onChange={this.handleChange}
                    />
                  </Form.Group>
                  <Form.Input
                    required
                    label="Password"
                    placeholder="Password"
                    type="password"
                    name="password"
                    value={user.password}
                    error={submitted && !user.password ? true : false}
                    onChange={this.handleChange}
                  />
                  <Form.Input
                    required
                    label="Re-type password"
                    placeholder="Re-type password"
                    type="password"
                    name="retypepassword"
                    value={user.retypepassword}
                    error={
                      (submitted && !user.retypepassword ? true : false) ||
                      retTypePasswordError
                    }
                    onChange={this.handleRetypePassword}
                  />

                  <Button
                    size='big'
                    content="Sign up"
                    icon="signup"
                    icon labelPosition='right'

                    fluid
                    primary
                    disabled={
                      !retTypePasswordError &&
                        user.retypepassword !== "" &&
                        user.password !== "" &&
                        user.email !== "" &&
                        user.firstName !== "" &&
                        user.lastName !== "" &&
                        user.username !== ""
                        ? false
                        : true
                    }
                    loading={registering ? true : false}
                  > <Icon name='signup' />
                  Sign Up</Button>
                  <br>
                  </br>
                  {alert.type ? <Messages alert={alert} /> : null}

                </Form>
                <Message size="large" attached="bottom" >
                  <Icon name="help" />
          Already signed up?&nbsp;<Link to={"/login"}>Login here</Link>
          &nbsp;instead.
        </Message>





                <Divider
                  as='h4'
                  className='header'
                  horizontal
                  style={{ margin: '3em 0em', textTransform: 'uppercase' }}
                >


                </Divider>

                {/* <Container text>
                  <Header as='h3' style={{ fontSize: '2em' }}>
                    Breaking The Grid, Grabs Your Attention
        </Header>
                  <p style={{ fontSize: '1.33em' }}>
                    Instead of focusing on content creation and hard work, we have learned how to master the
                    art of doing nothing by providing massive amounts of whitespace and generic content that
                    can seem massive, monolithic and worth your attention.
        </p>
                  <Button as='a' size='large'>
                    Read More
        </Button>

                  <Divider
                    as='h4'
                    className='header'
                    horizontal
                    style={{ margin: '3em 0em', textTransform: 'uppercase' }}
                  >

                    <Link to={"/login"}>Login Now!</Link>
                  </Divider>

                  <Header as='h3' style={{ fontSize: '2em' }}>
                    Did We Tell You About Our Bananas?
        </Header>
                  <p style={{ fontSize: '1.33em' }}>
                    Yes I know you probably disregarded the earlier boasts as non-sequitur filler content, but
                    it's really true. It took years of gene splicing and combinatory DNA research, but our
                    bananas can really dance.
        </p>
                  <Button as='a' size='large'>
                    I'm Still Quite Interested
        </Button>
                </Container> */}
              </Grid.Column>
              <Grid.Column floated='right' width={4}>
                {/* //img */}
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column textAlign='center'>

              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>

              <Segment inverted vertical style={{ padding: '5em 0em' }}>
          <Container>
            <Grid divided inverted stackable>
              <Grid.Row>
                <Grid.Column width={3}>
                  <Header inverted as='h4' content='About' />
                  <List link inverted>
                    <List.Item as='a'>Aims & Plans</List.Item>
                    <List.Item as='a'>Services </List.Item>
                    <List.Item as='a'>Email Us</List.Item>
                    <List.Item as='a'>Report A Problem</List.Item>
                  </List>
                </Grid.Column>
                {/* <Grid.Column width={3}>
                  <Header inverted as='h4' content='Services' />
                  <List link inverted>
                    <List.Item as='a'>Banana Pre-Order</List.Item>
                    <List.Item as='a'>DNA FAQ</List.Item>
                    <List.Item as='a'>How To Access</List.Item>
                    <List.Item as='a'>Favorite X-Men</List.Item>
                  </List>
                </Grid.Column> */}
                <Grid.Column width={7}>
                  <Header as='h4' inverted>
                    The Great Tunisia
              </Header>
                  <p a="">All The Rights Are Reserved © 2021</p>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Container>
        </Segment>



      </div>
    );
  }
}

const mapStateToProps = state => ({
  registering: state.registration.registering,
  alert: state.alert
});

const connectedRegisterPage = connect(mapStateToProps)(RegisterPage);
export { connectedRegisterPage as default };
