import React, {
  useCallback,
  useState,
  useEffect,
  Fragment,
  useContext,
  Suspense,
} from "react";
import "./Setting.scss";
import { Provider } from "../context";
import * as R from "ramda";
import moment from "moment";
import context from "../context";
import ContentLoader from "react-content-loader";

const Setting = (props) => {
  const contextValue = useContext(context);
  const {
    database,
    firebase,
    myUserId,
    setMyUserId,
    myUserName,
    setMyUserName,
    myUserInfo,
    setMyUserInfo,
    currentUser,
    setUserInfoSettingShow
  } = contextValue;
  const { closeModal } = props;
  const [avatarProgress, setAvatarProgress] = useState();
  const [avatarImageUrl, setAvatarImageUrl] = useState(myUserInfo.avatarUrl);
  const [userNameEditing, setUserNameEditing] = useState(false);

  const handleUpdateAvatar = (e) => {

    /** @type {any} */
    const metadata = {
      contentType: "image/jpeg",
    };
    const storageRef = firebase.storage().ref("/images/");
    const file = e.target.files[0];
    const uploadTask = storageRef.child(file.name).put(file, metadata);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        setAvatarProgress(progress);

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
          setAvatarImageUrl(downloadURL);
        });
      }
    );
  };

  const handleUpdateMyUserInfo = () => {
    let userInfoRef = database.ref(`${currentUser.uid}/userInfo/`);
    let postData = {
      userId: myUserId,
      userName: myUserName,
      createTime: moment(new Date().getTime()).format("YYYY/MM/DD HH:mm:ss"),
      avatarUrl: avatarImageUrl,
      type: "individual",
    };
    userInfoRef.child(myUserId).set(postData);
    setUserInfoSettingShow(false);
  };

  const DelayedLoading = (avatarUrl) => {
    const [ready, setReady] = useState(false);
    useEffect(() => {
      setTimeout(() => setReady(true), 2000);
    }, []);
    if (!ready) {
      return <div className="loading_circle"></div>;
    } else {
      return (
        <img
          className="avatar"
          id="myAvatarImage"
          src={avatarImageUrl}
          alt="avatar"
        />
      );
    }
  };


  useEffect(() => {

  }, [avatarImageUrl]);

  return (
    <div className={`setting_container`}>
      <Provider value={contextValue}>
        <div className="setting">
          <div className="close_btn" onClick={closeModal}></div>
          {/* <div className="img"></div> */}
          <div className="text">Setting</div>
          {myUserInfo ? (
            <div className="user_info">
              <div className="user_avatar">
                {avatarImageUrl ? (
                  <DelayedLoading avatarUrl={avatarImageUrl} />

                ) : (
                  <div className="avatar_default"></div>
                )}
                <div className="tools_upload">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleUpdateAvatar(e)}
                  />
                  <div className="icon icon_img"></div>
                </div>
              </div>

              <div className="user_id">{myUserInfo.userId}</div>
              {userNameEditing ? (
                  <div className="user_name_edit">
                    <input
                      className="user_name_edit_input"
                      type="text"
                      value={myUserName}
                      onChange={(e) => setMyUserName(e.target.value)}
                    ></input>
                    <div className="icon icon_check" onClick={()=>setUserNameEditing(false)}></div>
                    </div>
              ):(
                <div className="user_name">{myUserInfo.userName}
                  <div className="icon icon_edit" onClick={()=>setUserNameEditing(true)}></div>
                </div>
                )}


            </div>
          ) : null}

          {/* <div className="messageBox messageBox--self">
            <div className="messageBox__progress">
              <div
                id="avatarProgressBar"
                className="messageBox__progress--state"
                style={{ width: avatarProgress + "%" }}
              ></div>
            </div>
          </div> */}
          <div className="btn" onClick={handleUpdateMyUserInfo}>
            確認修改
          </div>
        </div>
      </Provider>
    </div>
  );
};
export default Setting;
