import React from 'react'
import Link from 'next/link';
import { IoArrowBackSharp } from 'react-icons/io5';

import Navbar from '../components/Navbar';
import ListDetailChat from '../components/ListDetailChat';
import WrapperBodyChat from '../components/WrapperBodyChat';
import Avatar from '../components/Avatar';

import { validateUser } from '../../../actions/UserAction';
import { getDetailConversation } from '../../../actions/ConversationAction';

async function ChatPage({ params: { id } }: any) {
    const user = await validateUser(id);
    const conversations: any = await getDetailConversation(user.id);

    return (
        <WrapperBodyChat id={user.id}>
            <div className='flex flex-col h-screen'>
                <Navbar>
                    <div className='flex items-center gap-x-8'>
                        <button className='md:hidden'>
                            <Link href='/chat'>
                                <IoArrowBackSharp className='text-2xl' />
                            </Link>
                        </button>
                        <Avatar userId={user.id} name={user.name!} url={user.image || '/images/user-placeholder.png'} />
                    </div>
                </Navbar>

                <ListDetailChat userId={user.id} conversation={conversations} />
            </div>
        </WrapperBodyChat>
    )
}

export default ChatPage