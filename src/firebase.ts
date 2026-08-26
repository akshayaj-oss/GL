import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "gen-lang-client-0115353376",
  appId: "1:328075135915:web:5d5ec9df3ef1881b9ae0ee",
  apiKey: "AIzaSyBl9RIzI_t9juzvS9LJZX-J16UQo6N7ENs",
  authDomain: "gen-lang-client-0115353376.firebaseapp.com",
  storageBucket: "gen-lang-client-0115353376.firebasestorage.app",
  messagingSenderId: "328075135915"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, "ai-studio-findyourtribe-48f7c5e4-7497-49d8-8c24-a56c2cf47fdd");
