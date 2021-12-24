import React, {
  useCallback,
  useState,
  useEffect,
  Fragment,
  useContext,
  useRef,
  Suspense,
  lazy
} from "react";
// import { remote, BrowserWindow, desktopCapturer } from "electron";
import "./ChatWindow.scss";
import { Provider } from "../context";
import * as R from "ramda";
import context from "../context";
import ModalTool from "./../ModalTool/ModalTool";
import ImageGallery from "../ModalContent/ImageGallery/ImageGallery";
import MessageInput from "./../MessageInput/MessageInput";
import UrlPreview from "./../UrlPreview/UrlPreview";
import UrlPreviewSkeleton from "./../UrlPreviewSkeleton/UrlPreviewSkeleton";
import moment from "moment";
// import { getStorage, ref, uploadBytesResumable } from "firebase";
import ContentLoader from "react-content-loader";

const ChatWindow = (props) => {
  const contextValue = useContext(context);

  const {
    childWindow,
    setChildWindow,
    popupWindow,
    myUserId,
    myUserName,
    setPickedList,
    notificationList,
    msgList,
    setMsgList,
    pickedChatRoomId,
    setPickedChatRoomId,
    msgAreaRef,
    chatRoomList,
    msgInput,
    setMsgInput,
    handleMsgSend,
    msgInputRef,
    replyMsgInputRef,
    inputContent,
    setInputContent,
    searchResults,
    setSearchResults,
    filteredChatList,
    setFilteredChatList,
    database,
    firebase,
    receiverUserId,
    receiverUserName,
    receiver,
    setReceiver,
    contextMenuShow,
    setContextMenuShow,
    handleReplyMsgSend,
    replyMsgTarget,
    setReplyMsgTarget,
    currentUser,
    // msgListFetchPreview,
    // setMsgListFetchPreview
  } = contextValue;
  const {} = props;

  const imageBoxListRef = useRef();

  const [floatWindowShow, setFloatWindowShow] = useState(false);
  const [videoWindowFullScreen, setVideoWindowFullScreen] = useState(false);

  const [buttonBarShow, setButtonBarShow] = useState(false);
  const [imageGalleryShow, setImageGalleryShow] = useState(false);
  const [imageGalleryUrl, setImageGalleryUrl] = useState("");
  const [imageGalleryTargetId, setImageGalleryTargetId] = useState("");

  const [whosTalking, setWhosTalking] = useState("");
  const [thisChatRoomData, setThisChatRoomData] = useState();
  const [progress, setProgress] = useState(0);
  const [rightClickTargetMsgId, setRightClickTargetMsgId] = useState("");
  const [msgSelectedText, setMsgSelectedText] = useState();
  const [msgUrlPreviewList, setMsgUrlPreviewList] = useState([]);
  const [msgListFetchPreview, setMsgListFetchPreview] = useState(msgList);


  useEffect(() => {
    if (!inputContent) {
      setSearchResults([]);
    }
  }, [inputContent]);

  useEffect(() => {
    if (inputContent && thisChatRoomData && thisChatRoomData.msgs.length) {
      let keyword = inputContent.toLowerCase();
      // setInputContent(keyword);
      let thisList;
      let matchMsgs;
      // searchList.map((element) => {
      matchMsgs = thisChatRoomData.msgs.filter((item) => {
        return (
          (item.type === "text" || item.type === "reply_text") &&
          item.content.toLowerCase().includes(keyword)
        );
      });
      // });
      // let msgIdListInThisChatRoom
      // let matchMsgsInThisChatRoom = matchMsgs.filter((item)=>{
      //   return
      // })
      let msgWithOffsetTop = matchMsgs.map((item, index) => {
        let msgRef = document.getElementById(item.msgId);
        let cc = msgRef.offsetTop;
        if (index === matchMsgs.length - 1) {
          msgAreaRef.current.scrollTo({ top: cc, behavior: "auto" });
        }
        return { ...item, offsetTop: msgRef.offsetTop };
      });
      setSearchResults(msgWithOffsetTop);
    } else {
      msgAreaRef.current.scrollTo({
        top: Number.MAX_SAFE_INTEGER,
        behavior: "auto",
      });
    }
  }, [thisChatRoomData, inputContent]);

  useEffect(() => {
    if (popupWindow && childWindow) {
      scrollDirectToBottom();
    }
  }, [popupWindow, childWindow]);

  const scrollDirectToBottom = () => {
    msgAreaRef.current.scrollTo({
      top: Number.MAX_SAFE_INTEGER,
      behavior: "auto",
    });
  };


  const handleImageGalleryShow = (msgId, imgUrl) => {
    setImageGalleryShow(true);
    setImageGalleryUrl(imgUrl);
    setImageGalleryTargetId(msgId);
  };

  const handleContextMenuShow = async (e, msgId, msgType) => {
    let selectedText = window.getSelection().toString();
    setMsgSelectedText(selectedText);
    setContextMenuShow(true);
    setRightClickTargetMsgId(msgId);
    let msgEle = document.getElementById(msgId);
    const msgEleScrollHeight = document.querySelector(".msg_area").scrollHeight;
    const msgEleOffsetTop = msgEle.offsetTop;
    msgAreaRef.current.scrollTo({ top: msgEleOffsetTop, behavior: "smooth" });

    let targetContent;
    targetContent = msgEle.querySelector(".msg_box_area .msg_box")
      ? msgEle.querySelector(".msg_box_area .msg_box")
      : msgEle.querySelector(".msg_box_area .reply_msg_box")
      ? msgEle.querySelector(".msg_box_area .reply_msg_box")
      : msgEle.querySelector(".msg_box_area .msg_image");

    switch (msgType) {
      case "text":
        targetContent = msgEle.querySelector(".msg_box_area .msg_box");
        break;
      case "image":
        targetContent = msgEle.querySelector(".msg_box_area .msg_image");
        break;
      case "video":
        targetContent = msgEle.querySelector(".msg_box_area .msg_video");
        break;
      case "reply_text":
        targetContent = msgEle.querySelector(".msg_box_area .reply_msg_box");
        break;
      case "reply_image":
        targetContent = msgEle.querySelector(".msg_box_area .reply_msg_box");
        break;
      case "reply_video":
        targetContent = msgEle.querySelector(".msg_box_area .reply_msg_box");
        break;
      default:
    }

    if (targetContent) {
      setTimeout(() => {
        let targetContentLastChild =
          targetContent.childNodes[targetContent.childNodes.length - 1];
        if (msgEleScrollHeight - msgEleOffsetTop < 160) {
          targetContentLastChild.style.top = "unset";
          targetContentLastChild.style.bottom = "0";
        }
      }, 0);
    }


  };
  const renderAvatar = (senderUserId) => {
    let userInfoRef = database.ref(
      `${currentUser.uid}/userInfo/${senderUserId}`
    );
    let tempUserInfo;
    userInfoRef.once("value", function (snapshot) {
      tempUserInfo = snapshot.val();
    });
    return (
      <img
        className="sender_avatar"
        src={tempUserInfo.avatarUrl}
        alt="avatar"
      ></img>
    );
  };
  const handleMouseUp = () => {
    let text = window.getSelection().toString();
  };
  const renderPreviewSkeleton = (targetUrl) => {
    return (
      <div className="preview_skeleton_container">
      {targetUrl.map((item, index) => {
        return (
          <div className="preview_skeleton_container" key={index}>
            <div className="preview_skeleton_image"></div>
            <div className="preview_skeleton_content">
              <div className="preview_skeleton_title"></div>
              <div className="preview_skeleton_desc"></div>
            </div>
          </div>
        );
      })}
    </div>
  );
  };


  const renderMsgList = (msgList, thisChatRoom) => {

    const renderMsgType = (msgItem, type) => {
      switch (type) {
        case "text":
          let patternTest =
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
          let targetUrl = msgItem.content.match(patternTest);
          let previewItem = msgItem.metaData ? msgItem.metaData : null;
          return (
            <div className="msg_box">
              <div className="msg_text">{msgItem.content}</div>
              <div
                className={`link_preview_area ${
                  targetUrl && targetUrl.length ? "url_show" : ""
                }`}
              >
              {targetUrl && targetUrl.length && previewItem && previewItem.length ? (
                <Suspense fallback={renderPreviewSkeleton(targetUrl)} delay={5000}>
                                  <UrlPreview previewItem={previewItem}/>
                                  
                </Suspense>
              ):null}
              </div>

              {contextMenuShow && rightClickTargetMsgId === msgItem.msgId ? (
                <Fragment>
                  <div
                    className="context_menu_background"
                    onClick={(e) => {
                      // handleClickToggleBg(e);
                      setContextMenuShow(false);
                    }}
                  ></div>
                  <div className="context_menu">
                    <div
                      className="right_btn copy_btn"
                      onClick={() => handleCopyMsg(msgItem)}
                      onMouseUp={() => handleMouseUp()}
                    >
                      複製
                    </div>
                    <div className="right_btn edit_btn">編輯</div>
                    <div
                      className="right_btn reply_btn"
                      onClick={() => handleReplyMsg(msgItem)}
                    >
                      回覆
                    </div>
                    <div className="right_btn forward_btn">轉發</div>
                    <div
                      className="right_btn delete_btn"
                      onClick={() => handleDeleteMsg(msgItem)}
                    >
                      刪除
                    </div>
                  </div>
                </Fragment>
              ) : null}
            </div>
          );
          break;
        case "image":
          return (
            <div
              className="msg_image"
              // onContextMenu={(e) => handleContextMenuShow(e)}
            >
              {/* <div className="img" style={{backgroundImage:`url(${msgItem.url})`}} onClick={() => handleImageGalleryShow(msgItem.msgId)}/> */}
              <img
                src={msgItem.url}
                alt="image"
                onClick={() =>
                  handleImageGalleryShow(msgItem.msgId, msgItem.url)
                }
              />
              {contextMenuShow && rightClickTargetMsgId === msgItem.msgId ? (
                <Fragment>
                  <div
                    className="context_menu_background"
                    onClick={(e) => {
                      // handleClickToggleBg(e);
                      setContextMenuShow(false);
                    }}
                  ></div>
                  <div className="context_menu">
                    <div
                      className="right_btn reply_btn"
                      onClick={() => handleReplyMsg(msgItem)}
                    >
                      回覆
                    </div>
                    <div className="right_btn forward_btn">轉發</div>
                    <div
                      className="right_btn delete_btn"
                      onClick={() => handleDeleteMsg(msgItem)}
                    >
                      刪除
                    </div>
                  </div>
                </Fragment>
              ) : null}
            </div>
          );
          break;
        case "video":
          return (
            <div
              className="msg_video"
              // onContextMenu={(e) => handleContextMenuShow(e)}
            >
              {/* <div className="img" style={{backgroundImage:`url(${msgItem.url})`}} onClick={() => handleImageGalleryShow(msgItem.msgId)}/> */}
              <video
                src={msgItem.url + "#t=0.5"}
                alt="video"
                // autoPlay
                controls
                preload="metadata"
                type="video/mp4"
                // onClick={() => handleImageGalleryShow(msgItem.msgId)}
              />
              {contextMenuShow && rightClickTargetMsgId === msgItem.msgId ? (
                <Fragment>
                  <div
                    className="context_menu_background"
                    onClick={(e) => {
                      // handleClickToggleBg(e);
                      setContextMenuShow(false);
                    }}
                  ></div>
                  <div className="context_menu">
                    <div
                      className="right_btn reply_btn"
                      onClick={() => handleReplyMsg(msgItem)}
                    >
                      回覆
                    </div>
                    <div className="right_btn forward_btn">轉發</div>
                    <div
                      className="right_btn delete_btn"
                      onClick={() => handleDeleteMsg(msgItem)}
                    >
                      刪除
                    </div>
                  </div>
                </Fragment>
              ) : null}
            </div>
          );
          break;
        case "reply_text":
          return (
            <div className="reply_msg_box">
              <div className="reply_msg">
                <div className="reply_msg_sender_name">
                  {msgItem.replyMsgTarget.senderUserName}
                </div>
                <div className="reply_msg_text">
                  {msgItem.replyMsgTarget.content}
                </div>
              </div>
              <div className="msg_text">{msgItem.content}</div>
              {contextMenuShow && rightClickTargetMsgId === msgItem.msgId ? (
                <Fragment>
                  <div
                    className="context_menu_background"
                    onClick={(e) => {
                      // handleClickToggleBg(e);
                      setContextMenuShow(false);
                    }}
                  ></div>
                  <div className="context_menu">
                    <div
                      className="right_btn copy_btn"
                      onClick={() => handleCopyMsg(msgItem)}
                    >
                      複製
                    </div>
                    <div className="right_btn edit_btn">編輯</div>
                    <div
                      className="right_btn reply_btn"
                      onClick={() => handleReplyMsg(msgItem)}
                    >
                      回覆
                    </div>
                    <div className="right_btn forward_btn">轉發</div>
                    <div
                      className="right_btn delete_btn"
                      onClick={() => handleDeleteMsg(msgItem)}
                    >
                      刪除
                    </div>
                  </div>
                </Fragment>
              ) : null}
            </div>
          );
          break;
        case "reply_image":
          return (
            <div className="reply_msg_image">
              <div className="reply_msg">
                <img
                  src={msgItem.replyMsgTarget.url}
                  alt="image"
                  // onClick={() =>}
                />
                <div className="reply_content">
                  <div className="reply_msg_sender_name">
                    {msgItem.replyMsgTarget.senderUserName}
                  </div>
                  <div className="msg_type">image</div>
                </div>
              </div>
              <div className="msg_text">{msgItem.content}</div>

              {contextMenuShow && rightClickTargetMsgId === msgItem.msgId ? (
                <Fragment>
                  <div
                    className="context_menu_background"
                    onClick={(e) => {
                      // handleClickToggleBg(e);
                      setContextMenuShow(false);
                    }}
                  ></div>
                  <div className="context_menu">
                    <div
                      className="right_btn copy_btn"
                      onClick={() => handleCopyMsg(msgItem)}
                    >
                      複製
                    </div>
                    <div className="right_btn edit_btn">編輯</div>
                    <div
                      className="right_btn reply_btn"
                      onClick={() => handleReplyMsg(msgItem)}
                    >
                      回覆
                    </div>
                    <div className="right_btn forward_btn">轉發</div>
                    <div
                      className="right_btn delete_btn"
                      onClick={() => handleDeleteMsg(msgItem)}
                    >
                      刪除
                    </div>
                  </div>
                </Fragment>
              ) : null}
            </div>
          );
          break;
        case "reply_video":
          return (
            <div className="reply_msg_video">
              <div className="reply_msg">
                <video
                  src={msgItem.replyMsgTarget.url + "#t=0.5"}
                  alt="video"
                  // controls
                  preload="metadata"
                  type="video/mp4"
                />
                <div className="reply_content">
                  <div className="reply_msg_sender_name">
                    {msgItem.replyMsgTarget.senderUserName}
                  </div>
                  <div className="msg_type">video</div>
                </div>
              </div>
              <div className="msg_text">{msgItem.content}</div>

              {contextMenuShow && rightClickTargetMsgId === msgItem.msgId ? (
                <Fragment>
                  <div
                    className="context_menu_background"
                    onClick={(e) => {
                      // handleClickToggleBg(e);
                      setContextMenuShow(false);
                    }}
                  ></div>
                  <div className="context_menu">
                    <div
                      className="right_btn copy_btn"
                      onClick={() => handleCopyMsg(msgItem)}
                    >
                      複製
                    </div>
                    <div className="right_btn edit_btn">編輯</div>
                    <div
                      className="right_btn reply_btn"
                      onClick={() => handleReplyMsg(msgItem)}
                    >
                      回覆
                    </div>
                    <div className="right_btn forward_btn">轉發</div>
                    <div
                      className="right_btn delete_btn"
                      onClick={() => handleDeleteMsg(msgItem)}
                    >
                      刪除
                    </div>
                  </div>
                </Fragment>
              ) : null}
            </div>
          );
          break;
        default:
      }
    };
    if (msgList.length) {
      return msgList.map((msgItem, msgIndex) => {
        if (msgItem.senderUserId === myUserId) {
          return (
            <div
              className={`each_msg mine ${
                msgItem.type === "image" ? "image_index" : ""
              }`}
              key={msgIndex}
              id={msgItem.msgId}
              onContextMenu={(e) =>
                handleContextMenuShow(e, msgItem.msgId, msgItem.type)
              }
            >
              <div className="msg_box_area">
                {/* <div className="msg_box"> */}
                {renderMsgType(msgItem, msgItem.type)}
                {/* </div> */}
                <div className="msg_timestamp">{msgItem.createTime}</div>
              </div>
              <div className="avatar_area"></div>
            </div>
          );
        } else {
          return (
            <div
              className={`each_msg others ${
                msgItem.type === "image" ? "image_index" : ""
              }`}
              key={msgIndex}
              id={msgItem.msgId}
              onContextMenu={(e) =>
                handleContextMenuShow(e, msgItem.msgId, msgItem.type)
              }
            >
              <div className="avatar_area">
                {renderAvatar(msgItem.senderUserId)}
              </div>
              <div className="msg_box_area">
                {/* <div className="msg_box">
                  <div className="msg_text">{msgItem.content}</div>
                </div> */}
                {renderMsgType(msgItem, msgItem.type)}
                <div className="msg_timestamp">{msgItem.createTime}</div>
              </div>
            </div>
          );
        }
      });
    } else {
      return (
        <div className="no_chatting">
          <div className="title"></div>
          {/* <div className="desc">歡迎立即使用</div> */}
        </div>
      );
    }
  };


  useEffect(() => {
    if (pickedChatRoomId) {
      handlePickedChatRoomInfo();
    }
  }, [pickedChatRoomId]);

  const handlePickedChatRoomInfo = () => {
    let thisChatRoom = filteredChatList.filter((item) => {
      return item.chatRoomId === pickedChatRoomId;
    });
    setThisChatRoomData(thisChatRoom[0]);

    let withoutMe;
    if (thisChatRoom.length && thisChatRoom[0].participants) {
      withoutMe = thisChatRoom[0].participants.filter((item) => {
        return item.userId !== myUserId;
      });
      setWhosTalking(withoutMe[0]);
    } else {
      withoutMe = [];
      setWhosTalking({});
    }
  };

  const handleScrollToCurrentMsg = (offsetTop) => {
    msgAreaRef.current.scrollTo({ top: offsetTop, behavior: "smooth" });
  };

  useEffect(() => {
    let progressBar = document.querySelector("#js-progressBar");
    if (progress === 100) {
      progressBar.style.display = "none";
      setTimeout(() => {
        msgAreaRef.current.scrollTo({
          top: Number.MAX_SAFE_INTEGER,
          behavior: "smooth",
        });
      }, 5000);
    }
  }, [progress]);
  const handleSendFile = (e) => {};
  const handleSendImage = (e) => {

    /** @type {any} */
    const metadata = {
      contentType: "image/jpeg",
    };
    let chatroomMsgRef = database.ref(
      `${currentUser.uid}/chatroom/${pickedChatRoomId}/msgs/`
    );
    const storageRef = firebase.storage().ref("/images/");
    let progressBar = document.querySelector("#js-progressBar");
    const file = e.target.files[0];
    const uploadTask = storageRef.child(file.name).put(file, metadata);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        progressBar.style.display = "block";
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        setProgress(progress);

        switch (snapshot.state) {
          case "paused":
            break;
          case "running":
            break;
        }
      },
      (error) => {
        switch (error.code) {
          case "storage/unauthorized":
            break;
          case "storage/canceled":
            break;

          // ...

          case "storage/unknown":
            break;
        }
      },
      () => {
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          let key =
            new Date().getTime() + Math.random().toString(36).substring(2);
          let postData = {
            msgId: key,
            senderUserId: myUserId,
            senderUserName: myUserName,
            createTime: moment(new Date().getTime()).format(
              "YYYY/MM/DD HH:mm:ss"
            ),
            receiverUserId: receiver.length
              ? receiver[0].userId
              : receiverUserId,
            receiverUserName: receiver.length
              ? receiver[0].userName
              : receiverUserName,
            type: "image",
            url: downloadURL,
          };
          chatroomMsgRef.child(key).set(postData);
        });
      }
    );
  };
  const handleSendVideo = (e) => {

    /** @type {any} */
    const metadata = {
      contentType: "video/mp4",
    };
    let chatroomMsgRef = database.ref(
      `${currentUser.uid}/chatroom/${pickedChatRoomId}/msgs/`
    );
    const videoStorageRef = firebase.storage().ref("/videos/");
    let progressBar = document.querySelector("#js-progressBar");
    const file = e.target.files[0];
    const uploadTask = videoStorageRef.child(file.name).put(file, metadata);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        progressBar.style.display = "block";
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        setProgress(progress);

        switch (snapshot.state) {
          case "paused":
            break;
          case "running":
            break;
        }
      },
      (error) => {
        switch (error.code) {
          case "storage/unauthorized":
            break;
          case "storage/canceled":
            break;

          case "storage/unknown":
            break;
        }
      },
      () => {
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          let key =
            new Date().getTime() + Math.random().toString(36).substring(2);
          let postData = {
            msgId: key,
            senderUserId: myUserId,
            senderUserName: myUserName,
            createTime: moment(new Date().getTime()).format(
              "YYYY/MM/DD HH:mm:ss"
            ),
            receiverUserId: receiver.length
              ? receiver[0].userId
              : receiverUserId,
            receiverUserName: receiver.length
              ? receiver[0].userName
              : receiverUserName,
            type: "video",
            url: downloadURL,
          };
          chatroomMsgRef.child(key).set(postData);
        });
      }
    );
  };


  const handleReplyMsg = (targetMsg) => {
    setReplyMsgTarget(targetMsg);
    setContextMenuShow(false);
  };

  const handleCopyMsg = (targetMsg) => {

    navigator.clipboard
      .writeText(msgSelectedText ? msgSelectedText : targetMsg.content)
      .then(
        () =>
        setMsgSelectedText(""),
        setContextMenuShow(false),

        (err) => console.log("複製失敗", err),
        setContextMenuShow(false)
      );
  };

  const handleDeleteMsg = (msgItem) => {
    let chatroomMsgRef = database.ref(
      `${currentUser.uid}/chatroom/${pickedChatRoomId}/msgs/`
    );
    const message = chatroomMsgRef.child(msgItem.msgId);
    message.remove();
    setContextMenuShow(false);
  };

  useEffect(() => {
    let chatroomMsgRef = database.ref(
      `${currentUser.uid}/chatroom/${pickedChatRoomId}/msgs/`
    );
    let tempMsgList = [...msgList];
    if (msgList.length > 1) {
      chatroomMsgRef.on("child_removed", function (snapshot) {
        var player = snapshot.val();
        let removedList = tempMsgList.filter((item, index) => {
          return item.msgId !== player.msgId;
        });

        setMsgList(R.uniq(removedList));
      });
    }
  }, [contextMenuShow]);

  const msgInputValue = {
    floatWindowShow,
    setFloatWindowShow,
    videoWindowFullScreen,
    msgInput,
    setMsgInput,
    handleMsgSend,
    msgInputRef,
    replyMsgInputRef,
    handleSendImage,
    handleSendFile,
    handleSendVideo,
    replyMsgTarget,
    setReplyMsgTarget,
    handleReplyMsgSend,
  };

  return (
    <div className={`chat_window_container`}>
      <Provider value={msgInputValue}>
        <div className={`chat_window`}>
          <div className="header_area">
            {whosTalking ? whosTalking.userName : "noName"}
          </div>
          <div className="search_nav_area">
            {searchResults
              ? searchResults.map((item, index) => {
                  return (
                    <div
                      className="each_search_result"
                      key={index}
                      onClick={() => handleScrollToCurrentMsg(item.offsetTop)}
                    >
                      {item.content}
                    </div>
                  );
                })
              : null}
          </div>
          <div className="msg_area" ref={msgAreaRef}>
            {renderMsgList(msgList, thisChatRoomData)}
          </div>
          <div className="messageBox messageBox--self">
            <div className="messageBox__progress">
              <div
                id="js-progressBar"
                className="messageBox__progress--state"
                style={{ width: progress + "%" }}
              ></div>
            </div>
          </div>
          <MessageInput />
        </div>
        {imageGalleryShow ? (
          <ModalTool
            modalShow={imageGalleryShow}
            modalCloseFunction={() => setImageGalleryShow(false)}
            // modalWidth={400}
            // modalHeight={220}
            backgroundOpacity={0.8}
          >
            <ImageGallery
              closeModal={() => setImageGalleryShow(false)}
              imageGalleryUrl={imageGalleryUrl}
              msgList={msgList}
              imageGalleryTargetId={imageGalleryTargetId}
              setImageGalleryTargetId={setImageGalleryTargetId}
              imageBoxListRef={imageBoxListRef}
            />
          </ModalTool>
        ) : null}
      </Provider>
    </div>
  );
};
export default ChatWindow;
