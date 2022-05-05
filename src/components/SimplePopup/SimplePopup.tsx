import Popup from 'reactjs-popup';
import React from 'react';

interface SimplePopupProps {
  openPopup: boolean;
  onClosePopup: () => void;
}

const SimplePopup = ({ openPopup, onClosePopup, children }: React.PropsWithChildren<SimplePopupProps>) => {
  return (
    <Popup open={openPopup} closeOnDocumentClick onClose={onClosePopup}>
      <a onClick={onClosePopup} className="btn-floating btn waves-effect waves-light red">
        <i className="material-icons">close</i>
      </a>
      <div>{children}</div>
    </Popup>
  );
};

export default SimplePopup;
