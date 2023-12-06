"use client";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Button from "@mui/material/Button";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { styled } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import app from "./_firebase/Config";
import PendingActionsOutlinedIcon from "@mui/icons-material/PendingActionsOutlined";
import LiveHelpOutlinedIcon from "@mui/icons-material/LiveHelpOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ContentPasteSearchOutlinedIcon from "@mui/icons-material/ContentPasteSearchOutlined";
import "./menu.css";
import Image from "next/image";

const menuList = [
  {
    title: "待審核問題",
    icon: <PendingActionsOutlinedIcon />,
    url: "/pending",
  },
  { title: "問答集", icon: <LiveHelpOutlinedIcon />, url: "/QA" },
  { title: "近期刪除", icon: <DeleteOutlineOutlinedIcon />, url: "/recentDel" },
  {
    title: "尚未確認問題",
    icon: <ContentPasteSearchOutlinedIcon />,
    url: "/noAssign",
  },
  { title: "寄信", icon: <ContentPasteSearchOutlinedIcon />, url: "/testmail" },
];

const MiniDrawer = () => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const fetchUserInformation = () => {
    const auth = getAuth(app);
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });
  };
  fetchUserInformation();
  return (
    <div className="sidebar">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "white",
          paddingTop: "3rem",
        }}
      >
        <Image src="/logo.png" alt="Logo" width={220} height={65} />
        {/* Sidebar Header */}
      </div>
      <div className="sidebar-item">
        {/* Sidebar Menu */}
        {menuList.map((item, index) => (
          <div
            className={`sidebar-button ${
              pathname === item.url ? "active" : ""
            }`}
            key={index}
            onClick={() => router.push(item.url)}
          >
            <p className="sidebar-icon">{item.icon}</p>
            <p className="sidebar-text">{item.title}</p>
          </div>
        ))}
      </div>
      {user ? (
        <div
          className="user"
          onClick={() => router.push("/")}
          // style={{
          //   display: "flex",
          //   flexDirection: "column",
          //   alignItems: "center",
          //   cursor: "pointer",
          // }}
        >
          <Avatar
            alt={user?.displayName || undefined}
            src={user?.photoURL || undefined}
          />
          <span style={{ color: "black", marginLeft: "1.5rem" }}>
            {user.displayName}
          </span>
        </div>
      ) : (
        <div
          onClick={() => router.push("/")}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          <Avatar />
          <span style={{ color: "white" }}>Guest</span>
        </div>
      )}
    </div>
  );
};

export default MiniDrawer;
