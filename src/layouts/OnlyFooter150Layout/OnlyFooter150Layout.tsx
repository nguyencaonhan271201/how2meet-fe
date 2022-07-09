import React from 'react';
import './OnlyFooter150Layout.scss';

export const OnlyFooter150Layout: React.FC<IOnlyFooterLayout> = ({ footer, children }) => {
  return (
    <div className="only-footer-150">
      <div className="only-footer-150__center">{children}</div>
      <div className="only-footer-150__footer">
        <div className="only-footer-150__container">{footer}</div>
      </div>
    </div>
  );
};
