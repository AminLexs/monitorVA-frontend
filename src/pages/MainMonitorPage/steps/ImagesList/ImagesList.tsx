import React, { useEffect, useState } from 'react';
import Table from 'components/Table';
import { imageApi } from 'thunks';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from 'api/AccountApi';
import { ImageTableHeaders } from 'enums/ImageTableHeaders';
import SimplePopup from 'components/SimplePopup';
import { useLocale } from 'utils/localeUtils';

const ImagesList = () => {
  const [user, loading] = useAuthState(auth);
  const [images, setImages] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [fileInputData, setFileInputData] = useState<FormData | null>(null);
  const [selectedImages, setSelectedImages] = useState<Array<string>>([]);
  const [imageName, setImageName] = useState('');
  const getLocalizedString = useLocale();

  const closeModal = () => {
    setFileInputData(null);
    setOpenPopup(false);
  };

  const getImages = async (user: any) => {
    const data = ((await imageApi.getImages(user)) as any).data;
    setImages(data);
  };
  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
      return;
    }
    if (user) {
      getImages(user);
    }
  }, [user, loading]);

  const handleDeleteImages = () => {
    imageApi.deleteImages(user, selectedImages).then(() => {
      getImages(user);
    });
  };

  return (
    <div>
      {images.length !== 0 && (
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
          />
          <SimplePopup openPopup={openPopup} onClosePopup={closeModal}>
            <div className="input-field inline">
              <input id="image_name" type="text" onChange={(event) => setImageName(event.target.value)} />
              <label htmlFor="email_inline">{getLocalizedString('imageName')}</label>
            </div>
            <input
              accept={'.tar'}
              name={'archiveImage'}
              onChange={(event) => {
                const files = event.target.files!;
                const formData = new FormData();
                formData.append('image', files[0]);
                setFileInputData(formData);
              }}
              type={'file'}
              className="waves-effect waves-light btn"
            />
            {fileInputData && imageName && (
              <button
                className="btn"
                onClick={() => {
                  imageApi.uploadArchiveImage(user, fileInputData, imageName).then(() => {
                    getImages(user);
                    closeModal();
                  });
                }}
              >
                Save
              </button>
            )}
          </SimplePopup>
        </div>
      )}
    </div>
  );
};

export default ImagesList;
