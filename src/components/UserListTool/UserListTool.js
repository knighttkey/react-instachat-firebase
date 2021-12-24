import React, { useCallback, useState, useEffect, Fragment, useContext } from "react";
import "./UserListTool.scss";
import { Provider } from "../context";
import * as R from "ramda";

import context from "../context";

const UserListTool = (props) => {
    const contextValue = useContext(context);
    const { filteredChatList, setFilteredChatList, pickedList, setPickedList, inputFocusState, setInputFocusState } = contextValue;
    const { } = props;
   

    let tempList = [...pickedList];
    const handlePickUser = (user, behavior) => {
        if(behavior === "add") {
                tempList = R.without([user], pickedList);
        } else {
            tempList.push(user);
        }
        setPickedList(R.uniq(tempList));
    }
    const renderCheckBtn = (user) => {
        if(R.includes(user, pickedList)) {
            return (
                <div className={`check_btn `} onClick={()=>handlePickUser(user, "add")}></div>
            )
        } else {
            return (
                <div className={`check_btn blank ${pickedList.length >= 15? "disable":""}`} onClick={()=>pickedList.length >= 15? null : handlePickUser(user, "remove")}></div>
            )
        }
    }
    let filteredUserListTest = []

    return (
        <Provider value={contextValue}>
            <div className={`user_list_container`}>
                <div className={`user_list ${!filteredChatList.length ? "no_device_text":""}`}>
                    {filteredChatList.length ? (filteredChatList.map((userItem, userIndex) => {
                        return (
                            <div className="each_user" key={userIndex}>
                                <div className="text">{userItem.name}</div>
                                {/* <div className={`check_btn `} onClick={()=>handlePickUser(userItem)}></div> */}
                                {renderCheckBtn(userItem)}
                            </div>
                        )

                    })):(
                        <div className="no_device">
                            {inputFocusState ? "無符合搜尋條件的裝置":"無可選取裝置"}
                        </div>
                    )}
                </div>
            </div>
        </Provider>
    );
};
export default UserListTool;
