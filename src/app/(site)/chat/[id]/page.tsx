import React from 'react'
import { User } from '@nextui-org/react';

import Navbar from '../components/Navbar';
import ListDetailChat from '../components/ListDetailChat';
import WrapperBodyChat from '../components/WrapperBodyChat';

import UserAction from '../../../actions/UserAction';
import { getDetailConversation } from '../../../actions/ConversationAction';

async function ChatPage({ params: { id } }: any) {
    const user = await UserAction.validateUser(id);
    const conversations: any = await getDetailConversation(user.id);

    return (
        <WrapperBodyChat id={user.id}>
            <div className='flex flex-col h-screen'>
                <Navbar>
                    <User
                        name={user.name || ''}
                        avatarProps={{ src: user.image || '/images/user-placeholder.png' }}
                    />
                </Navbar>

                <ListDetailChat userId={user.id} conversation={conversations} />
            </div>
        </WrapperBodyChat>
    )
}

export default ChatPage