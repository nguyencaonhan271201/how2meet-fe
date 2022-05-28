import React from 'react';
import './FullLayout.scss';

export const FullLayout: React.FC<IFullLayout> = ({ header, footer, children }) => {
  return (
    <div className="full-layout">
      <div className="full-layout__header">
        <div className="full-layout__container">{header}</div>
      </div>
      <div className="full-layout__center">{children}</div>
      <div className="full-layout__footer">
        <div className="full-layout__container">{footer}</div>
      </div>
    </div>
  );
};
