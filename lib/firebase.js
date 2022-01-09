import * as firebase from 'firebase/app';
import {getAuth, GoogleAuthProvider} from 'firebase/auth';
import {getFirestore, collection, query as q, where, getDocs, limit, DocumentSnapshot, FieldValue} from 'firebase/firestore';
import {getStorage} from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyBVj6wK3dYn0ycn5wAIMpGJcBuhT_O1AdA",
    authDomain: "nextjs-blog-app-lac.vercel.app",
    projectId: "next-js-blog-app",
    storageBucket: "next-js-blog-app.appspot.com",
    messagingSenderId: "351492020451",
    appId: "1:351492020451:web:bc894907f5cf7b287d8dd6",
    measurementId: "G-0BEKBTFFCG"
};


const app = firebase.initializeApp(firebaseConfig);


// Auth exports
export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();

// Firestore exports
export const firestore = getFirestore(app);
export const serverTimeStamp = FieldValue.serverTimeStamp;
export const increment = FieldValue.increment;

// Storage exports
export const storage = getStorage(app);


//Helpers

/**`
 * Gets a users/{uid} document with username
 * @param  {string} username
 */
 export async function getUserWithUsername(username) {
    const usersRef = collection(firestore, 'users');
    const query = q(usersRef, where('username', '==', username), limit(1));
    const userDoc = (await getDocs(query)).docs[0];
    return userDoc;
  }
  
  /**`
   * Converts a firestore document to JSON
   * @param  {DocumentSnapshot} doc
   */
  export function postToJSON(doc) {
    const data = doc.data();
    return {
      ...data,
      // Gotcha! firestore timestamp NOT serializable to JSON. Must convert to milliseconds
      createdAt: data?.createdAt.toMillis() || 0,
      updatedAt: data?.updatedAt.toMillis() || 0,
    };
  }