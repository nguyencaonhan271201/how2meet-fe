import './Input.scss';

import React, { useEffect, useState } from 'react';

export const Input: React.FC<IInput> = ({ value, placeholder, type, onChange, required, label, error }) => {
  return (
    <>
      <div className="d-flex flex-row justify-content-between">
        {label ? <label className="input__label">{label}</label> : null}
        {error ? <p className="input__error-text">{error}</p> : null}
      </div>

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={`input ${error !== "" ? "input__error" : ""}`}>
      </input>
    </>
  );
};
