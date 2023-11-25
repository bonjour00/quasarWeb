'use client'
import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { GoogleAuthProvider, getAuth, onAuthStateChanged, signInWithPopup } from 'firebase/auth';
import app from "@/app/_firebase/Config";
import { addDoc, collection, getDocs, getFirestore, query, updateDoc, where } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';

export default function Account() {
  const auth = getAuth(app);
  const db = getFirestore(app);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("註冊");
  const storage = getStorage(app);
  const [imageUrl, setImageUrl] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);  
  const [admin, setAdmin] = useState('user');

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

  const handleChangeAdminRole = async (event: { target: { value: any; }; }) => {
    const newRole = event.target.value;
  
    try {
      const user = auth.currentUser;
      if (user) {
        const userCollection = collection(db, "users");
        const userQuerySnapshot = await getDocs(query(userCollection, where('uid', '==', user.uid)));
  
        if (!userQuerySnapshot.empty) {
          userQuerySnapshot.forEach(async (doc) => {
            const docRef = doc.ref;
            await updateDoc(docRef, { admin: newRole });
          });
        }
      }
      setAdmin(newRole);
      setMessage(`Admin role updated to ${newRole}`);
    } catch (error) {
      setMessage('Failed to update admin role');
      console.error(error);
    }
  };  

  return (
    <form>
    <div>
        {!isAuthenticated && (
          <>
          <div>
          <h1>歡迎來到 Qampus 問答管理系統</h1>
          </div>
          <div>
          {imageUrl && <img src={imageUrl} alt="图片描述" />}
          </div>
          <div>
          <Button variant="contained" color="secondary" onClick={handleGoogleSignIn}>
            {"Google 登入"}
          </Button>
          </div>
          </>
        )}
        {isAuthenticated && (
          <>
          <div>
          <h1>基本資料設定</h1>
          </div>
          <div>
          {imageUrl && <img src={imageUrl} alt="图片描述" />}
          </div>
          <div>
            <select value={admin} onChange={handleChangeAdminRole} style={{ fontSize: '30px' }}>
              <option value="user">一般學生</option>
              <option value="admin">系統管理員</option>
              <option value="資訊中心">資訊中心</option>
            </select>
          </div>
          <div></div>
          <div>
              <Button variant="contained" color="secondary" onClick={logout}>
                {"登出"}
              </Button>
          </div>
          </>
        )}
    </div>
    </form>
  )
}