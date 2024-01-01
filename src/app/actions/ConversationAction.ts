'use server'

import UserAction from './UserAction';
import prisma from '../../libs/prismadb'
import { pusherServer } from '../../libs/pusher';

export const sendMessage = async (idUser: string, message: string, image?: string) => {
    const currentUser = await UserAction.getCurrentUser();
    const userDest = await UserAction.validateUser(idUser);

    if (currentUser && userDest) {
        const conversationId = [currentUser.id, userDest.id].sort().join('');

        const model = await prisma.message.create({
            data: {
                body: message,
                senderId: currentUser.id,
                receiverId: userDest.id,
                conversationId,
                image
            }
        })

        await pusherServer.trigger(conversationId, 'messages:new', model)
        await pusherServer.trigger([currentUser.id, userDest.id], 'lastMessage:update', model)
    }
}

export const listPeopleConversation = async () => {
    const currentUser = await UserAction.getCurrentUser();

    if (currentUser) {
        try {
            const conversations = await prisma.message.findMany({
                distinct: ['conversationId'],
                where: {
                    OR: [
                        {
                            senderId: currentUser.id,
                        },
                        {
                            receiverId: currentUser.id,
                        },
                    ]
                },
                orderBy: {
                    createdAt: 'desc'
                },
                include: {
                    receiver: true,
                    sender: true,
                }
            })

            return conversations
        } catch (error) {
            console.error('Error:', error);
        }
    }

    return []
}

export const getDetailConversation = async (id: string) => {
    const currentUser = await UserAction.getCurrentUser();
    const userDest = await UserAction.validateUser(id);

    if (currentUser && userDest) {
        const conversations = await prisma.message.findMany({
            where: {
                OR: [
                    {
                        AND: [
                            {
                                senderId: currentUser.id,
                            },
                            {
                                receiverId: userDest.id,
                            }
                        ]
                    },
                    {
                        AND: [
                            {
                                receiverId: currentUser.id,
                            },
                            {
                                senderId: userDest.id,
                            }
                        ]
                    },
                ]

            },
            take: 100
        })

        return {
            id: [currentUser.id, userDest.id].sort().join(''),
            data: conversations,
        }
    }

    return {}
}