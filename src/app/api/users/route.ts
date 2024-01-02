import { NextResponse } from "next/server";
import prisma from '../../../libs/prismadb'
import { getCurrentUser } from "@/app/actions/UserAction";

export async function GET(request: Request, params: string) {
    try {
        const currentUser = await getCurrentUser();
        const { searchParams } = new URL(request.url)
        const q = searchParams.get('q') || ''

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
                            email: currentUser?.email
                        },
                    }
                ]
            },
            take: 30,
        })

        return Response.json(users);
    } catch (error) {
        return new NextResponse(JSON.stringify(error), { status: 500 });
    }
}