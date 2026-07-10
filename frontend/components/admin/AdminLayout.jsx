"use client";

import { Avatar, Box, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack } from "@mui/material";
import Link from "next/link";
import { FaHome } from "react-icons/fa";
import { FiLogIn } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { IoReorderThree } from "react-icons/io5";
import { useState } from "react";
import { MdDashboard } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { usePathname } from "next/navigation";
import Logo from "@/public/assets/logo.png";
import Image from "next/image";


function stringToColor(string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

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
        children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
    };
}

const AdminLayout = ({ children }) => {
    const path = usePathname();
    const [open, setOpen] = useState(false);
    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };


    let dashboard = false;
    let profile = false;

    if (path == '/user/dashboard') {
        dashboard = true;
    }
    if (path == '/user/profile') {
        profile = true;
    }

    const DrawerList = (
        <Box sx={{ width: 170 }} role="presentation" onClick={toggleDrawer(false)}>
            <List sx={{ pb: '4px', color: 'red' }}>
                <Link href="/" >
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemIcon className="min-w-10">
                                <FaHome className="text-xl primary-text" />
                            </ListItemIcon>
                            <ListItemText primary="Home" />
                        </ListItemButton>
                    </ListItem>
                </Link>
            </List>
            <Divider />

            <div className="flex flex-col justify-between h-[50vh]">
                <div>
                    <List sx={{ pb: '4px', color: 'red' }} className={`${dashboard ? 'bg-red-400 text-white' : ''}`}>
                        <Link href="/admin/dashboard">
                            <ListItem disablePadding>
                                <ListItemButton>
                                    <ListItemIcon className="min-w-10">
                                        <MdDashboard className={`text-xl ${dashboard ? 'text-white' : 'primary-text'}`} />
                                    </ListItemIcon>
                                    <ListItemText primary="Dashboard" />
                                </ListItemButton>
                            </ListItem>
                        </Link>
                    </List>

                    <List sx={{ pb: '4px', color: 'red' }} className={`${profile ? 'bg-red-400 text-white' : ''}`}>
                        <Link href="/admin/profile" >
                            <ListItem disablePadding>
                                <ListItemButton>
                                    <ListItemIcon className="min-w-10">
                                        <FaUser className={`text-xl ${profile ? 'text-white' : 'primary-text'}`} />
                                    </ListItemIcon>
                                    <ListItemText primary="Profile" />
                                </ListItemButton>
                            </ListItem>
                        </Link>
                    </List>
                </div>

                <List sx={{ pb: '4px', color: 'red' }}>
                    <Link href="/" >
                        <ListItem disablePadding>
                            <ListItemButton>
                                <ListItemIcon className="min-w-10">
                                    <FiLogIn className="text-xl primary-text" />
                                </ListItemIcon>
                                <ListItemText primary="Log Out" />
                            </ListItemButton>
                        </ListItem>
                    </Link>
                </List>
            </div>
        </Box>
    );

    return (
        <div>
            <div className=' bg-red-100 shadow-sm sticky top-0 flex items-center justify-between px-6 p-4 z-50'>
                <div className="flex items-center gap-4">
                    <div className="block md:hidden">
                        <IconButton onClick={toggleDrawer(true)} aria-label="delete" size="large" className="p-0">
                            {
                                !open ?
                                    <IoReorderThree />
                                    :
                                    <IoClose />
                            }
                        </IconButton>
                        <Drawer open={open} onClose={toggleDrawer(false)}>
                            {DrawerList}
                        </Drawer>
                    </div>
                     {Logo && <Image src={Logo} alt="Logo" height={40} />}
                </div>


                <Stack direction="row" spacing={2}>
                    <Avatar alt="User Profile" {...stringAvatar('Zamil Akter')} />
                </Stack>
            </div>

            <div className='flex'>
                <div className='bg-red-50 fixed top-[72px] h-screen w-56 md:block hidden'>
                    <Link href="/user/dashboard" className={`px-7 py-3 ${dashboard ? 'bg-red-400 text-white' : 'text-red-500'} hover:bg-red-500 hover:text-white rounded-md w-full duration-150 flex items-start gap-4`}><MdDashboard className="text-xl" /> Dashboard</Link>

                    <Link href="/user/profile" className={`px-7 py-3 ${profile ? 'bg-red-400 text-white' : 'text-red-500'} hover:bg-red-500 hover:text-white rounded-md w-full duration-150 flex items-start gap-4`}><FaUser className="text-xl" /> Profile</Link>

                    <Divider className="mt-[65vh]" />

                    <Link href="/logout" className={`px-7 py-3 text-red-500 hover:bg-red-500 hover:text-white rounded-md w-full duration-150 flex items-start gap-4`}><FiLogIn className="text-xl" /> Log Out</Link>
                </div>
                <div className='bg-white p-4 ps-7 md:ps-60 w-full'>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default AdminLayout;