import './SearchBar.scss';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { faMagnifyingGlass, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const SearchBar: React.FC<ISearchBar> = ({
  value,
  selected,
  setSelected
}) => {
  const history = useHistory();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isFocus, setIsFocus] = useState<boolean>(false);
  const [selectedList, setSelectedList] = useState<Array<IParticipant>>([]);
  const [searchResults, setSearchResults] = useState<Array<IParticipant>>([]);
  const [update, setUpdate] = useState<number>(0);

  const searchUser = (name: string) => {
    setSearchResults([
      {
        name: "Nhan Nguyen Cao",
        profileImage: "https://firebasestorage.googleapis.com/v0/b/cpbo-storage.appspot.com/o/profile%2Fdefault%2F1.jpg?alt=media&token=54729427-14b6-4be6-a26b-1cca524d67ff"
      },
      {
        name: "Nhan Nguyen Cao",
        profileImage: "https://firebasestorage.googleapis.com/v0/b/cpbo-storage.appspot.com/o/profile%2Fdefault%2F2.jpg?alt=media&token=9c5c8f2b-a18b-467a-bf5a-9deaedd5056d"
      }
    ])
  }

  const selectUser = (userToAdd: any) => {
    setIsFocus(false);
    setSelectedList([...selectedList, userToAdd]);
    setSearchQuery("");
  }

  const removeUser = (index: number) => {
    let cloneList = selectedList;
    cloneList.splice(index, 1);
    setSelectedList(cloneList);
    setSelected(cloneList);
    setUpdate(update + 1);
  }

  //Hooks
  useEffect(() => {
    setSelected(selectedList);
  }, [selectedList]);

  return (
    <div className="search-bar">
      <div className="search-bar__selected">
        {selectedList.map((user: any, index: any) => {
          return (
            <div className="search-bar__selected-user">
              <img src={user.profileImage}></img>
              <p>{user.name}</p>
              <FontAwesomeIcon className="search-bar__selected-user--icon" icon={faCircleXmark}
                onClick={() => { removeUser(index) }}></FontAwesomeIcon>
            </div>)
        })}
      </div>

      <div className="search-bar__input-block">
        <input
          className="search-bar__input"
          placeholder="username to invite"
          value={searchQuery}
          onChange={(e: any) => {
            searchUser(e.target.value);
            setSearchQuery(e.target.value);
            if (e.target.value !== "")
              setIsFocus(true);
            else
              setIsFocus(false);
          }}
        >
        </input>

        <div className="search-bar__logo">
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </div>

        <div className={`search-bar__search-results ${isFocus ? "search-bar__search-results--focus" : ""}`}>
          {searchResults.map((result: any) => {
            return (<div className="search-bar__search-result-user" onClick={() => {
              selectUser(result);
            }}>
              <img alt="" src={result.profileImage}></img>
              <p>{result.name}</p>
            </div>)
          })}
        </div>
      </div>
    </div>
  );
};
