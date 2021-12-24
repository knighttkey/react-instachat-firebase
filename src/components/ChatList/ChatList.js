import React, {
  useCallback,
  useState,
  useEffect,
  Fragment,
  useContext,
  useRef,
} from "react";
import "./ChatList.scss";
import { Provider } from "../context";
import * as R from "ramda";
import context from "../context";
import SearchTool from "./../SearchTool/SearchTool";

const ChatList = () => {
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
    myUserId,
    myUserName,
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
    currentUser,
  } = contextValue;

  const [searchList, setSearchList] = useState([]);
  const [inputFocusState, setInputFocusState] = useState(false);


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
  const renderChatList = () => {
    if (filteredChatList.length) {
      return filteredChatList.map((chatRoomItem, chatRoomIndex) => {
        let thisTalks;
        let lastTalk;
        let isMyChat;
        let aarrr = [];
        if (chatRoomItem.msgs) {
          thisTalks = chatRoomItem.msgs;
          if (thisTalks.length) {
            if (inputContent) {
              let matchMsgs = thisTalks.filter((item) => {
                return (
                  (item.type === "text" ||
                    item.type === "reply_text" ||
                    item.type === "reply_image" ||
                    item.type === "reply_video") &&
                  item.content.toLowerCase().includes(inputContent)
                );
              });
              if (matchMsgs.length) {
                lastTalk = matchMsgs[matchMsgs.length - 1].content;
              } else {
                lastTalk = "";
              }
            } else {
              if (thisTalks[thisTalks.length - 1].type === "text") {
                lastTalk = thisTalks[thisTalks.length - 1].content;
              } else if (thisTalks[thisTalks.length - 1].type === "image") {
                lastTalk = "圖片";
              } else if (thisTalks[thisTalks.length - 1].type === "video") {
                lastTalk = "影片";
              } else if (
                thisTalks[thisTalks.length - 1].type === "reply_text" ||
                thisTalks[thisTalks.length - 1].type === "reply_image" ||
                thisTalks[thisTalks.length - 1].type === "reply_video"
              ) {
                lastTalk = thisTalks[thisTalks.length - 1].content;
              }
            }
          }
        } else {
          lastTalk = "";
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
        if (lastTalk && chatRoomItem.participants.length < 2 && chatRoomItem.participants.length > 0) {
          return (
            <div
              className={`each_chatroom ${
                chatRoomItem.chatRoomId === pickedChatRoomId ? "current" : ""
              }`}
              key={chatRoomIndex}
              onClick={() => handleStartThisChat(chatRoomItem.chatRoomId)}
            >
              {/* {((new Date().getTime() - chatRoomItem.createdTime < 10*60*1000) && (new Date().getTime() - chatRoomItem.createdTime) > 0) ?
                (<div className="new_chatroom_notice">NEW</div>)
              : null} */}
              <div className="avatar_area">
                {chatRoomItem.participants[0].avatarUrl ? (
                  <img
                    className="avatar_image"
                    src={chatRoomItem.participants[0].avatarUrl}
                    alt="avatar"
                  ></img>
                ) : (
                  <div className="avatar_area_default"></div>
                )}
              </div>
              <div className="content_area">
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
                <div className="desc">{lastTalk ? lastTalk : "開啟新對話"}</div>
              </div>
            </div>
          );
        } else {
          // return (
          //   <div className="each_chatroom" key={chatRoomIndex}>no content</div>
          // )
        }
      });
    } else {
      return (
        <div className="no_chat">
          {/* <div className="no_chat_bg"></div> */}
          <div className="title">Select a chat to start</div>
          {/* <div className="desc">歡迎立即使用</div> */}
        </div>
      );
    }
  };
  const roomValue = { pickedList };
  return (
    <Provider value={contextValue}>
      <div className={`chat_list_container`}>
        <div className="chat_list_header">
          <div className="text">Chatroom</div>
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
        <div className="chat_list">{renderChatList()}</div>

        {/* <MessageInput/> */}
        {/* <input type="text" className="msg_input" spellCheck={false} onChange={(e)=>setMsgInput(e.target.value)} ref={msgInputRef}/>
        <button onClick={handleMsgSend}>傳送</button> */}
      </div>
    </Provider>
  );
};
export default ChatList;
