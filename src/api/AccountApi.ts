import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { validateEmail } from 'utils/stringUtils';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export default class AccountApi {
  public async Authenticate(email: string, password: string) {
    if (validateEmail(email) && password.length > 5) {
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (err: any) {
        if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
          alert('Электронная почта и/или пароль неверны');
        } else {
          alert(err.message);
        }
      }
    }
  }

  public async GetToken(user: any) {
    return user.getIdToken();
  }

  public async LogOut() {
    signOut(auth);
  }
}
