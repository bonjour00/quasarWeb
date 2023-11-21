"use client";
import {
  collection,
  getFirestore,
  addDoc,
  serverTimestamp,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import app from "@/app/_firebase/Config";
import { useEffect, useState } from "react";
import { QAadd, QA, QaUpate } from "../../_settings/interface";

export default function useQA() {
  const db = getFirestore(app);
  const [QaList, setQalist] = useState<QA[]>([]);
  const [updated, setUpdated] = useState(0);
  const qaRef = collection(db, "QA");

  useEffect(() => {
    const fetchQA = async () => {
      try {
        const data = await getDocs(qaRef);
        const list = data.docs.map((doc: any) => ({
          id: doc.id,
          qaId: doc.id,
          ...doc.data(),
        }));
        setQalist(list);
      } catch (error) {
        console.log(error);
      }
    };
    fetchQA();
  }, [updated, db]);

  const createQA = async (QAadd: QAadd) => {
    console.log("run");
    try {
      await addDoc(collection(db, "QA"), {
        question: QAadd.question,
        answer: QAadd.answer,
        qaAskTime: serverTimestamp(),
        qaCheckTime: "",
        stuNum: "001", //學號
        office: "資管", //目前指派單位
        officeId: "1",
        history: ["資管"],
        status: "pending", //狀態 e.g 是否審核過
      });
      setUpdated((currentValue) => currentValue + 1);
    } catch (error) {
      console.log(error);
    }
  };

  const updateQA = async (QA: QA) => {
    try {
      await updateDoc(doc(db, "QA", QA.qaId), {
        question: QA.question,
        answer: QA.answer,
        qaCheckTime: QA.QaCanCheck ? serverTimestamp() : "",
        office: QA.office,
        officeId: QA.officeId,
        assignCount: QA.QaCanCheck ? QA.assignCount : QA.assignCount + 1, //轉介次數
        history: QA.QaCanCheck ? QA.history : [...QA.history, QA.office],
        status: QA.QaCanCheck ? "checked" : "pending",
      });
      setUpdated((currentValue) => currentValue + 1);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteQA = async (qaID: string) => {
    try {
      await deleteDoc(doc(db, "QA", qaID));
      setUpdated((currentValue) => currentValue + 1);
    } catch (error) {
      console.error(error);
    }
  };

  return [QaList, createQA, deleteQA, updateQA] as const;
}
