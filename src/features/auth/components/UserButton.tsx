"use client";

import React from 'react'
import { Loader, LogOut } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useCurrentUser } from '../api/useCurrentUser';
import { useAuthActions } from '@convex-dev/auth/react';

export const UserButton = () => {
    const { signOut } = useAuthActions();
    const { data, isLoading } = useCurrentUser();

    if (isLoading)
        return <Loader className='size-4 animate-spin text-muted-foreground' />

    if (!data)
        return null;

    const { name, image } = data;
    const avatarFallback = name!.charAt(0).toUpperCase();

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger className='outline-none relative'>
                <Avatar className='size-10 transition hover:opacity-75'>
                    <AvatarImage alt='name' src={image} />
                    <AvatarFallback className='bg-sky-500 text-white'>
                        {avatarFallback}
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='center' className='w-60' side='right'>
                <DropdownMenuItem onClick={() => signOut()} className='h-10'>
                    <LogOut className='size-4 mr-2' />
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
