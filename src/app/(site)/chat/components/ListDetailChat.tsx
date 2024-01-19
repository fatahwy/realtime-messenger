'use client'

import { Chip, Textarea } from '@nextui-org/react'
import { Message } from '@prisma/client'
import clsx from 'clsx'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { FaRegImage } from 'react-icons/fa6'
import { IoSendSharp } from 'react-icons/io5'
import { format } from 'date-fns'
import { CldUploadButton } from 'next-cloudinary'
import ImagePreview from './ImagePreview'
import { pusherClient } from '../../../../libs/pusher'
import { sendMessage } from '../../../actions/ConversationAction'

interface ListDetailChatProps {
    userId: string
    conversation: { id: string, data: Message[] }
}

function ListDetailChat({ userId, conversation }: ListDetailChatProps) {
    const [message, setMessage] = useState('')
    const [optimisticMessages, setMessages] = useState(conversation.data)

    const addOptimisticMessage = (newData: any) => {
        setMessages((state: Message[]) => [...state, newData])
    }

    const chatContainerRef: any = useRef(null);

    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [userId, optimisticMessages]);

    useEffect(() => {
        pusherClient.subscribe('messages')

        const messageHandler = (message: Message) => {
            if (conversation.id === message.conversationId && message.receiverId != userId) {
                addOptimisticMessage({ ...message })
            }
        }

        pusherClient.bind('new', messageHandler)

        return () => {
            pusherClient.unsubscribe('messages');
            pusherClient.unbind('messages:new', messageHandler);
        }
    }, [conversation.id])

    const sendMsg = async () => {
        if (message) {
            addOptimisticMessage({
                id: '',
                receiverId: userId,
                body: message,
                image: '',
                createdAt: new Date(),
                conversationId: '',
                senderId: ''
            })
            setMessage('')
            await sendMessage(userId, message);
        }
    }

    const handleTyping = (event: any) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendMsg();
        }
    };

    const handleUpload = async (result: any) => {
        addOptimisticMessage({
            receiverId: userId,
            body: '',
            image: result?.info?.secure_url,
            createdAt: new Date(),
            id: '',
            conversationId: '',
            senderId: ''
        })
        await sendMessage(userId, '', result?.info?.secure_url);
    }

    const chats = useMemo(() => {
        let date = ''
        return optimisticMessages.map((d: Message, i: number) => {
            const dateMsg = format(d.createdAt, 'dd MMM yyyy');
            let showDate = false;

            if (date !== dateMsg) {
                date = dateMsg;
                showDate = true;
            }

            return (
                <aside key={i}>
                    {showDate && <div className='text-center'><Chip size='sm' className='bg-gray-200 dark:bg-slate-900'>{dateMsg}</Chip></div>}
                    <div className={clsx('flex mb-1', d.senderId == userId ? 'justify-start' : 'justify-end')}>
                        <div className='p-2 flex-col bg-gray-100 dark:bg-slate-900 rounded-lg max-w-[45%]'>
                            {
                                d.image ? <ImagePreview src={d.image} /> : <div className='text-medium'>{d.body}</div>
                            }
                            <div className='font-extralight text-sm text-right'>{format(d.createdAt, 'HH:mm')}</div>
                        </div>
                    </div>
                </aside>
            )
        })
    }, [optimisticMessages, userId])

    return (
        <>
            <div className='p-3 flex-1 overflow-y-auto' ref={chatContainerRef}>
                {chats}
            </div>
            <div className='flex gap-x-4 px-2 pt-2 pb-5 dark:bg-slate-700'>
                <CldUploadButton
                    options={{ maxFiles: 1 }}
                    onUpload={handleUpload}
                    uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_PRESET}
                >
                    <FaRegImage className="text-2xl text-default-400" />
                </CldUploadButton>
                <Textarea
                    value={message}
                    onValueChange={setMessage}
                    autoFocus
                    minRows={1}
                    placeholder="Type a message"
                    onKeyDown={handleTyping}
                />
                <button onClick={() => sendMsg()}>
                    <IoSendSharp className="text-2xl text-default-400" />
                </button>
            </div>
        </>
    )
}

export default ListDetailChat