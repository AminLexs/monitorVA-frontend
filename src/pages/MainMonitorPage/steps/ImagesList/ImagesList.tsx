import React, { useEffect, useState } from 'react';
import Table from 'components/Table';
import { imageApi } from 'thunks';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from 'api/AccountApi';
import { ImageTableHeaders } from 'enums/ImageTableHeaders';
import SimplePopup from 'components/SimplePopup';
import { useLocale } from 'utils/localeUtils';
import Loading from 'components/Loading';
import { setLoading } from 'handlers/ui';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'handlers';
import { TableType } from 'enums/TableType';

const ImagesList = () => {
  const [user] = useAuthState(auth);
  const [images, setImages] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [fileInputData, setFileInputData] = useState<FormData | null>(null);
  const [selectedImages, setSelectedImages] = useState<Array<string>>([]);
  const [imageName, setImageName] = useState('');
  const { getLocalizedString } = useLocale();
  const [errorImageName, setErrorImageName] = useState(false);
  const [badImage, setBadImage] = useState(false);
  const { loading } = useSelector((state: RootState) => state.app.ui);
  const dispatch = useDispatch();

  const closeModal = () => {
    setFileInputData(null);
    setOpenPopup(false);
  };

  const getImages = async (user: any) => {
    const data = ((await imageApi.getImages(user)) as any).data;
    setImages(data);
  };
  useEffect(() => {
    if (user) {
      dispatch(setLoading(true));
      getImages(user).then(() => {
        dispatch(setLoading(false));
      });
    }
  }, [user]);

  const handleDeleteImages = () => {
    imageApi.deleteImages(user, selectedImages).then(() => {
      dispatch(setLoading(true));
      getImages(user).then(() => dispatch(setLoading(false)));
    });
  };

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <div>
          <button className="btn blue darken-1" onClick={() => setOpenPopup((o) => !o)}>
            {getLocalizedString('addImage')}
          </button>
          <button className="btn red darken-1" onClick={handleDeleteImages}>
            {getLocalizedString('deleteImage')}
          </button>
          <Table
            content={images}
            headings={Object.values(ImageTableHeaders)}
            onChange={(selectedItems) => {
              setSelectedImages(selectedItems);
            }}
            tableType={TableType.ImageTable}
          />
          <SimplePopup openPopup={openPopup} onClosePopup={closeModal}>
            <div style={{ marginBottom: '0px' }} className="input-field inline">
              <input
                name="image_name"
                id="image_name"
                type="text"
                onChange={(event) => {
                  setImageName(event.target.value.toLowerCase());
                  setErrorImageName(false);
                }}
              />
              <label htmlFor="image_name">{getLocalizedString('imageName')}</label>
            </div>
            {errorImageName && (
              <label style={{ color: 'red', marginBottom: '10px' }}>{getLocalizedString('errorImageName')}</label>
            )}
            <input
              accept={'.tar'}
              name={'archiveImage'}
              onChange={(event) => {
                setBadImage(false);
                const files = event.target.files!;
                const formData = new FormData();
                formData.append('image', files[0]);
                setFileInputData(formData);
              }}
              type={'file'}
              className="waves-effect waves-light btn"
            />
            {badImage && <label style={{ color: 'red', marginBottom: '10px' }}>{getLocalizedString('badImage')}</label>}
            {fileInputData && imageName && (
              <button
                className="btn"
                style={{ marginTop: '10px' }}
                onClick={async () => {
                  const checkNameResult = await imageApi.checkImageName(user, imageName);
                  if (!checkNameResult) {
                    const error = ((await imageApi.uploadArchiveImage(user, fileInputData, imageName)) as any).error;
                    if (error) return setBadImage(true);
                    getImages(user);
                    closeModal();
                  } else {
                    setErrorImageName(true);
                  }
                }}
              >
                Сохранить
              </button>
            )}
          </SimplePopup>
        </div>
      )}
    </div>
  );
};

export default ImagesList;
