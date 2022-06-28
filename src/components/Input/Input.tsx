import './Input.scss';

import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

export const Input: React.FC<IInput> = ({ value, placeholder, type, onChange, required, label, error, readonly }) => {
  const [isShowingPassword, setIsShowingPassword] = useState<boolean>(false);
  const [inputType, setInputType] = useState<string>("");

  useEffect(() => {
    setInputType(type || "text");
  }, [type]);

  useEffect(() => {
    if (type === "password" && isShowingPassword) {
      setInputType("text");
    } else setInputType(type || "text");
  }, [isShowingPassword])

  return (
    <>
      <div className="d-flex flex-row justify-content-between">
        {label ? <label className="input__label">{label}</label> : null}
        {error ? <p className="input__error-text">{error}</p> : null}
      </div>

      <div className="input__container">
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className={`input ${error !== "" ? "input__error" : ""} ${readonly ? "input--readonly" : ""}`}
          readOnly={readonly || false}>
        </input>

        {type === "password" && value && value.length > 0 &&
          <div
            onClick={() => { setIsShowingPassword(!isShowingPassword) }}
            className="input__eye-icon">
            <FontAwesomeIcon
              icon={isShowingPassword ? faEye : faEyeSlash} />
          </div>
        }
      </div>
    </>
  );
};
