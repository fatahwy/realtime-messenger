'use client'

import React, { useEffect, useState } from 'react'
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { signOut } from 'next-auth/react'
import { useTheme } from "next-themes";
import { useModalChangeProfile } from '@/stores/store'

import ModalChangProfile from './ModalChangProfile'

function DropdownSetting() {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();
    const profile = useModalChangeProfile();

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return (
        <>
            <Dropdown>
                <DropdownTrigger>
                    <button title='Setting'>
                        <BsThreeDotsVertical />
                    </button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Static Actions">
                    <DropdownItem textValue='changeprofile' key="changeprofile" onClick={() => profile.toggle()}>
                        Change Profile
                    </DropdownItem>
                    <DropdownItem textValue='theme' key="theme" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>Set Theme {theme === 'dark' ? 'Light' : 'Dark'}</DropdownItem>
                    <DropdownItem textValue='delete' key="delete" onClick={() => signOut()}>
                        Logout
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
            <ModalChangProfile />
        </>
    )
}

export default DropdownSetting