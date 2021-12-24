import React, { useCallback, useState, useEffect, Fragment, useContext } from "react";
import "./InviteUser.scss";
import { Provider } from "./../../context";
import * as R from "ramda";

import context from "./../../context";
import SearchTool from "././../../SearchTool/SearchTool";
import UserListTool from "././../../UserListTool/UserListTool";

const InviteUser = (props) => {
    const contextValue = useContext(context);
    const { pickedList, setPickedList, phoneBookList, setIsHost } = contextValue;
    const { closeModal, createRoom, setBehavior, handleInitRoom,  } = props;
    const [filteredChatList, setFilteredChatList] = useState(phoneBookList);
    const [inputFocusState, setInputFocusState] = useState(false);

    const addMemberValue = {filteredChatList, setFilteredChatList, pickedList, setPickedList, phoneBookList, inputFocusState, setInputFocusState};

    const handleCloseAddMemberModal = () => {
        closeModal();
        setPickedList([]);
    }


    const renderAddBtn = () => {
        if(pickedList.length) {
            return (
                <div className="btn" onClick={handleAdd}>開啟</div>
            )
        } else {
            return (
                <div className="btn disable">開啟</div>
            )
        }
    }
    return (
        <div className={`invite_user_container`}>
            <Provider value={addMemberValue}>
                <div className="invite_user">
                    <div className="invite_header">
                        <div className="return_icon" onClick={handleCloseAddMemberModal}></div>返回
                    </div>
                    <div className="title">
                        
                        <div className="text">選擇成員</div>
                        <div className="count">({pickedList.length}/15)</div>
                    </div>
                    <SearchTool placeholderText="搜尋使用者及裝置"/>
                    <UserListTool/>
                    {renderAddBtn()}
                </div>
            </Provider>
        </div>
    );
};
export default InviteUser;
