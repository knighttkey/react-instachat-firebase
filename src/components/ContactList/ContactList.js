import React, {
  useCallback,
  useState,
  useEffect,
  Fragment,
  useContext,
  useRef,
} from "react";
import "./ContactList.scss";
import { Provider } from "../context";
import * as R from "ramda";
import context from "../context";
import SearchTool from "./../SearchTool/SearchTool";
import moment from "moment";

const ContactList = () => {
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
    currentUser
  } = contextValue;

  const [searchList, setSearchList] = useState([]);
  const [inputFocusState, setInputFocusState] = useState(false);

  const newFriendIdRef = useRef();
  const newFriendNameRef = useRef();


  const handleCreateChatRoomId = () => {
      let chatRoomIdGenerator = Math.random().toString(36).substring(2);
      return chatRoomIdGenerator;
  };

const handleAddContact = () => {
      let chatRoomIdGenerator = Math.random().toString(36).substring(2);
      // let timestamp = Math.floor(Date.now() / 1000);
      // let key = new Date().getTime() + Math.random().toString(36).substring(2);
      // // let key = Math.random().toString(36).substring(8);
      let chatroomRef = database.ref(`${currentUser.uid}/chatroom/${chatRoomIdGenerator}/`);
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
        msgs : []
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
        setPickedChatRoomId("")
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
      let participantsWithOutMeModified = participantsWithOutMe.map((item,index)=>{
        let userInfoRef = database.ref(`${currentUser.uid}/userInfo/${item.userId}`);
        let tempUserInfo;
        userInfoRef.once("value", function (snapshot) {
          tempUserInfo = snapshot.val();
        });
        return tempUserInfo;
      })


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
  const renderFriendList = () => {
    if (filteredChatList.length) {
      return filteredChatList.map((chatRoomItem, chatRoomIndex) => {

        let thisTalkUsers;
        let matchTalkUsers = [];
        if(chatRoomItem.participants) {
          thisTalkUsers = chatRoomItem.participants;
          // if(thisTalkUsers.length) {
            if (inputContent) {
              matchTalkUsers = thisTalkUsers.filter((item)=>{
                return item.userName.toLowerCase().includes(inputContent);
              })
            } else {
              matchTalkUsers = filteredChatList;
            }
          // }

        }
        let participantsNameList = [];
        let participantsNameListUniq = [];
        if (chatRoomItem.participants) {
          chatRoomItem.participants.map((item, index) => {
            participantsNameList.push(item.userName);
          });
          participantsNameListUniq = R.uniq(participantsNameList);
        } else {
        }
        if(matchTalkUsers.length && chatRoomItem.participants.length < 2 && chatRoomItem.participants.length > 0 ) {
          return (
            <div
              className="each_contact"
              key={chatRoomIndex}
              onClick={() => handleStartThisChat(chatRoomItem.chatRoomId)}
            >
              {/* {((new Date().getTime() - chatRoomItem.createdTime < 10*60*1000) && (new Date().getTime() - chatRoomItem.createdTime) > 0) ?
                (<div className="new_chatroom_notice">NEW</div>)
              : null} */}
              <div className="avatar">
                {chatRoomItem.participants[0].avatarUrl ? <img className="avatar_image" src={chatRoomItem.participants[0].avatarUrl} alt="avatar"></img> :<div className="avatar_image_div default_avatar"></div>}
              </div>
              <div className="text">
                {/* {chatRoomItem.key} */}
                {/* {withoutMe.length ? withoutMe[0].userName : null} */}
  
                {participantsNameListUniq.map((item, index) => {
                  if (participantsNameListUniq.length > 1) {
                    if (index === participantsNameListUniq.length - 1) {
                      return item;
                    } else {
                      return item + ",";
                    }
                  } else {
                    return item;
                  }
                })}
              </div>
            </div>
          );

        }
      });
    } else {
      return (
        <div className="no_friend">
          {/* <div className="no_meeting_bg"></div> */}
          <div className="title">Select a friend to start</div>
          {/* <div className="desc">歡迎立即使用</div> */}
        </div>
      );
    }
  };

  return (
    <Provider value={contextValue}>
      <div className={`contact_list_container`}>
        <div className="contact_list_header">
          <div className="text">Contacts</div>
        </div>
        <SearchTool
          placeholderText="Search"
          inputFocusState={inputFocusState}
          setInputFocusState={setInputFocusState}
          searchList={searchList}
          filteredChatList={filteredChatList}
          setFilteredChatList={setFilteredChatList}
          inputContent={inputContent}
          setInputContent={setInputContent}
        />
        <div className="contact_list">
          {renderFriendList()}
          <div className="contact_list_bg"></div>
          <label htmlFor="ID">
            ID<input type="text" onChange={(e)=>setReceiverUserId(e.target.value)} ref={newFriendIdRef}></input>
          </label>
          <label htmlFor="NAME">
           NAME<input type="text" onChange={(e)=>setReceiverUserName(e.target.value)} ref={newFriendNameRef}></input>
          </label>
          <button className="btn" onClick={handleAddContact}>新增聯絡人</button>
        </div>

      </div>
    </Provider>
  );
};
export default ContactList;
