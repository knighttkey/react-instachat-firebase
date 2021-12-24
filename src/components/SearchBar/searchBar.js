import "./searchBar.scss";
import React, { useState } from 'react';

const SearchBar = props => {
  const { searchTypeList, onInputChanged } = props;

  const [isDisplayTypeList, setIsDisplayTypeList] = useState(false);
  const [selectedType, setSelectedType] = useState(0);
  const [inputText, setInputText] = useState("");

  const getSearchTypeList = () => {
    return searchTypeList?.map((searchType) => {
      return (
        <li key={searchType.id} onClick={() => { setIsDisplayTypeList(false); setSelectedType(searchType.id); output(searchType.id, inputText); }}>
          {searchType.name}
        </li>
      )
    })
  }

  const output = (id, value) => {
    onInputChanged && onInputChanged({ selectedId: id, text: value });
  }

  return (
    <div className="searchbar-container">
      <div className="searchbar-header" onClick={() => setIsDisplayTypeList(!isDisplayTypeList)}>
        {isDisplayTypeList ?
          (
            <div className="float-panel">
              <ul>
                {getSearchTypeList()}
              </ul>
            </div>
          ) : null
        }
        <div className="header-wrapper">
          <div className="search-type">{searchTypeList?.find(i => i.id === selectedType).name || ""}</div>
          <div className="dropdown-icon"></div>
        </div>
      </div>
      <div className="middle"></div>
      <div className="searchbar-input">
        <div className="search-icon"></div>
        <input type="text" placeholder="請輸入關鍵字" onChange={e => { setInputText(e.target.value); output(selectedType, e.target.value); }} />
      </div>
    </div>
  )
}

export default SearchBar;
