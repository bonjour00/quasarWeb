"use client";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import useQA from "../_component/Table/useMessage";

export default function Message() {
  const [message, setMessage] = useState("");
  const [QaList, createQA, deleteQA, updateQA] = useQA();
  const handleClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleSubmit = async () => {
    const res = await fetch(
      "https://fju-test3.cognitiveservices.azure.com/language/:query-knowledgebases?projectName=shelly-search-test&api-version=2021-10-01",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Ocp-Apim-Subscription-Key": "fde6fc08d2e14a71b844af69aeea65f7",
        },
        body: JSON.stringify({
          question: message,
        }),
      }
    );
    const result = await res.json();
    const answer = result.answers[0].answer;
    createQA({
      question: message,
      answer,
    });
  };

  const keyPress = (ev: React.KeyboardEvent<HTMLDivElement>) => {
    console.log(`Pressed keyCode ${ev.key}`);
    if (ev.key === "Enter") {
      handleSubmit();
      setMessage("");
    }
  };
  return (
    <>
      {QaList.map((x) => (
        <div key={x.qaId}>
          {x.question}/{x.answer}
          <button onClick={() => deleteQA(x.qaId)}>del</button>
          <button
            onClick={() =>
              updateQA({
                qaId: x.qaId,
                question: "??",
                answer: "aaa",
                qaAskTime: new Date(),
                qaCheckTime: "123",
                stuNum: "001", //學號
                office: "資管", //目前指派單位
                officeId: "1",
                assignCount: 0, //轉介次數
                history: ["資管"],
                status: "pending", //狀態 e.g 是否審核過
                QaCanCheck: false,
              })
            }
          >
            update
          </button>
        </div>
      ))}
      <TextField
        id="fullWidth"
        fullWidth
        label="問啥?"
        variant="filled"
        value={message}
        onKeyUp={keyPress}
        onChange={handleClick}
      />
    </>
  );
}
