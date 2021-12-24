import React, { useCallback, useState, useEffect, Fragment, useContext } from "react";
import "./SearchTool.scss";
import { Provider } from "../context";
import * as R from "ramda";

import context from "../context";

const SearchTool = (props) => {
    const contextValue = useContext(context);
    const {  } = contextValue;
    const { placeholderText, inputFocusState, setInputFocusState, searchList, setFilteredChatList, inputContent, setInputContent } = props;

    const handleSearch = (keyword) => {
        if(keyword) {
            
            keyword = keyword.toLowerCase();
            setInputContent(keyword);
            let matchedChatRoom = searchList.filter((element) => {
                let msgListIncludeKeyword = [];
                 if(element.msgs.type === "text" || element.msgs.type === "reply_text") {
                    msgListIncludeKeyword = element.msgs.some((item) => {
                        return item.content.toLowerCase().includes(keyword);
                    });
                 }

                return msgListIncludeKeyword;
            });
            
            setFilteredChatList(R.uniq(matchedChatRoom));
            // matchMsgs
        } else {
            setInputContent("");
            setFilteredChatList(searchList);
        }
    
      };

    const handleClearInputText = () => {
        handleSearch("");
        setInputContent("");
        setFilteredChatList(searchList);
    }

    return (
        <Provider value={contextValue}>
            <div className={`search_tool_container`}>
                <div className="search_tool">
                    <div className={`serach_icon ${inputFocusState? "focus":"blur"}`}></div>
                    <input className="input_box"
                        type="text"
                        placeholder={placeholderText}
                        value={inputContent}
                        // onChange={(event) => setInputContent(event.target.value)}
                        onChange={(event) => handleSearch(event.target.value)}
                        spellCheck={false}
                        onFocus={() => setInputFocusState(true)}
                        onBlur={() => setInputFocusState(false)}
                    />
                    {inputContent.length ? 
                    <div className="close_icon" onClick={handleClearInputText}></div> : null}
                </div>
            </div>
        </Provider>
    );
};
export default SearchTool;
