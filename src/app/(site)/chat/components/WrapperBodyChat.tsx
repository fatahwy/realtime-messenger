import React, { FC, ReactNode } from 'react'

import Avatar from './Avatar';
import ModalSearchUser from './ModalSearchUser';
import DropdownSetting from './DropdownSetting';
import Navbar from './Navbar';
import ListPeople from './ListPeople';

import UserAction from '../../../actions/UserAction';
import { listPeopleConversation } from '../../../actions/ConversationAction';

interface WrapperBodyChat {
    children: ReactNode,
    id?: string
}

const WrapperBodyChat: FC<WrapperBodyChat> = async ({ children, id }) => {
    const currentUser = await UserAction.getCurrentUser();
    const listPeople = await listPeopleConversation()

    return (
        <div className='h-screen w-full md:max-w-6xl md:mx-auto flex'>
            <div className='w-full md:w-4/12 bg-gray-100 dark:bg-slate-950 shadow-md shadow-gray-300 dark:shadow-none'>
                <div className='flex flex-col h-screen'>
                    <Navbar>
                        <div className='text-xl'>
                            <Avatar url={currentUser?.image || ''} />
                        </div>
                        <div className='flex items-center gap-x-4'>
                            <ModalSearchUser />
                            <DropdownSetting />
                        </div>
                    </Navbar>
                    <div className='p-1 flex-1 overflow-y-auto'>
                        <ListPeople data={listPeople} userIdLogin={currentUser?.id || ''} userIdDestination={id} />
                    </div>
                </div>
            </div>
            <div className='hidden md:w-8/12 md:block bg-gray-50 dark:bg-slate-800 shadow-md shadow-gray-300 dark:shadow-none'>
                {children}
            </div>
        </div>
    )
}

export default WrapperBodyChat