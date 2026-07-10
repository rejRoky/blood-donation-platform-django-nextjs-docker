"use client";

import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useState } from "react";
import { FaHome, FaUser } from "react-icons/fa";
import { BiSolidDonateBlood } from "react-icons/bi";
import { MdInfo } from "react-icons/md";
import { FiLogIn } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { IoReorderThree } from "react-icons/io5";
import { motion, useScroll, useSpring } from "motion/react";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import MenuBar from "./MenuBar";
import Logo from "@/public/assets/logo.png";
import Image from "next/image";
import { FaHandHoldingDollar } from "react-icons/fa6";
import { PiUsersThreeFill } from "react-icons/pi";
import { RiContactsBook2Fill } from "react-icons/ri";

const NavBar = () => {
  const { data } = useSession();

  const path = usePathname();
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 13,
  });

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  let home = false;
  let donners = false;
  let donation = false;
  let register = false;
  let benefits = false;
  let userManual = false;
  let about = false;

  if (path == "/") {
    home = true;
  }
  if (path == "/donners") {
    donners = true;
  }
  if (path == "/donation") {
    donation = true;
  }
  if (path == "/register") {
    register = true;
  }
  if (path == "/benefits") {
    benefits = true;
  }
  if (path == "/user-manual") {
    userManual = true;
  }
  if (path == "/about-us") {
    about = true;
  }

  const DrawerList = (
    <Box
      sx={{
        width: 220,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
      role="presentation"
      onClick={toggleDrawer(false)}
    >
      {/* Top Section */}
      <Box>
        {data?.user && data?.user?.role == "donor" && (
          <List
            sx={{
              color: "red",
              backgroundColor: "#E6D5D5",
              margin: "5px",
              padding: "0px",
              borderRadius: "20px",
            }}
          >
            <Link href="/user/dashboard">
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon sx={{ minWidth: "36px", padding: "0px" }}>
                    <FaUser className="text-2xl primary-text" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Visit Profile Page"
                    slotProps={{
                      primary: {
                        sx: { fontWeight: "bold", color: "#e92929" },
                      },
                    }}
                    secondary={
                      <Typography sx={{ fontSize: "12px", color: "#555" }}>
                        {`${data?.user.first_name} ${data?.user.last_name}`}
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
            </Link>
          </List>
        )}

        <List
          sx={{ pb: "4px", color: "red" }}
          className={`${home ? "bg-red-400 text-white" : "primary-text"}`}
        >
          <Link href="/">
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon sx={{ minWidth: "36px" }}>
                  <FaHome
                    className={`text-xl ${home ? "text-white" : "primary-text"}`}
                  />
                </ListItemIcon>
                <ListItemText
                  primary="Home"
                  className={` ${home ? "text-white" : "primary-text"}`}
                />
              </ListItemButton>
            </ListItem>
          </Link>
        </List>

        <Divider />

        <List
          sx={{ pb: "4px", color: "red" }}
          className={`${donners ? "bg-red-400 text-white" : "primary-text"}`}
        >
          <Link href="/donners">
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon sx={{ minWidth: "36px" }}>
                  <PiUsersThreeFill
                    className={`text-xl ${donners ? "text-white" : "primary-text"}`}
                  />
                </ListItemIcon>
                <ListItemText
                  primary="All Donors"
                  className={` ${donners ? "text-white" : "primary-text"}`}
                />
              </ListItemButton>
            </ListItem>
          </Link>
        </List>

        <List
          sx={{ pb: "4px", color: "red" }}
          className={`${register ? "bg-red-400 text-white" : "primary-text"}`}
        >
          <Link href="/register">
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon sx={{ minWidth: "36px" }}>
                  <BiSolidDonateBlood
                    className={`text-xl ${register ? "text-white" : "primary-text"}`}
                  />
                </ListItemIcon>
                <ListItemText
                  primary="Donate Blood"
                  className={` ${register ? "text-white" : "primary-text"}`}
                />
              </ListItemButton>
            </ListItem>
          </Link>
        </List>

        <List
          sx={{ pb: "4px", color: "red" }}
          className={`${donation ? "bg-red-400 text-white" : "primary-text"}`}
        >
          <Link href="/donation">
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon sx={{ minWidth: "36px" }}>
                  <FaHandHoldingDollar
                    className={`text-xl ${donation ? "text-white" : "primary-text"}`}
                  />
                </ListItemIcon>
                <ListItemText
                  primary="Donate Fund"
                  className={` ${donation ? "text-white" : "primary-text"}`}
                />
              </ListItemButton>
            </ListItem>
          </Link>
        </List>

        <List
          sx={{ pb: "4px", color: "red" }}
          className={`${userManual ? "bg-red-400 text-white" : "primary-text"}`}
        >
          <Link href="/user-manual">
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon sx={{ minWidth: "36px" }}>
                  <RiContactsBook2Fill
                    className={`text-xl ${userManual ? "text-white" : "primary-text"}`}
                  />
                </ListItemIcon>
                <ListItemText
                  primary="User Manuals"
                  className={` ${userManual ? "text-white" : "primary-text"}`}
                />
              </ListItemButton>
            </ListItem>
          </Link>
        </List>

        <List
          sx={{ pb: "4px", color: "red" }}
          className={`${about ? "bg-red-400 text-white" : "primary-text"}`}
        >
          <Link href="/about-us">
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon sx={{ minWidth: "36px" }}>
                  <MdInfo
                    className={`text-xl ${about ? "text-white" : "primary-text"}`}
                  />
                </ListItemIcon>
                <ListItemText
                  primary="About Us"
                  className={` ${about ? "text-white" : "primary-text"}`}
                />
              </ListItemButton>
            </ListItem>
          </Link>
        </List>
      </Box>

      {/* Footer Section */}
      <Box sx={{ mt: "auto", marginBottom: "20px" }}>
        {data?.user ? (
          <List sx={{ pb: "4px", color: "red" }}>
            <ListItem disablePadding>
              <ListItemButton onClick={() => signOut()}>
                <ListItemIcon sx={{ minWidth: "36px" }}>
                  <FiLogIn className="text-xl primary-text" />
                </ListItemIcon>
                <ListItemText primary="Log Out" />
              </ListItemButton>
            </ListItem>
          </List>
        ) : (
          <List sx={{ pb: "4px", color: "red" }}>
            <Link href="/login">
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon sx={{ minWidth: "36px" }}>
                    <FiLogIn className="text-xl primary-text" />
                  </ListItemIcon>
                  <ListItemText primary="Login" />
                </ListItemButton>
              </ListItem>
            </Link>
          </List>
        )}
      </Box>
    </Box>
  );

  return (
    <>
      <div className="flex justify-between items-center px-[22px] md:px-12 py-2 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <Link href="/">
          {Logo && <Image src={Logo} alt="Logo" height={42} />}
        </Link>

        <div className="hidden lg:flex items-center gap-12 primary-text">
          <Link href="/" className={`nav-link ${home ? "active-nav" : ""}`}>
            Home
          </Link>
          <Link
            href="/donners"
            className={`nav-link ${donners ? "active-nav" : ""}`}
          >
            All Donors
          </Link>

          <Link
            href="/register"
            className={`nav-link ${register ? "active-nav" : ""}`}
          >
            Donate Blood
          </Link>

          <Link
            href="/donation"
            className={`nav-link ${donation ? "active-nav" : ""}`}
          >
            Donate Fund
          </Link>

          <Link
            href="/user-manual"
            className={`nav-link ${userManual ? "active-nav" : ""}`}
          >
            User Manuals
          </Link>

          <Link
            href="/about-us"
            className={`nav-link ${about ? "active-nav" : ""}`}
          >
            About Us
          </Link>
        </div>

        <div className="hidden lg:block">
          {data?.user && data?.user?.role == "donor" ? (
            <MenuBar />
          ) : (
            <Link href="/login">
              <Button color="error">Login</Button>
            </Link>
          )}
        </div>

        <div className="block lg:hidden">
          <IconButton
            onClick={toggleDrawer(true)}
            aria-label="delete"
            size="large"
            sx={{ padding: "0px !important" }}
          >
            {!open ? <IoReorderThree /> : <IoClose />}
          </IconButton>
          <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
            {DrawerList}
          </Drawer>
        </div>
      </div>
      <motion.div
        className="fixed bg-red-500 h-[3px] w-full top-[57px] z-50"
        style={{ scaleX: scaleX, originX: 0 }}
      ></motion.div>
    </>
  );
};

export default NavBar;
