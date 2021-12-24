import React, { useCallback, useState, useEffect, Fragment, useContext } from "react";
import "./AddMember.scss";
import { Provider } from "../../context";
import * as R from "ramda";

import context from "../../context";
import SearchTool from "./../..//SearchTool/SearchTool";
import UserListTool from "../../UserListTool/UserListTool";

const AddMember = (props) => {
    const contextValue = useContext(context);
    const { streamArray } = contextValue;
    const { closeModal } = props;
    const [filteredChatList, setFilteredChatList] = useState(streamArray);
    const [pickedList, setPickedList] = useState([]);
    const fff = () => {
    }
    const addMemberValue = {streamArray, filteredChatList, setFilteredChatList, pickedList, setPickedList};

    const handleCloseAddMemberModal = () => {
        closeModal();
        // setPickedList([]);
    }
    const handleAdd = () => {
        closeModal();
        // setPickedList([]);
    }


    const renderAddBtn = () => {
        if(pickedList.length) {
            return (
                <div className="btn" onClick={handleAdd}>新增</div>
            )
        } else {
            return (
                <div className="btn disable">新增</div>
            )
        }
    }
    return (
        <div className={`add_member_container`}>
            <Provider value={addMemberValue}>
                <div className="add_member">
                    <div className="close_btn" onClick={handleCloseAddMemberModal}></div>
                    <div className="title">新增成員</div>
                    <SearchTool placeholderText="搜尋使用者及裝置"/>
                    <UserListTool userArray={streamArray}/>
                    {renderAddBtn()}
                </div>
            </Provider>
        </div>
    );
};
export default AddMember;
