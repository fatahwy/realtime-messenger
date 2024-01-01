import Image from 'next/image'
import React from 'react'

interface AvatarProps {
    url?: string | null
}

function Avatar({ url }: AvatarProps) {
    return (
        <div className='relative rounded-full overflow-hidden h-9 w-9'>
            <Image alt='Avatar' src={url || '/images/user-placeholder.png'} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" fill />
        </div>
    )
}

export default Avatar