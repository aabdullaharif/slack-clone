import React, { useState } from 'react'
import { ChevronDownIcon, ListFilterIcon, SquarePenIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import Hint from '@/components/Hint'
import { PreferencesModal } from './preferences-modal'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

import { Doc } from '../../../../convex/_generated/dataModel'

interface WorkspaceHeaderProps {
    workspace: Doc<"workspaces">;
    isAdmin: boolean;
}
const WorkspaceHeader = ({ workspace, isAdmin }: WorkspaceHeaderProps) => {
    const [preferencesOpen, setPreferencesOpen] = useState(false);

    return (
        <>
            <PreferencesModal
                open={preferencesOpen}
                setOpen={setPreferencesOpen}
                initialValue={workspace.name}
            />
            <div className='flex items-center justify-between gap-0.5 px-4 h-[49px]'>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="transparent"
                            size="sm"
                            className='font-semibold text-lg w-auto p-1.5 overflow-hidden'
                        >
                            <span className='truncate'>{workspace.name}</span>
                            <ChevronDownIcon className='size-4 shrink-0 ml-1' />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side='bottom' align='start' className='w-64'>
                        <DropdownMenuItem className='cursor-pointer capitalize'>
                            <div className='size-9 relative overflow-hidden text-white font-semibold text-xl rounded-md flex items-center justify-center mr-2 bg-[#616061]'>
                                {workspace.name.charAt(0).toUpperCase()}
                            </div>
                            <div className='flex flex-col items-start'>
                                <p className='font-bold'>{workspace.name}</p>
                                <p className='text-xs text-muted-foreground'>Active workspace</p>
                            </div>
                        </DropdownMenuItem>
                        {
                            isAdmin && (
                                <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className='cursor-pointer py-2' onClick={() => { }}>
                                        Invite people to {workspace.name}
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className='cursor-pointer py-2' onClick={() => { setPreferencesOpen(true) }}>
                                        Preferences
                                    </DropdownMenuItem>
                                </>
                            )
                        }
                    </DropdownMenuContent>
                </DropdownMenu>
                <div className='flex items-center gap-0.5'>
                    <Hint label='Filter conversations' side='bottom'>
                        <Button variant='transparent' size='iconSm'>
                            <ListFilterIcon className='size-4' />
                        </Button>
                    </Hint>
                    <Hint label='New message' side='bottom'>
                        <Button variant='transparent' size='iconSm'>
                            <SquarePenIcon className='size-4' />
                        </Button>
                    </Hint>
                </div>
            </div>
        </>
    )
}

export default WorkspaceHeader