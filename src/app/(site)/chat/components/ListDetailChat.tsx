'use client'

import { Chip, CircularProgress, Textarea } from '@nextui-org/react'
import { Message } from '@prisma/client'
import clsx from 'clsx'
import React, { useCallback, useEffect, useMemo, useRef, useState, useTransition } from 'react'
import { FaRegImage } from 'react-icons/fa6'
import { IoSendSharp } from 'react-icons/io5'
import { format } from 'date-fns'
import { CldUploadButton } from 'next-cloudinary'
import ImagePreview from './ImagePreview'
import { pusherClient } from '../../../../libs/pusher'
import { getDetailConversation, sendMessage } from '../../../actions/ConversationAction'
import { Virtuoso } from 'react-virtuoso'

interface ListDetailChatProps {
    userId: string
}

function ListDetailChat({ userId }: ListDetailChatProps) {
    const [page, setPage] = useState(1)
    const [conversationId, setConversationId] = useState('')
    const [totalMessage, setTotalMessage] = useState(0)
    const [message, setMessage] = useState('')
    const [optimisticMessages, setMessages] = useState<any>([])
    const [firstItemIndex, setFirstItemIndex] = useState(100);

    const perPage = 15
    const [isLoading, startTransition] = useTransition();

    const chatContainerRef: any = useRef(null);
    const dataFetchedRef = useRef(false);

    const addOptimisticMessage = (newData: any) => {
        setMessages((state: Message[]) => [...state, newData])

        if (chatContainerRef.current) {
            chatContainerRef.current!.scrollToIndex({
                index: totalMessage,
                behavior: "instant"
            })
        }
    }

    const getConversations = async () => {
        startTransition(async () => {
            const res: any = await getDetailConversation(userId, page, perPage);

            if (!conversationId) {
                setConversationId(res.id)
            }

            setPage((curPage) => (curPage + 1))
            setMessages((state: Message[]) => {
                const newData = [...res.data, ...state];

                setTotalMessage(res.total);
                setFirstItemIndex(res.total - newData.length);
                return newData.sort((a, b) => a.createdAt - b.createdAt)
            })

            setTimeout(() => {
            }, 200)
        })
    }

    useEffect(() => {
        if (page === 1) {
            if (dataFetchedRef.current) return;
            dataFetchedRef.current = true;
        }
        getConversations();
    }, [])

    useEffect(() => {
        pusherClient.subscribe('messages')

        const messageHandler = (message: Message) => {
            if (conversationId === message.conversationId && message.receiverId != userId) {
                addOptimisticMessage({ ...message })
            }
        }

        pusherClient.bind('new', messageHandler)

        return () => {
            pusherClient.unsubscribe('messages');
            pusherClient.unbind('messages:new', messageHandler);
        }
    }, [conversationId])

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

    const itemContent = useCallback((index: number, rowData: any) => rowData, []);

    const listChat = useMemo(() => {
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
                            {<div className='font-extralight text-sm text-right'>{format(d.createdAt, 'HH:mm')}</div>}
                        </div>
                    </div>
                </aside>
            )
        })
    }, [optimisticMessages, userId])

    return (
        <>
            <div id='galleryID' className={clsx('p-3 flex-1 overflow-y-auto')}>
                {
                    isLoading && page === 1 ?
                        <div className='flex justify-center mb-5'>
                            <CircularProgress aria-label="Loading..." />
                        </div>
                        :
                        <Virtuoso
                            ref={chatContainerRef}
                            initialTopMostItemIndex={listChat.length - 1}
                            firstItemIndex={Math.max(0, firstItemIndex)}
                            itemContent={itemContent}
                            data={listChat}
                            startReached={getConversations}
                        />
                }
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