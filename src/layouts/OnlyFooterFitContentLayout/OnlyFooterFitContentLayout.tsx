import React from 'react';
import './OnlyFooterFitContentLayout.scss';

export const OnlyFooterFitContentLayout: React.FC<IOnlyFooterLayout> = ({ footer, children }) => {
  return (
    <div className="only-footer-fit-content">
      <div className="only-footer-fit-content__center">{children}</div>
      <div className="only-footer-fit-content__footer">
        <div className="only-footer-fit-content__container">{footer}</div>
      </div>
    </div>
  );
};
