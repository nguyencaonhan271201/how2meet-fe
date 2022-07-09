import './SearchBar.scss';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { faMagnifyingGlass, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { doGetUserByFirebaseID, doSearchUserByQuery, RootState, useAppDispatch } from '../../redux';
import { useSelector } from 'react-redux';

export const SearchBar: React.FC<ISearchBar> = ({
  value,
  selected,
  setSelected,
  editable,
}) => {
  const history = useHistory();
  const dispatch = useAppDispatch();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isFocus, setIsFocus] = useState<boolean>(false);
  const [selectedList, setSelectedList] = useState<Array<ICreateUserResponse>>([]);
  const [searchResults, setSearchResults] = useState<Array<ICreateUserResponse>>([]);
  const [update, setUpdate] = useState<number>(0);

  const { searchResults: searchUserResults } = useSelector(
    (state: RootState) => state.userSearchSlice,
  );
  const { user } = useSelector(
    (state: RootState) => state.loginSlice,
  );

  const searchUser = (name: string) => {
    dispatch(doSearchUserByQuery({ query: name }));
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

  useEffect(() => {
    if (localStorage.getItem('firebase_id'))
      dispatch(doGetUserByFirebaseID({
        firebase_id: localStorage.getItem('firebase_id') || ''
      }))

    if (selected) {
      setSelectedList(selected);
    }
  }, []);

  useEffect(() => {
    if (searchUserResults && user) {
      let filteredSearchResults = [] as any[];
      searchUserResults.forEach((result: any) => {
        if (result.firebase_id !== user.firebase_id) {
          let exist = selectedList.some((selected: any) => selected.firebase_id === result.firebase_id);
          if (!exist)
            filteredSearchResults.push(result);
        }
      })
      setSearchResults(filteredSearchResults)
    }
  }, [searchUserResults]);

  return (
    <div className="search-bar">
      <div className="search-bar__selected">
        {selectedList.map((user: any, index: any) => {
          return (
            <div className="search-bar__selected-user">
              <img src={user.image}></img>
              <p>{user.name}</p>
              <FontAwesomeIcon className="search-bar__selected-user--icon" icon={faCircleXmark}
                onClick={() => { removeUser(index) }}></FontAwesomeIcon>
            </div>)
        })}
      </div>

      <div className="search-bar__input-block">
        <input
          className={`search-bar__input ${!editable ? "search-bar__input--readonly" : ""}`}
          placeholder="username to invite"
          value={searchQuery}
          readOnly={!editable ? true : false}
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
              <img alt="" src={result.image}></img>
              <p>{result.name}</p>
            </div>)
          })}
        </div>
      </div>
    </div >
  );
};
