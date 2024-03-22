import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Button, Form, Message, Icon, List, Grid, Header, Container, Divider, Image, Menu, Segment, Sidebar, Visibility, } from "semantic-ui-react";
import { userActions } from "../actions/userActions";
import Messages from "../components/Messages";


class LoginPage extends React.Component {
  constructor(props) {
    super(props);

    // reset login status
    this.props.dispatch(userActions.logout());

    this.state = {
      email: "",
      password: "",
      emailToVerify: "",
      forgotPasswordEmail: "",
      submitted: false,
      showForm: false,
      forgotPasswordForm: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount = () => {
    document.title = "Sign in | The Great Tunisia";
  };

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleSubmit(e) {
    e.preventDefault();

    this.setState({ submitted: true });
    const { email, password } = this.state;
    const { dispatch } = this.props;
    if (email && password) {
      dispatch(userActions.login(email, password));
    }
    //this.setState({ email: "", password: "", submitted: false });
  }

  resendEmailVerification = () => {
    this.props.dispatch(
      userActions.sendVerificationEmail(this.state.emailToVerify)
    );
  };

  forgotPasswordEmail = () => {
    this.props.dispatch(
      userActions.sendforgotPasswordEmail(this.state.forgotPasswordEmail)
    );
  };

  toggleEmailVerification = () => {
    this.setState({ showForm: !this.state.showForm });
  };

  toggleForgotPasswordForm = () => {
    this.setState({
      forgotPasswordForm: !this.state.forgotPasswordForm,
    });
  };

  render() {
    const { loggingIn, alert } = this.props;
    const {
      email,
      password,
      submitted,
      showForm,
      forgotPasswordForm,
    } = this.state;
    return (
      <div>
        <Segment style={{ padding: '6em 0em' }} vertical >
          <Grid container stackable verticalAlign='middle'>
            <Grid.Row>
              <Grid.Column width={10}>
                <Header as='h1' style={{ fontSize: '3.5em' }}>The Great Tunisia</Header>
                <p style={{ fontSize: '1.5em' }}>It was a victory for people's power and perhaps the first time ever in history that Tunisia is held up as the sole success story of "The Arab Spring Wake".</p>

                <Divider
                  horizontal
                  style={{ margin: '1em' }}
                >
                </Divider>



                <Form success={alert.type === "success" ? true : false} error={alert.type === "error" ? true : false} onSubmit={this.handleSubmit}>
                  <Form.Group widths="equal">
                    <Form.Input


                      size='huge'
                      autoCapitalize="none"
                      placeholder="Email or username"
                      type="text"
                      name="email"
                      value={email}
                      error={submitted && !email ? true : false}
                      onChange={this.handleChange}
                    />

                    <Form.Input
                      // maxLength=""
                      size='huge'
                      placeholder="Password"
                      type="password"
                      name="password"
                      value={password}
                      error={submitted && !password ? true : false}
                      onChange={this.handleChange}
                    />
                  </Form.Group>

                  {alert.type ? <Messages size='mini' alert={alert} /> : null}

                  <Button
                    fluid
                    icon labelPosition='right'
                    size='big'
                    content="Login"
                    disabled={email !== "" && password !== "" ? false : true}
                    loading={loggingIn ? true : false}>
                    Sign in
                  <Icon name='sign-in' />
                  </Button>

                </Form>
                <Message size="large">
                  <Message.Header>Other Features</Message.Header>
                  <Message.List>
                    <Message.Item>Don't have an account? <Link style={{ color: "black" }} to={"/register"}>Create one now</Link></Message.Item>
                    <Message.Item><span style={{ cursor: "pointer" }} onClick={this.toggleEmailVerification}>Resend verification email</span></Message.Item>
                    <Message.Item>Forgot password? <span style={{ cursor: "pointer" }} onClick={this.toggleForgotPasswordForm}>Reset password</span></Message.Item>
                  </Message.List>
                </Message>
                {showForm ? (
                  <Form>
                    <Form.Input
                      size='huge'
                      name="emailToVerify"
                      placeholder="Email"
                      type="email"
                      onChange={this.handleChange} />


                    <Button
                      fluid
                      icon labelPosition='right'
                      size='big'
                      onClick={this.resendEmailVerification}>

                      Resend
                                <Icon name='send' />

                    </Button>

                  </Form>
                ) : null}
                <Divider
                  horizontal
                  style={{ margin: '1em' }}
                >
                </Divider>

                {forgotPasswordForm ? (
                  <Form>
                    <Form.Input
                      size='huge'
                      name="forgotPasswordEmail"
                      placeholder="Email"
                      type="email"
                      onChange={this.handleChange}
                    />
                    <Button fluid
                      onClick={this.forgotPasswordEmail}
                      icon labelPosition='right'
                      size='big'>Reset<Icon name='send' />
                    </Button>

                  </Form>
                ) : null}



                <Divider
                  horizontal
                  style={{ margin: '3em 0em' }}
                >
                </Divider>
                <Container text>
                  <Header as='h3' style={{ fontSize: '2em' }}>
                     Grabs Your Attention To The “Tiger of the Mediterranean”,
        </Header>
                  <p style={{ fontSize: '1.33em' }}>Tunisia presents an economic paradox. It has everything it needs to become a “Tiger of the Mediterranean”, yet this economic potential never seems to materialize.
                  
                  On the contrary, the Tunisian economy is plagued by insufficient job creation, export performance has been weak, and corruption is widespread. And while poverty has decreased, regional disparities have persisted over time. Such problems have plagued the Tunisian economy for the past decade and ultimately triggered the 2011 revolution. Why? This platform tries to untangle the problems and suggest possible solutions.</p>
                  <Button as='a' size='large'>
                    Read More
        </Button>

                  <Divider
                    as='h4'
                    className='header'
                    horizontal
                    style={{ margin: '3em 0em', textTransform: 'uppercase' }}
                  >

                    <Link to={"/register"}>Sign Up Now!</Link>
                  </Divider>

                  <Header as='h3' style={{ fontSize: '2em' }}>The Tunisian demands for access to economic opportunity have not yet been realized.</Header>
                  
                  <p style={{ fontSize: '1.33em' }}>The Unfinished Revolution is a challenge to Tunisians to rethink their economic development model and to dare to think big about policy reforms that can accelerate growth and shared prosperity, create quality jobs and promote regional development.</p>
              
                </Container>
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

const mapStateToProps = (state) => ({
  loggingIn: state.authentication.loggingIn,
  alert: state.alert,
});

const connectedLoginPage = connect(mapStateToProps)(LoginPage);
export { connectedLoginPage as default };









