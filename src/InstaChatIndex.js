import "./stylesheets/InstaChatIndex.scss";
import "./stylesheets/main.scss";
import React, { useState, useEffect, Fragment, useRef } from "react";
import "./stylesheets/colorStyle.scss";
// import { Provider } from "./components/context";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { createBrowserHistory } from "history";
import Submit from "./components/Submit/Submit";
import Setting from "./components/Setting/Setting";
import ChatList from "./components/ChatList/ChatList";
import LoginIndex from "./components/LoginIndex/LoginIndex";
import ChatWindow from "./components/ChatWindow/ChatWindow";
import ModalTool from "./components/ModalTool/ModalTool";
import { Provider } from "./components/context";
import * as R from "ramda";
import moment from "moment";

import firebase from "firebase";
import ContactList from "./components/ContactList/ContactList";
import FriendList from "./components/FriendList/FriendList";
import { fetchPreview } from "./api/restAPI/restAPI";

const InstaChatIndex = (props) => {

  const msgAreaRef = useRef();
  const msgInputRef = useRef();
  const replyMsgInputRef = useRef();
  const videoRef = useRef();
  const [submitState, setSubmitState] = useState(0);
  const [loginState, setLoginState] = useState(0);

  const [newChatShow, setNewChatShow] = useState(false);
  const [popupWindow, setPopupWindow] = useState();
  const [childWindow, setChildWindow] = useState();

  const [myUserId, setMyUserId] = useState("");
  const [myUserName, setMyUserName] = useState("");
  const [joinedList, setJoinedList] = useState([]);
  const [pickedList, setPickedList] = useState([]);
  const [notificationList, setNotificationList] = useState([]);
  const [tempAccountId, setTempAccountId] = useState("");

  const [msgInput, setMsgInput] = useState("");
  const [msgList, setMsgList] = useState([]);
  const [msgListTempState, setMsgListTempState] = useState([]);
  const [chatRoomList, setChatRoomList] = useState([]);
  const [pickedChatRoomId, setPickedChatRoomId] = useState("");
  const [chatRoomScrollHeight, setChatRoomScrollHeight] = useState(0);
  const [inputContent, setInputContent] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [receiver, setReceiver] = useState([]);
  const [filteredChatList, setFilteredChatList] = useState([]);
  const [receiverUserId, setReceiverUserId] = useState("");
  const [receiverUserName, setReceiverUserName] = useState("");
  const [myUserInfo, setMyUserInfo] = useState();
  const [pathName, setPathName] = useState("chatroom");
  const [userInfoSettingShow, setUserInfoSettingShow] = useState(false);
  const [currentUser, setCurrentUser] = useState();
  const [replyMsgTarget, setReplyMsgTarget] = useState();
  // const [msgListFetchPreview, setMsgListFetchPreview] = useState();
  // const []
  useEffect(() => {
    if (currentUser && myUserId) {
      let chatroomLinkRef = document.getElementById("chatroomLink");
      if (chatroomLinkRef) {
        chatroomLinkRef.click();
      }

      //------------------------------------------------------------------
      let myUserInfoRef = database.ref(
        `${currentUser.uid}/userInfo/${myUserId}`
      );
      myUserInfoRef.on("value", function (snapshot) {
        if (snapshot.val()) {
          setMyUserInfo(snapshot.val());
          setMyUserId(snapshot.val().userId);
          setMyUserName(snapshot.val().userName);
        } else {
        }
      });
    }
  }, [currentUser, myUserId]);

  let config = {
    apiKey: "xxxxxxxxxxxxxxxxxxxxxxx_xxxxxxxxxxxxxxx",
    authDomain: "instachat-e46bf-default-rtdb.firebaseapp.com",
    // For databases not in the us-central1 location, databaseURL will be of the
    // form https://[databaseName].[region].firebasedatabase.app.
    // For example, https://your-database-123.europe-west1.firebasedatabase.app
    databaseURL: "https://instachat-e46bf-default-rtdb.firebaseio.com/",
    storageBucket: "instachat-e46bf.appspot.com",
  };

  // firebase.initializeApp(config);
  if (!firebase.apps.length) {
    firebase.initializeApp(config);
  } else {
    firebase.app(); // if already initialized, use that one
  }

  let user = {
    email: "knighttkey@gmail.com",
    password: "frog363575",
  };

  const loginFirebase = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(user.email, user.password)
      .then(function (result) {
        let user = firebase.auth().currentUser;
        setCurrentUser(user);
        firebase
          .database()
          .ref(`/${user.uid}/`)
          .on("value", (e) => {
            //  setMsgList(e.val())
          });

      })
      .catch(function (error) {
        // Handle error.
      });
  };

  useEffect(() => {
    loginFirebase();
  }, []);

  const database = firebase.database();
  let chatroomMsgRef;
  let chatroomRef;
  let chatroomParticipantRef;
  let chatroomListRef;

  useEffect(() => {
    if (currentUser) {
      chatroomListRef = database.ref(`/${currentUser.uid}/chatroom/`);

      if (!inputContent) {
        database.ref(`/${currentUser.uid}`).on("value", (e) => {
          let eventItem = e.val().chatroom;
          setChatRoomList(eventItem);
        });
      }

      if (pickedChatRoomId) {
        chatroomMsgRef = database.ref(
          `${currentUser.uid}/chatroom/${pickedChatRoomId}/msgs/`
        );
        chatroomRef = database.ref(
          `${currentUser.uid}/chatroom/${pickedChatRoomId}/`
        );
        chatroomParticipantRef = database.ref(
          `${currentUser.uid}/chatroom/${pickedChatRoomId}/participants/`
        );
        let receiverData = [];
        chatroomRef.once("value", function (snapshot) {
          if (snapshot.val() && snapshot.val().participants) {
            receiverData = R.without(
              [{ userId: myUserId, userName: myUserName }],
              snapshot.val().participants
            );
          } else {
            receiverData = [];
          }
        });
        setReceiver(receiverData);
        chatroomRef.update({
          participants: [
            {
              userId: myUserId,
              userName: myUserName,
            },
            {
              userId: receiverData.length
                ? receiverData[0].userId
                : receiverUserId,
              userName: receiverData.length
                ? receiverData[0].userName
                : receiverUserName,
            },
          ],
        });

        const storageRef = database.ref("/images/");


        let tempMsgList = [];
        chatroomMsgRef.on("child_added", (snapshot) => {
          const client = snapshot.val();
          client.key = snapshot.key;
          // setMsgList
          tempMsgList.push(client);

          setMsgListTempState(tempMsgList);
        });
      }
    }
  }, [pickedChatRoomId, currentUser]);


  useEffect(() => {
      if(msgListTempState.length) {
        let temp = [...msgListTempState];
        let msgTempListWithMeta = [];
        temp.map((msgItem, msgIndex) => {
          switch (msgItem.type) {
            case "text":
              case "reply_text":
                case "reply_image":
                  case "reply_video":
                    
              let tempPreviewList = [];
              let patternTest =
                /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
              let targetUrl = msgItem.content.match(patternTest);
              if (targetUrl && targetUrl.length) {
                targetUrl.map((urlItem, urlIndex) => {
    
                  let data = { url: urlItem };
                  fetchPreview(data).then((res) => {
                    tempPreviewList.push(res);
                    let msgTempItem = {
                      ...msgItem,
                      metaData: tempPreviewList,
                    };
                    msgTempListWithMeta.push(msgTempItem);
                    let result = temp.map((x) => {
                      const item = msgTempListWithMeta.find(
                        ({ msgId }) => msgId === x.msgId
                      );
                      return item ? item : x;
                    });
                    setMsgList(result);
                  });
                });
              } else {
                setMsgList(temp);
              }
              
              break;
            case "image":
            case "video":
              setMsgList(temp);
              break;
            default:
              setMsgList(temp);
          }
        });
  
      }
      
  }, [msgListTempState, msgListTempState.length]);

  const handleGetChatRoomId = () => {
    if (!pickedChatRoomId) {
      let chatRoomIdGenerator = Math.random().toString(36).substring(2);
      setPickedChatRoomId(chatRoomIdGenerator);
      return chatRoomIdGenerator;
    } else {
      return pickedChatRoomId;
    }
  };

  const handleMsgSend = () => {
    // setMsgInput(text);
    if (msgInputRef.current.value.length && pickedChatRoomId) {
      // var myRef = database.ref('/msgs').push();
      let timestamp = Math.floor(Date.now() / 1000);
      let key = new Date().getTime() + Math.random().toString(36).substring(2);
      // let key = Math.random().toString(36).substring(8);
      let chatroomMsgRef = database.ref(
        `${currentUser.uid}/chatroom/${pickedChatRoomId}/msgs/`
      );
      //  myRef.push(newData);
      let postData = {
        msgId: key,
        senderUserId: myUserId,
        senderUserName: myUserName,
        content: msgInputRef.current.value,
        type: "text",
        createTime: moment(new Date().getTime()).format("YYYY/MM/DD HH:mm:ss"),
        receiverUserId: receiver.length ? receiver[0].userId : receiverUserId,
        receiverUserName: receiver.length
          ? receiver[0].userName
          : receiverUserName,
      };

      chatroomMsgRef.child(key).set(postData);

      msgInputRef.current.value = "";
      setTimeout(() => {
        if (msgAreaRef) {
          msgAreaRef.current.scrollTo({
            top: Number.MAX_SAFE_INTEGER,
            behavior: "smooth",
          });
        }
      }, 1000);
    }
  };

  const handleReplyMsgSend = () => {
    if (
      msgInputRef.current.value.length &&
      pickedChatRoomId &&
      replyMsgTarget
    ) {
      let key = new Date().getTime() + Math.random().toString(36).substring(2);
      let chatroomMsgRef = database.ref(
        `${currentUser.uid}/chatroom/${pickedChatRoomId}/msgs/`
      );
      let replyTargetType;
      switch (replyMsgTarget.type) {
        case "text":
          replyTargetType = "text";
          break;
        case "image":
          replyTargetType = "image";
          break;
        case "video":
          replyTargetType = "video";
          break;
        case "reply_text":
        case "reply_image":
        case "reply_video":
          replyTargetType = "text";
          break;
        default:
          replyTargetType = "text";
      }
      let postData = {
        msgId: key,
        senderUserId: myUserId,
        senderUserName: myUserName,
        content: msgInputRef.current.value,
        replyMsgTarget: replyMsgTarget,
        type: `reply_${replyTargetType}`,
        createTime: moment(new Date().getTime()).format("YYYY/MM/DD HH:mm:ss"),
        receiverUserId: receiver.length ? receiver[0].userId : receiverUserId,
        receiverUserName: receiver.length
          ? receiver[0].userName
          : receiverUserName,
      };

      chatroomMsgRef.child(key).set(postData);

      msgInputRef.current.value = "";
      setReplyMsgTarget();
      setTimeout(() => {
        msgAreaRef.current.scrollTo({
          top: Number.MAX_SAFE_INTEGER,
          behavior: "smooth",
        });
      }, 0);
    }
  };

  useEffect(() => {
    if (currentUser) {
      database.ref(`${currentUser.uid}`).on("value", (e) => {
      });
    }
  }, [currentUser]);


  const handleCloseApp = () => {
    // remote.app.quit();
  };

  const handleStartNewChat = () => {
    handleGetChatRoomId();
    setNewChatShow(true);
  };

  const handleUserSettingShow = () => {
    setUserInfoSettingShow(true);
    setPathName("setting");
  };

  const [contextMenuShow, setContextMenuShow] = useState(false);


  const contextValue = {
    loginState,
    setLoginState,
    submitState,
    setSubmitState,
    newChatShow,
    setNewChatShow,
    popupWindow,
    setPopupWindow,
    childWindow,
    setChildWindow,
    myUserId,
    setMyUserId,
    myUserName,
    setMyUserName,
    joinedList,
    setJoinedList,
    videoRef,
    pickedList,
    setPickedList,
    notificationList,
    setNotificationList,
    tempAccountId,
    setTempAccountId,
    handleCloseApp,
    msgInput,
    setMsgInput,
    handleMsgSend,
    msgInputRef,
    msgList,
    setMsgList,
    msgAreaRef,
    pickedChatRoomId,
    setPickedChatRoomId,
    chatRoomList,
    chatRoomScrollHeight,
    setChatRoomScrollHeight,
    inputContent,
    setInputContent,
    searchResults,
    setSearchResults,
    handleStartNewChat,
    filteredChatList,
    setFilteredChatList,
    receiverUserId,
    setReceiverUserId,
    receiverUserName,
    setReceiverUserName,
    database,
    firebase,
    receiverUserName,
    receiver,
    setReceiver,
    myUserInfo,
    contextMenuShow,
    setContextMenuShow,
    currentUser,
    replyMsgInputRef,
    handleReplyMsgSend,
    replyMsgTarget,
    setReplyMsgTarget,
    setUserInfoSettingShow,
  };

  return (
    <Router>
      <div className="insta_chat_index" id="instaChatIndex">
        <Provider value={contextValue}>
          <div className="app_title_bar">InstaChat</div>
          <div className="chat_box">
            {loginState === 0 ? (
              <LoginIndex />
            ) : (
              <Fragment>
                <div className="nav_bar">
                  <div className="func_icon icon_menu">
                    <div className="bar"></div>
                    <div className="bar"></div>
                  </div>

                  <Link
                    className="link"
                    id="chatroomLink"
                    tabIndex="0"
                    to="/chatroom"
                    onClick={() => setPathName("chatroom")}
                  >
                    <div className="func_icon icon_chatroom"></div>
                  </Link>

                  <Link
                    className="link"
                    id="friendLink"
                    tabIndex="1"
                    to="/friend"
                    onClick={() => setPathName("friend")}
                  >
                    <div className="func_icon icon_phonebook"></div>
                  </Link>

                  <div
                    className="func_icon icon_setting"
                    onClick={handleUserSettingShow}
                  ></div>
                </div>

                <Switch>
                  <Route exact path="/chatroom">
                    <ChatList />
                  </Route>
                  <Route exact path="/contact">
                    <ContactList />
                  </Route>
                  <Route exact path="/friend">
                    <FriendList />
                  </Route>
                </Switch>

                {pickedChatRoomId ? (
                  <ChatWindow />
                ) : (
                  <div className="no_select">Select a chat to start</div>
                )}

                {userInfoSettingShow ? (
                  <ModalTool
                    modalShow={userInfoSettingShow}
                    modalCloseFunction={() => setUserInfoSettingShow(false)}
                    modalWidth={300}
                    modalHeight={360}
                    backgroundOpacity={0.6}
                    modalInnerBackground={`var(--color-saltpan)`}
                  >
                    <Setting closeModal={() => setUserInfoSettingShow(false)} />
                  </ModalTool>
                ) : null}
              </Fragment>
            )}
          </div>
        </Provider>
      </div>
    </Router>
  );
};

export default InstaChatIndex;
