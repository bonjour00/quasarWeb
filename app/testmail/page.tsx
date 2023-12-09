'use client'
import { Button, TextField } from "@mui/material";
import axios from "axios";
import { useState } from "react";

export default function TestEmail() {
  const [message, setMessage] = useState({email: 'qampusai@gmail.com', subject: '', html: '' });
  const [response, setResponse] = useState('');
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage({ ...message, [e.target.name]: e.target.value });
  }
  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setResponse('送信中...');
    try {
      const response = await axios({
        method: 'post',
        url: '/email',
        data: message,
      });
      setResponse(response.data.message);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setResponse(error.message);
      } else {
        setResponse("錯誤");
      }

    }
  }
  return (
    <div>
      <div>
        <h1>意見反應區</h1>
      </div>
      <div>
        <h3>如果在系統使用上有遇到任何問題，歡迎來信反饋~~~</h3>
      </div>
      <div>
        問題簡述
      </div>
      <div>
        <TextField
          type="text"
          name="subject"
          value={message.subject}
          placeholder="請輸入信件主題..."
          onChange={handleChange}
        />
      </div>
      <div>
        具體情況說明(可在此留下聯絡方式)
      </div>
      <div>
        <TextField
          type="text"
          name="html"
          value={message.html}
          placeholder="請輸入信件內容..."
          onChange={handleChange}
        />
      </div>
      <div>{response}</div>
      <Button onClick={handleClick}>
        送出
      </Button>
    </div>
  )
}