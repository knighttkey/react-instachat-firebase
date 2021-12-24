import React, {
  useCallback,
  useState,
  useEffect,
  Fragment,
  useContext,
  useRef,
} from "react";
import "./FriendList.scss";
import { Provider } from "../context";
import * as R from "ramda";
import context from "../context";
import SearchTool from "./../SearchTool/SearchTool";
import moment from "moment";

const FriendList = () => {
  const contextValue = useContext(context);
  const {
    setNewChatShow,
    pickedList,
    handleCloseApp,
    setMsgInput,
    handleMsgSend,
    msgInputRef,
    msgList,
    pickedChatRoomId,
    setPickedChatRoomId,
    chatRoomList,
    inputContent,
    setInputContent,
    searchResults,
    handleStartNewChat,
    filteredChatList,
    setFilteredChatList,
    receiverUserId,
    setReceiverUserId,
    receiverUserName,
    setReceiverUserName,
    database,
    myUserId,
    myUserName,
    currentUser,
  } = contextValue;

  const [searchList, setSearchList] = useState([]);
  const [inputFocusState, setInputFocusState] = useState(false);

  const newFriendIdRef = useRef();
  const newFriendNameRef = useRef();

  const handleAddContact = () => {
    let chatRoomIdGenerator = Math.random().toString(36).substring(2);
    let chatroomRef = database.ref(
      `${currentUser.uid}/chatroom/${chatRoomIdGenerator}/`
    );
    chatroomRef.update({
      participants: [
        {
          userId: myUserId,
          userName: myUserName,
        },
        {
          userId: receiverUserId,
          userName: receiverUserName,
        },
      ],
      msgs: [],
    });
    let avatarImageUrl;
    let userInfoRef = database.ref(`${currentUser.uid}/userInfo/`);
    let postData = {
      userId: receiverUserId,
      userName: receiverUserName,
      createTime: moment(new Date().getTime()).format("YYYY/MM/DD HH:mm:ss"),
      avatarUrl: avatarImageUrl ? avatarImageUrl : "",
      type: "individual",
    };
    userInfoRef.child(receiverUserId).set(postData);

    setTimeout(() => {
      newFriendIdRef.current.value = "";
      newFriendNameRef.current.value = "";
      setPickedChatRoomId("");
    }, 500);
  };

  useEffect(() => {
    if (chatRoomList && currentUser) {
      handleTidyChatRoomList();
    }
  }, [chatRoomList, currentUser]);

  const handleTidyChatRoomList = () => {
    let tempSearchList = [];
    Object.values(chatRoomList).map((chatRoomItem, chatRoomIndex) => {
      // Object.keys(chatRoomList)
      let participantsWithOutMe = chatRoomItem.participants.filter((item) => {
        return item.userId !== myUserId;
      });
      let msgsList = [];
      if (chatRoomItem.msgs) {
        Object.values(chatRoomItem.msgs).map((msgItem, msgIndex) => {
          msgsList.push(msgItem);
        });
      }
      let participantsWithOutMeModified = participantsWithOutMe.map(
        (item, index) => {
          let userInfoRef = database.ref(
            `${currentUser.uid}/userInfo/${item.userId}`
          );
          let tempUserInfo;
          userInfoRef.once("value", function (snapshot) {
            tempUserInfo = snapshot.val();
          });
          return tempUserInfo;
        }
      );


      tempSearchList.push({
        msgs: R.uniq(msgsList),
        participants: participantsWithOutMeModified,
        chatRoomId: Object.keys(chatRoomList)[chatRoomIndex],
      });
    });
    setSearchList(R.uniq(tempSearchList));
    setFilteredChatList(R.uniq(tempSearchList));
  };


  const handleStartThisChat = (chatRoomId) => {
    setNewChatShow(true);
    setPickedChatRoomId(chatRoomId);
  };

  const renderMyFriendList = () => {
    let allUserInfo = [];
    let userInfoRef = database.ref(`${currentUser.uid}/userInfo/`);
    userInfoRef.once("value", function (snapshot) {
      if (snapshot.val()) {
        allUserInfo = snapshot.val();
      } else {
        // receiverData = [];
      }
    });

    let myFriendIdList = [];
    let myFriendListRef = database.ref(
      `${currentUser.uid}/eachUserFriendList/${myUserId}/`
    );
    let receiverData = [];
    myFriendListRef.once("value", function (snapshot) {
      if (snapshot.val()) {
        myFriendIdList = snapshot.val();
      } else {
      }
    });

    const renderThisFriendInfo = (friendItem, friendIndex) => {

      let thisFriendChatroom = filteredChatList.filter((item)=>{
        return item.participants[0].userId === friendItem;
      })

      let thisFriend = allUserInfo[`${friendItem}`];
      return (
        <div
          className="each_friend"
          key={friendIndex}
          onClick={() => handleStartThisChat(thisFriendChatroom[0].chatRoomId)}
        >
          <div className="avatar">
            {thisFriend.avatarUrl ? <img className="avatar_image" src={thisFriend.avatarUrl} alt="avatar"></img> :<div className="avatar_image_div default_avatar"></div>}
          </div>
          <div className="text">{thisFriend.userName}</div>
        </div>
      );
    };

    return myFriendIdList.map((friendItem, friendIndex) => {

      return (
        <>{renderThisFriendInfo(friendItem, friendIndex)}</>
      );
    });
  };

  return (
    <Provider value={contextValue}>
      <div className={`friend_list_container`}>
        <div className="friend_list_header">
          <div className="text">Friends</div>
        </div>
        <SearchTool
          placeholderText="Search"
          inputFocusState={inputFocusState}
          setInputFocusState={setInputFocusState}
          searchList={searchList}
          filteredChatList={filteredChatList}
          setFilteredChatLisIt={setFilteredChatList}
          inputContent={inputContent}
          setInputContent={setInputContent}
        />
        <div className="friend_list">
          {renderMyFriendList()}
          <div className="friend_list_bg"></div>
          <label htmlFor="ID">
            ID
            <input
              type="text"
              onChange={(e) => setReceiverUserId(e.target.value)}
              ref={newFriendIdRef}
            ></input>
          </label>
          <label htmlFor="NAME">
            NAME
            <input
              type="text"
              onChange={(e) => setReceiverUserName(e.target.value)}
              ref={newFriendNameRef}
            ></input>
          </label>
          <button className="btn" onClick={handleAddContact}>
            新增聯絡人
          </button>
        </div>
      </div>
    </Provider>
  );
};
export default FriendList;
