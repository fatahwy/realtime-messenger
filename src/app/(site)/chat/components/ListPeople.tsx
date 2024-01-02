'use client'

import React, { useEffect, useState } from 'react'
import clsx from 'clsx';
import Link from 'next/link';
import { Message, User } from '@prisma/client';

import Avatar from './Avatar';
import { pusherClient } from '../../../../libs/pusher';

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
    const [dataPeople, setDataPeople] = useState(data)

    const addOptimistic = (newData: CompositeMessage) => {
        setDataPeople((state: CompositeMessage[]) => {
            const index = state.findIndex((d: CompositeMessage) => d.conversationId === newData.conversationId)

            if (index >= 0) {
                state[index].body = newData.body || state[index].body;
                state[index].createdAt = newData.createdAt || state[index].createdAt;
                state.sort((a: any, b: any) => b.createdAt - a.createdAt)
            } else if ([newData.receiverId, newData.senderId].includes(userIdLogin)) {
                state.push(newData)
            }
            state.sort((a: any, b: any) => b.createdAt - a.createdAt)

            return [...state];
        })
    }

    useEffect(() => {
        pusherClient.subscribe('messages')
    
        const handler = (message: CompositeMessage) => {
            addOptimistic(message)
        }

        pusherClient.bind('new', handler)

        return () => {
            pusherClient.unsubscribe('messages');
            pusherClient.unbind('new', handler);
        }
    }, [userIdLogin])

    return (
        dataPeople.map((d: CompositeMessage, i: number) => {
            const userDest = (d.senderId === userIdLogin ? d.receiver : d.sender) as User;

            return (
                <Link key={i} href={`/chat/${userDest.id}`}>
                    <Avatar userId={userDest.id} url={userDest.image!} name={userDest.name!} message={d} isSelected={userDest.id == userIdDestination}  />
                </Link>
            )
        })
    )
}
