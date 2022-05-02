import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { initializeApp } from "firebase/app"

const firebaseConfig = {
    apiKey: 'AIzaSyC26TD0pop_oIwDPmWozuHszxWA9g5jjXI',
    authDomain: 'monitorva.firebaseapp.com',
    projectId: 'monitorva',
    storageBucket: 'monitorva.appspot.com',
    messagingSenderId: '765729795514',
    appId: '1:765729795514:web:3e2fb4d1e1eeb0517a4183',
};
const app = initializeApp(firebaseConfig)
export const auth = getAuth(app);

const validateEmail = (email:string)=> {
  const re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export default class AccountApi {
  public async Authenticate( email:string, password:string) {
    if (validateEmail(email) && password.length > 5) {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            console.log(322323)
        } catch (err:any) {
            console.error(err);
            alert(err.message);
        }
    }
  }

  public async LogOut(){
      signOut(auth);
  }
}
