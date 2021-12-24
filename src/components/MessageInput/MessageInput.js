import React, {
  useCallback,
  useState,
  useEffect,
  Fragment,
  useContext,
} from "react";
// import MediaStream from "../MediaStream/MediaStream";
import "./MessageInput.scss";
import { Provider } from "../context";
import Draggable from "react-draggable";
import context from "../context";
import TextareaAutosize from "react-textarea-autosize";
import * as R from "ramda";

const MessageInput = () => {
  const contextValue = useContext(context);
  const {
    msgInputRef,
    replyMsgInputRef,
    msgInput,
    setMsgInput,
    handleMsgSend,
    handleSendImage,
    handleSendFile,
    handleSendVideo,
    replyMsgTarget,
    setReplyMsgTarget,
    handleReplyMsgSend,
  } = contextValue;
  const [textAreaHeight, setTextAreaHeight] = useState();
  const handleDetectTextAreaHeight = (e) => {
    setTextAreaHeight(e);
  };

  const handlePressEnter = (e) => {
    if (e.charCode === 13 && e.shiftKey === false && !e.target.value.trim()) {
      e.preventDefault();
      return;
    } else if (!e.target.value.trim() || e.charCode !== 13) {
      // e.preventDefault();
    } else {
      if (e.shiftKey === false) {
        if (!replyMsgTarget) {
          handleMsgSend();
          e.preventDefault();
        } else {
          handleReplyMsgSend();
          e.preventDefault();
        }
      }
    }
  };

  const renderReplyMsgTarget = () => {
    switch (replyMsgTarget.type) {
      case "text":
      case "reply_text":
      case "reply_image":
      case "reply_video":
        return (
          <>
            <div className="reply_msg">
              <div className="reply_msg_sender_name">
                {replyMsgTarget.senderUserName}
              </div>
              <div className="reply_msg_text">{replyMsgTarget.content}</div>
            </div>
            <div
              className="reply_msg_close_btn"
              onClick={() => setReplyMsgTarget(null)}
            ></div>
          </>
        );
        break;
      case "image":
        return (
          <>
            <div className="reply_msg">
              <div className="reply_msg_sender_name">
                {replyMsgTarget.senderUserName}
              </div>
              <div className="reply_msg_text">圖片</div>
            </div>
            <img
              className="reply_msg_thumbnail"
              src={replyMsgTarget.url}
              alt="image"
            ></img>
            <div
              className="reply_msg_close_btn"
              onClick={() => setReplyMsgTarget(null)}
            ></div>
          </>
        );
        break;
      case "video":
        return (
          <>
            <div className="reply_msg">
              <div className="reply_msg_sender_name">
                {replyMsgTarget.senderUserName}
              </div>
              <div className="reply_msg_text">影片</div>
            </div>
            <video
              src={replyMsgTarget.url + "#t=0.5"}
              className="reply_msg_video_thumbnail"
              alt="video"
              // autoPlay
              // controls
              preload="metadata"
              type="video/mp4"
            />
            <div
              className="reply_msg_close_btn"
              onClick={() => setReplyMsgTarget()}
            ></div>
          </>
        );
        break;
        default:
        ;
    }
  };

  useEffect(() => {
    if (replyMsgTarget) {
    }
  }, [replyMsgTarget]);
  return (
    <div className={`message_input_container`}>
      <Provider value={contextValue}>

        <div className="message_input">
          {replyMsgTarget ? (
            <div className="reply_message" ref={replyMsgInputRef}>
              <div className="reply_icon"></div>
              {renderReplyMsgTarget()}
            </div>
          ) : null}

          <TextareaAutosize
            id="messageInput"
            // value={msgInput}
            className="msg_input"
            onKeyPress={(e) => handlePressEnter(e)}
            // // onInput={e => canisend && handleChange(e)}
            // onInput={(e) => handleChange(e)}
            // onChange={e => setInputValue(e.target.value)}
            onChange={(e) => setMsgInput(e.target.value)}
            placeholder="輸入訊息"
            // onPaste={handleInputPaste}
            // disabled={!canisend}
            minRows={1}
            maxRows={10}
            spellCheck={false}
            autoFocus={true}
            onHeightChange={(e) => handleDetectTextAreaHeight(e)}
            ref={msgInputRef}
          />
          <div
            className={`send_btn ${
              msgInputRef.current
                ? msgInputRef.current.value
                  ? ""
                  : "disable"
                : null
            }`}
            onClick={() =>
              !replyMsgTarget ? handleMsgSend() : handleReplyMsgSend()
            }
          >
            <div className="icon icon_send"></div>
          </div>
          <div className="tools_upload">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleSendImage(e)}
            />
          </div>
          <div className="video_upload">
            <input
              type="file"
              accept="video/*"
              onChange={(e) => handleSendVideo(e)}
            />
          </div>
        </div>
      </Provider>
    </div>
  );
};
export default MessageInput;
