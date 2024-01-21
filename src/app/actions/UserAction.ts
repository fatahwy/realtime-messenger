'use server'

import { redirect } from 'next/navigation';
import mongoose from 'mongoose';
import getSession from './getSession';
import prisma from '../../libs/prismadb'
import { pusherServer } from '../../libs/pusher';

export const getCurrentUser = async () => {
    try {
        const session = await getSession();

        if (!session?.user?.email) {
            redirect('/')
        }

        const currentUser = await prisma.user.findUnique({
            where: {
                email: session.user.email
            }
        })

        if (!currentUser) {
            redirect('/')
        }

        return currentUser;
    } catch (error: any) {
        console.log({ error });
    }
    redirect('/')
}

export async function updateUser(data: { image: string, name: string, userId?: string }) {
    const currentUser = await getCurrentUser();

    try {
        if (currentUser.name !== data.name || currentUser.image !== data.image) {
            const res = await prisma.user.update({
                where: {
                    id: currentUser.id
                },
                data
            })

            data.userId = currentUser.id;
            await pusherServer.trigger('profiles', 'update', data)
        }

        return true;
    } catch (error) {
        console.error(error)
    }

    return false;
}

export async function validateUser(id: string) {
    const session = await getSession();

    if (!session?.user?.email || !mongoose.isValidObjectId(id)) {
        redirect('/chat')
    }

    const user = await prisma.user.findUnique({
        where: {
            id
        }
    })

    if (user) {
        return user;
    }

    redirect('/chat')
}

export async function getUsers(q = '') {
    const session = await getSession();

    if (!session?.user?.email) {
        return [];
    }

    try {
        const users = await prisma.user.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            where: {
                AND: [
                    {
                        OR: [
                            {
                                email: {
                                    contains: q
                                }
                            },
                            {
                                name: {
                                    contains: q
                                }
                            }
                        ]
                    },
                    {
                        NOT: {
                            email: session.user.email
                        },
                    }
                ],
            }
        })

        return users;
    } catch (error: any) {
        return [];
    }
}