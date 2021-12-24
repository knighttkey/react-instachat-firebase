import React, {
  useCallback,
  useState,
  useEffect,
  Fragment,
  useContext,
} from "react";
import "./LoginIndex.scss";
import { Provider } from "../context";
import * as R from "ramda";
import context from "../context";

const LoginIndex = () => {
  const contextValue = useContext(context);
  const {
    electronStorage,
    handleCloseApp,
    myUserId,
    setMyUserId,
    loginState,
    setLoginState
  } = contextValue;

  const [tempUserId, setTempUserId] = useState("0033");

  const handleLogin = () => {
    setLoginState(1)
    setMyUserId(tempUserId);
  }

  return (
    <div className={`login_index_container`}>
    {/* <div className="loading_circle"></div> */}
      <Provider value={contextValue}>
        <div className="login_index">
          {/* <div className="img"></div> */}
          {/* <div className="text"></div> */}

          <div className="input_area">
            <div className="text"></div>
            <input
              className="input account_id"
              type="text"
              spellCheck={false}
              value={tempUserId}
              onChange={(event) => setTempUserId(event.target.value)}
              placeholder="請輸入ID"
              maxLength="4"
            />
          </div>
            <div className="btn" onClick={handleLogin}>
              登入
            </div>
          
        </div>
      </Provider>
    </div>
  );
};
export default LoginIndex;
