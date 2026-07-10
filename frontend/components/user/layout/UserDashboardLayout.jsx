"use client";

import {
  Avatar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
} from "@mui/material";
import Link from "next/link";
import { FaHome } from "react-icons/fa";
import { FiLogIn } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { IoReorderThree } from "react-icons/io5";
import { useState } from "react";
import { MdDashboard } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { usePathname } from "next/navigation";
import MenuBar from "@/components/nav_bar/MenuBar";
import Logo from "@/public/assets/logo.png";
import Image from "next/image";
import { signOut } from "next-auth/react";

function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
}

function stringAvatar(name) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
  };
}

const UserDashboardLayout = ({ children }) => {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  let dashboard = false;
  let profile = false;

  if (path == "/user/dashboard") {
    dashboard = true;
  }
  if (path == "/user/profile") {
    profile = true;
  }

  const DrawerList = (
    <Box
      sx={{ width: 220 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      className="h-screen flex flex-col justify-between"
    >
      {/* Top Section */}
      <div>
        <List sx={{ pb: "4px", color: "red" }}>
          <Link href="/">
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon sx={{ minWidth: "36px" }}>
                  <FaHome className="text-xl primary-text" />
                </ListItemIcon>
                <ListItemText primary="Home" />
              </ListItemButton>
            </ListItem>
          </Link>
        </List>

        <Divider />

        <List
          sx={{ pb: "4px", color: "red" }}
          className={`${dashboard ? "bg-red-400 text-white" : "primary-text"}`}
        >
          <Link href="/user/dashboard">
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon sx={{ minWidth: "36px" }}>
                  <MdDashboard
                    className={`text-xl ${dashboard ? "text-white" : "primary-text"}`}
                  />
                </ListItemIcon>
                <ListItemText
                  primary="Dashboard"
                  className={`${dashboard ? "text-white" : "primary-text"}`}
                />
              </ListItemButton>
            </ListItem>
          </Link>
        </List>

        <List
          sx={{ pb: "4px", color: "red" }}
          className={`${profile ? "bg-red-400 text-white" : "primary-text"}`}
        >
          <Link href="/user/profile">
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon sx={{ minWidth: "36px" }}>
                  <FaUser
                    className={`text-xl ${profile ? "text-white" : "primary-text"}`}
                  />
                </ListItemIcon>
                <ListItemText
                  primary="Profile"
                  className={`${profile ? "text-white" : "primary-text"}`}
                />
              </ListItemButton>
            </ListItem>
          </Link>
        </List>
      </div>

      {/* Footer Section */}
      <div>
        <List sx={{ pb: "4px", color: "red", marginBottom: "20px" }}>
          <ListItem disablePadding>
            <ListItemButton onClick={() => signOut()}>
              <ListItemIcon sx={{ minWidth: "36px" }}>
                <FiLogIn className="text-xl primary-text" />
              </ListItemIcon>
              <ListItemText primary="Log Out" />
            </ListItemButton>
          </ListItem>
        </List>
      </div>
    </Box>
  );

  return (
    <div>
      <div className=" bg-red-100 shadow-sm sticky top-0 flex items-center justify-between px-4 md:px-6 p-2 z-50">
        <Link href="/">
          {Logo && <Image src={Logo} alt="Logo" height={38} />}
        </Link>

        <div className="block md:hidden">
          <IconButton
            onClick={toggleDrawer(true)}
            aria-label="delete"
            size="large"
            className="p-0"
          >
            {!open ? <IoReorderThree /> : <IoClose />}
          </IconButton>
          <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
            {DrawerList}
          </Drawer>
        </div>

        <div className="hidden md:block">
          <MenuBar />
        </div>
      </div>

      <div className="flex">
        <div className="bg-red-50 fixed top-[58px] h-screen w-56 md:block hidden">
          <Link
            href="/user/dashboard"
            className={`px-7 py-3 mt-1 ${dashboard ? "bg-red-400 text-white" : "text-red-500"} hover:bg-red-500 hover:text-white rounded-md w-full duration-150 flex items-start gap-4`}
          >
            <MdDashboard className="text-xl" /> Dashboard
          </Link>

          <Link
            href="/user/profile"
            className={`px-7 py-3 ${profile ? "bg-red-400 text-white" : "text-red-500"} hover:bg-red-500 hover:text-white rounded-md w-full duration-150 flex items-start gap-4`}
          >
            <FaUser className="text-xl" /> Profile
          </Link>

          <div className="mt-[65vh]">
            <Divider />
          </div>

          <div
            onClick={() => signOut()}
            className={`px-7 py-3 cursor-pointer text-red-500 hover:bg-red-500 hover:text-white rounded-md w-full duration-150 flex items-start gap-4`}
          >
            <FiLogIn className="text-xl" /> Log Out
          </div>
        </div>
        <div className="bg-white p-[22px] md:ps-60 w-full">{children}</div>
      </div>
    </div>
  );
};

export default UserDashboardLayout;
