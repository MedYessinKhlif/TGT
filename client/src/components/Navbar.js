import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Menu, Icon, Image, Dropdown, Label, Button, Divider, Visibility, Container } from "semantic-ui-react";
import { connect } from "react-redux";
import { history } from "../_helpers/history";
import { notificationActions } from "../actions/notificationActions";
import { socketActions } from "../actions/socketActions";
import { userActions } from "../actions/userActions";
import { NotificationPopup } from "./NotificationPopup";
import { AnsweringModal } from "../MessengerPage/AnsweringModal";

const fixedMenuStyle = {
  backgroundColor: '#fff',
  border: '1px solid #ddd',
}


function getUserDataF(path, cb) {
  const params = {
    profilePage: false,
    userProfile: false,
  };
  if (path === "/") {
    cb({ ...params });
  } else if (path === "/profile") {
    cb({ ...params, profilePage: true });
  } else {
    cb({ ...params, userProfile: true });
  }
}

class Navbar extends Component {

  constructor() {
    super();
    this.state = {
      activePath: "",
    };
    this.params = {
      homePage: false,
      profilePage: false,
      userProfile: false,
    };
  }
  componentDidMount() {
    const { dispatch } = this.props;

    history.listen((location) => {
      this.setState({ activePath: location.pathname });

      getUserDataF(location.pathname, (data) =>
        dispatch(userActions.getUserData(data))
      );
    });

    getUserDataF(history.location.pathname, (data) =>
      dispatch(userActions.getUserData(data))
    );

    this.setState({ activePath: history.location.pathname });
    dispatch(socketActions.connect());
  }

  handleNotificationPopupToggle = (e) => {
    e.stopPropagation();
    const { dispatch, notifications } = this.props;
    const ids = notifications.filter((e) => !e.read).map((e) => e._id);

    dispatch(notificationActions.toggleNotificationPopup());

    if (!notifications.length) {
      dispatch(
        notificationActions.fetchNotifications({ initialFetch: true }, ids)
      );
    } else {
      const lastId = notifications[notifications.length - 1]._id;
      dispatch(
        notificationActions.fetchNotifications(
          { initialFetch: false, lastId },
          ids
        )
      );
    }
  };
  render() {
    const { user, answeringModal } = this.props;
    const { activePath } = this.state;

    if (user.loadingUser) {
      return null;
    } else {
      return (
        <div >

          <Menu secondary fixed='top'inverted
            borderless
            style={ fixedMenuStyle }
            size='massive'>
              <Menu.Item>
              <Image as='a' href="/" src="http://localhost:3000/images/TheGMLogo.png" style={{ width:70, height:70, marginLeft:'5em' }} />
              </Menu.Item>
              {/* <Menu.Item header as="h2" style={{ color:"black", fontFamily:"Georgia", fontWeight:"normal" , fontSize:"200%" }}>The Great Tunisia</Menu.Item> */}
          


            <Menu.Item>
              <Button basic circular icon='home' active={activePath === "/"} as={Link} to="/" />
            </Menu.Item>
            <Menu.Item>
              <Button basic circular icon='user outline' as={Link} to="/profile" />
            </Menu.Item>
            <Menu.Item>
                <Button active={activePath.includes("/posts/upload/")} as={Link} to="/posts/upload" basic circular icon='plus' />
              </Menu.Item>

           

            

            <Menu.Menu position='right'>
            
            <Menu.Item>
              <Button active={activePath.includes("/search")} basic circular icon='search' as={Link} to="/search" />
            </Menu.Item>
            {/* <Menu.Item>
              <Button basic circular icon='talk' active={activePath.includes("/messages/")} as={Link} to="/messages/chat" />
              {user.data.messagesCount !== 0 ? (
                <Label size="mini"  color="red" attached='bottom left' circular>
                  {user.data.messagesCount}
                </Label>
              ) : (
                  <Label size="mini" attached='bottom left' circular>0</Label>
                )}
            </Menu.Item> */}

            <NotificationPopup>    
            <Menu.Item >
              <Button basic circular icon='alarm' onClick={(e) => this.handleNotificationPopupToggle(e)} />
              {user.data.notificationsCount !== 0 ? (
                <Label size="mini"  color="red" attached='bottom left' circular>
                  {user.data.notificationsCount}
                </Label>
              ) : (
                  <Label size="mini" attached='bottom left' circular>
                    0
                  </Label>
                )}
            </Menu.Item>
            </NotificationPopup>
            
              <Menu.Item>
                <Button active={activePath.includes("/login/")} as={Link} to="/login">Sign Out</Button>
              </Menu.Item>
            </Menu.Menu>
          </Menu>

          {answeringModal.isOpen ? <AnsweringModal></AnsweringModal> : null}
        </div>
      );
    }
  }
}
const mapStateToProps = (state) => ({
  user: state.user,
  notifications: state.notification.notifications,
  answeringModal: state.chat.answeringModal,
  currentRoom: state.chat.currentRoom,
  roomId: state.chat.roomId,
});

const connectNavbar = connect(mapStateToProps)(Navbar);
export { connectNavbar as default };
