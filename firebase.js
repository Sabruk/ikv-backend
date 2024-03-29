import firebase from "firebase/compat/app";
import { initializeApp } from 'firebase/app';
import {getFirestore} from 'firebase/firestore'
import "firebase/compat/auth";
import "firebase/compat/storage"
import "firebase/compat/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyAzkrzMfHnDsFAxoUGLkdIiftlHWyt3d48",
    authDomain: "sdms11.firebaseapp.com",
    projectId: "sdms11",
    storageBucket: "sdms11.appspot.com",
    messagingSenderId: "264477479655",
    appId: "1:264477479655:web:2af00d812fae4076500842",
    measurementId: "G-EE79XBTN73"
  };

if(!firebase.apps.length)
{
    firebase.initializeApp(firebaseConfig);
}



export const storage = firebase.storage()

export const db = firebase.firestore()

export const firebase_app = firebase