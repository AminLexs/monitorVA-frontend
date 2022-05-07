import Popup from 'reactjs-popup';
import React from 'react';

interface SimplePopupProps {
  openPopup: boolean;
  onClosePopup: () => void;
}

import styles from './SimplePopup.module.scss';

const SimplePopup = ({ openPopup, onClosePopup, children }: React.PropsWithChildren<SimplePopupProps>) => {
  return (
    <Popup open={openPopup} closeOnDocumentClick onClose={onClosePopup}>
      <div className={styles.popupContainer}>
        <a onClick={onClosePopup} className=" right btn-floating btn waves-effect waves-light red">
          <i className="material-icons">close</i>
        </a>
        <div className={styles.popupBodyContainer}>{children}</div>
      </div>
    </Popup>
  );
};

export default SimplePopup;
