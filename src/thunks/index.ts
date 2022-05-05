import AccountApi, { auth } from 'api/AccountApi';
import ContainerApi from 'api/ContainerApi';
import ImageApi from 'api/ImageApi';

const getIdToken = async (): Promise<string | null> => {
  try {
    const idToken = await auth.currentUser?.getIdToken();
    if (!idToken) {
      return null;
    }
    return idToken;
  } catch (err) {
    return null;
  }
};
export const API_URL = process.env.REACT_APP_API_URL;

export const accountApi = new AccountApi();
export const containerApi = new ContainerApi(getIdToken, API_URL);
export const imageApi = new ImageApi(getIdToken, API_URL);
