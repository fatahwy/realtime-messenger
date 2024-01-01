import { getServerSession } from "next-auth";
import { authOptions } from '../../libs/nextauth'

export default async function getSession() {
    return await getServerSession(authOptions);
}