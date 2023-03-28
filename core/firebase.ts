import { initializeApp } from "firebase/app";
import { getAuth, signOut } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();

export const signout = async () => {
    // await AsyncStorage.removeItem('user');
    // localStorage.removeItem('user');
    await signOut(auth);
}
