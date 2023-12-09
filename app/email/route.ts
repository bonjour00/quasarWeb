import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  const smtpOptions = {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "465"),
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  };
  try {
    const transporter = nodemailer.createTransport(smtpOptions);
    const data = await request.json();
    console.log("body:", data);

    if (data) {
      await transporter.sendMail({
        from: process.env.SMTP_USER ,
        to: data.email,
        subject: data.subject,
        html: data.html,
      });
      return NextResponse.json({ message: "成功送出信件" }, { status: 200 });
    } else {
      return NextResponse.json({ message: "error" }, { status: 500 });
    }
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ message: "error" }, { status: 500 });
  }
}