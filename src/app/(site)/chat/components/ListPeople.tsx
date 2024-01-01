'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import { format } from 'date-fns/format';
import clsx from 'clsx';
import { Message, User } from '@prisma/client';

import Avatar from './Avatar';
import { pusherClient } from '../../../../libs/pusher';
import { FaImage } from 'react-icons/fa6';

interface CompositeMessage extends Message {
    receiver?: User,
    sender?: User,
}

type ListPeopleProps = {
    data: CompositeMessage[],
    userIdLogin: string,
    userIdDestination?: string
}

export default function ListPeople({ data, userIdLogin, userIdDestination }: ListPeopleProps) {
    const router = useRouter();

    const [dataPeople, setDataPeople] = useState(data)

    const addOptimistic = (newData: Message) => {
        setDataPeople((state: Message[]) => {
            const index = state.findIndex((d: Message) => d.conversationId === newData.conversationId)
            if (index != -1) {
                state[index].body = newData.body;
                state[index].createdAt = newData.createdAt;
                state.sort((a: any, b: any) => b.createdAt - a.createdAt)

                return [...state];
            }

            return [...state, newData]
        })
    }

    useEffect(() => {
        pusherClient.subscribe(userIdLogin)

        const handler = (message: Message) => {
            addOptimistic({ ...message })
        }

        pusherClient.bind('lastMessage:update', handler)

        return () => {
            pusherClient.unsubscribe(userIdLogin);
            pusherClient.unbind('lastMessage:update', handler);
        }
    }, [userIdLogin])

    return (
        dataPeople.map((d: CompositeMessage, i: number) => {
            const userDest = (d.senderId === userIdLogin ? d.receiver : d.sender) as User;

            return (
                <div key={i} onClick={() => router.push(`/chat/${userDest.id}`)} className={clsx('px-2 flex gap-x-4 items-center hover:cursor-pointer', userDest.id == userIdDestination && 'bg-gray-200 dark:bg-slate-600')}>
                    <Avatar url={userDest.image} />

                    <div className="w-4/5 flex flex-col gap-2 pt-2">
                        <div className='flex justify-between'>
                            <div className="font-semibold">{userDest.name}</div>
                            <div className='text-sm'>{format(d.createdAt, 'HH:mm')}</div>
                        </div>
                        <div className={clsx('pb-3 text-sm whitespace-nowrap overflow-hidden text-ellipsis', userDest.id != userIdDestination && 'border-b-1 border-gray-300')}>{d.image ? <FaImage /> : d.body}</div>
                    </div>
                </div>
            )
        })
    )
}
