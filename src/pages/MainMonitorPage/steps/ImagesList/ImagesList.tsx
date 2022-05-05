import React, { useEffect, useState } from 'react';
import Table from 'components/Table';
import { imageApi } from 'thunks';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from 'api/AccountApi';
import { ImageTableHeaders } from 'enums/ImageTableHeaders';
import SimplePopup from 'components/SimplePopup';

const ImagesList = () => {
  const [user, loading] = useAuthState(auth);
  const [images, setImages] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [fileInputData, setFileInputData] = useState<FormData | null>(null);

  const closeModal = () => {
    setFileInputData(null);
    setOpenPopup(false);
  };

  const getImages = async (user: any) => {
    const data = ((await imageApi.getImages(user)) as any).data;
    setImages(data);
    console.log(data);
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

  return (
    <div>
      {images.length && (
        <div>
          <button className="btn blue darken-1" onClick={() => setOpenPopup((o) => !o)}>
            Add image
          </button>
          <Table content={images} headings={Object.values(ImageTableHeaders)} />
          <SimplePopup openPopup={openPopup} onClosePopup={closeModal}>
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
            {fileInputData && (
              <button
                className="btn"
                onClick={() => {
                  imageApi.uploadArchiveImage(user, fileInputData);
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
