import { redirect } from 'next/navigation';
import prisma from '../../libs/prismadb'
import getSession from './getSession';
import mongoose from 'mongoose';

const getCurrentUser = async () => {
    try {
        const session = await getSession();

        if (!session?.user?.email) {
            return null;
        }

        const currentUser = await prisma.user.findUnique({
            where: {
                email: session.user.email
            }
        })

        if (!currentUser) {
            return null;
        }

        return currentUser;
    } catch (error: any) {
        return null;
    }
}

async function validateUser(id: string) {
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

async function getUsers() {
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
                NOT: {
                    email: session.user.email
                }
            }
        })

        return users;
    } catch (error: any) {
        return [];
    }
}


export default {
    getCurrentUser,
    validateUser,
    getUsers,
};