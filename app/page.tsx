"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import {
  GoogleAuthProvider,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  User,
} from "firebase/auth";
import app from "@/app/_firebase/Config";
import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import Avatar from "@mui/material/Avatar";

export default function Account() {
  const auth = getAuth(app);
  const db = getFirestore(app);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("註冊");
  const storage = getStorage(app);
  const [imageUrl, setImageUrl] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [admin, setAdmin] = useState("尚未選擇所屬單位");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userCollection = collection(db, "users");
        const userQuerySnapshot = await getDocs(
          query(userCollection, where("uid", "==", user.uid))
        );
  
        if (!userQuerySnapshot.empty) {
          userQuerySnapshot.forEach((doc) => {
            const userData = doc.data();
            const userAdmin = userData.admin;
            const userName = userData.name;
            const userEmail = userData.email;
            setAdmin(userAdmin);
            setName(userName);
            setEmail(userEmail);
          });
        }
        setIsAuthenticated(true);
        setUser(user);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, [auth, db]);

  const logout = function (e: React.MouseEvent<HTMLElement>) {
    auth.signOut();
    setStatus("登入");
    setMessage("登出成功");
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, provider);
      const userCollection = collection(db, "users");
      const querySnapshot = await getDocs(
        query(userCollection, where("uid", "==", res.user?.uid))
      );

      if (querySnapshot.empty) {
        await addDoc(userCollection, {
          uid: res.user?.uid,
          admin: "尚未選擇所屬單位",
          email: res.user?.email,
          name: res.user?.displayName,
        });
      }
    } catch (error) {
      setMessage("Google 登入失敗");
      console.error(error);
    }
  };

  const handleChangeAdminRole = async (event: { target: { value: any } }) => {
    const newRole = event.target.value;

    try {
      const user = auth.currentUser;
      if (user) {
        const userCollection = collection(db, "users");
        const userQuerySnapshot = await getDocs(
          query(userCollection, where("uid", "==", user.uid))
        );

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
      setMessage("Failed to update admin role");
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
            <div>{imageUrl && <img src={imageUrl} alt="图片描述" />}</div>
            <div>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleGoogleSignIn}
              >
                {"Google 登入"}
              </Button>
            </div>
          </>
        )}
        {isAuthenticated && (
          <>
            <div>
              <h1>用戶基本資料</h1>
            </div>
            <div>
            <Avatar
              src={user?.photoURL || undefined} />
            </div>
            <div>
              <h3>用戶名稱</h3>
              <span>{name}</span>
            </div>
            <div>
              <h3>用戶電子郵件</h3>
              <span>{email}</span>
            </div>
            <div>
              <h3>用戶權限</h3>
              <span>{admin}</span>
            </div>
            {
              admin == "尚未選擇所屬單位" && (
                <>
                <div>
                  <h3>第一次登入請選擇所屬單位</h3>
                </div>
                <div>
                  <select
                    value={admin}
                    onChange={handleChangeAdminRole}
                    style={{ fontSize: "30px" }}
                  >
                    <option value="尚未選擇所屬單位">尚未選擇所屬單位</option>
                    <option value="一般學生">一般學生</option>
                    <option value="系統管理員">系統管理員</option>
                    <option value="資訊中心">資訊中心</option>
                  </select>
                </div>
                </>
              )
            }
            <div>
              <Button variant="contained" color="secondary" onClick={logout}>
                {"登出"}
              </Button>
            </div>
          </>
        )}
      </div>
    </form>
  );
}
