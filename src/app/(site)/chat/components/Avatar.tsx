'use client'

import { pusherClient } from '@/libs/pusher'
import { Message } from '@prisma/client'
import clsx from 'clsx'
import { format } from 'date-fns/format'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { FaImage } from 'react-icons/fa6'

interface AvatarProps {
    url?: string,
    userId: string,
    name?: string,
    message?: Message,
    isSelected?: boolean
}

function Avatar({ userId, url, name, message, isSelected }: AvatarProps) {
    const [newUrl, setNewUrl] = useState(url || process.env.NEXT_PUBLIC_DEFAULT_AVATAR!);
    const [newName, setNewName] = useState(name);

    useEffect(() => {
        if (userId) {
            pusherClient.subscribe('profiles')

            const handler = (params: { image: string, name: string, userId: string }) => {
                console.log(userId, params.userId, name);

                if (userId === params.userId) {
                    setNewName(params.name);
                    setNewUrl(params.image);
                }
            }

            pusherClient.bind('update', handler)

            return () => {
                pusherClient.unsubscribe('profiles');
                pusherClient.unbind('update', handler);
            }
        }
    }, [userId])

    return (
        <div className={clsx('flex items-center gap-x-6 w-full px-4 md:px-3', isSelected && 'bg-gray-200 dark:bg-slate-600')}>
            <div className='relative rounded-full overflow-hidden h-9 w-9'>
                <Image alt='Avatar' src={newUrl} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" fill />
            </div>
            <div className={clsx("flex-1 flex flex-col gap-2", message && 'pt-2')}>
                <div className='flex justify-between'>
                    <div className="font-semibold">{name ? newName : ''}</div>
                    {
                        message &&
                        <div className='text-sm'>{format(message.createdAt, 'HH:mm')}</div>
                    }
                </div>
                {
                    message &&
                    <div className={clsx('pb-3 text-sm whitespace-nowrap overflow-hidden text-ellipsis', !isSelected && 'border-b-1 border-gray-300')}>{message.image ? <FaImage /> : message.body}</div>
                }
            </div>
        </div>
    )
}

export default Avatar