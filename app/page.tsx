'use client'
import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { GoogleAuthProvider, getAuth, onAuthStateChanged, signInWithPopup } from 'firebase/auth';
import app from "@/app/_firebase/Config";
import { addDoc, collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';

export default function Account() {
  const auth = getAuth(app);
  const db = getFirestore(app);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("註冊");
  const storage = getStorage(app);
  const [imageUrl, setImageUrl] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    });
    return () => unsubscribe();
  }, [auth]);


  const logout = function (e: React.MouseEvent<HTMLElement>) {
    auth.signOut();
    setStatus("登入");
    setMessage("登出成功");
  }

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, provider);
      const userCollection = collection(db, "users");
      const querySnapshot = await getDocs(query(userCollection, where("uid", "==", res.user?.uid)));

      if (querySnapshot.empty) {
        await addDoc(userCollection, {
          uid: res.user?.uid,
          admin: "user",
          email: res.user?.email,
          name: res.user?.displayName,
        });
      }
    } catch (error) {
      setMessage("Google 登入失敗");
      console.error(error);
    }
  };
  
  useEffect(() => {
    const fetchImage = async () => {
      try {
        const storageRef = ref(storage, '下載.jpg');
        const url = await getDownloadURL(storageRef);
        setImageUrl(url);
      } catch (error) {
        console.error("Error fetching image from Firebase Storage: ", error);
      }
    };

    fetchImage();
  }, [storage]);

  return (
    <form>
    <h1>歡迎來到 Qampus 問答管理系統</h1>
    {imageUrl && <img src={imageUrl} alt="图片描述" />}
    <div>
        {!isAuthenticated && (
          <Button variant="contained" color="secondary" onClick={handleGoogleSignIn}>
            {"Google 登入"}
          </Button>
        )}
        {isAuthenticated && (
          <Button variant="contained" color="secondary" onClick={logout}>
            {"登出"}
          </Button>
        )}
    </div>
    </form>
  )
}