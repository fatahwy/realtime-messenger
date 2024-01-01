'use client';

import React, { useEffect, useState } from 'react'

import { BsGoogle } from "react-icons/bs";
import toast from 'react-hot-toast';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { CircularProgress } from '@nextui-org/react';

function AuthForm() {
    const { status } = useSession();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (status === 'authenticated') {
            router.push('/chat');
            return;
        }
        setIsLoading(false)
    }, [status, router])

    const socialAction = async (action: string) => {
        setIsLoading(true);

        await signIn(action, { redirect: false })
            .then((callback) => {
                if (callback?.error) {
                    toast.error('Invalid credentials')
                }

                if (callback?.ok) {
                    toast.success('Logged in!')
                    router.push('/chat');
                    return;
                }
            })
            .finally(() => setIsLoading(false))
    }

    return (
        <div className="flex min-h-screen flex-col justify-center bg-gray-100 ">
            <div className='mt-4 sm:mx-auto sm:max-w-md'>
                <div className="flex flex-col gap-4 items-center">
                    <Image
                        alt="Logo"
                        height='50'
                        width='50'
                        className="mx-auto w-auto"
                        src='/images/logo.png'
                    />
                    <h2 className="text-center text-3xl font-bold text-gray-900">Messenger</h2>
                    {
                        ['loading', 'authenticated'].includes(status) ? <CircularProgress aria-label="Loading..." /> :
                            <button
                                disabled={isLoading}
                                onClick={() => socialAction('google')}
                                className='inline-flex items-center rounded-full gap-2 text-gray-900 bg-white px-4 py-3 shadow-sm hover:bg-gray-50 '>
                                <BsGoogle /> Login with Google
                            </button>
                    }
                </div>
            </div>
        </div>
    )
}

export default AuthForm