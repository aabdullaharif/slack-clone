import React from 'react'
import { AlertTriangle, HashIcon, Loader, MessageSquareTextIcon, SendHorizonalIcon } from 'lucide-react';

import { WorkspaceHeader } from './workspace-header';
import { SidebarItem } from './sidebar-item';
import { WorkspaceSection } from './workspace-section';
import { UserItem } from './user-item';

import { useChannelId } from '@/hooks/useChannelId';
import { useWorkspaceId } from '@/hooks/useWorkspaceId';
import { useCurrentMember } from '@/features/members/api/useCurrentMember';
import { useGetWorkspace } from '@/features/workspaces/api/useGetWorkspace';
import { useGetChannels } from '@/features/channels/api/useGetChannels';
import { useGetMembers } from '@/features/members/api/useGetMembers';

import { useCreateChannelModal } from '@/features/channels/store/useCreateChannelModal';

const WorkspaceSidebar = () => {
    const workspaceId = useWorkspaceId();
    const channelId = useChannelId();

    const [_open, setOpen] = useCreateChannelModal();

    const { data: member, isLoading: memberLoading } = useCurrentMember({ workspaceId });
    const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({ id: workspaceId });
    const { data: channels, isLoading: channelsLoading } = useGetChannels({ workspaceId });
    const { data: members, isLoading: membersLoading } = useGetMembers({ workspaceId });

    if (memberLoading || workspaceLoading) {
        return (
            <div className='flex flex-col bg-[#5e2c5f] h-full items-center justify-center'>
                <Loader className='size-5 animate-spin text-white' />
            </div>
        )
    }

    if (!member || !workspace) {
        return (
            <div className='flex flex-col gap-y-2 bg-[#5e2c5f] h-full items-center justify-center'>
                <AlertTriangle className='size-5 text-white' />
                <p className='text-white text-sm'>
                    Workspace not found
                </p>
            </div>
        )
    }

    return (
        <div className='flex flex-col gap-y-2 bg-[#5e2c5f] h-full'>
            <WorkspaceHeader workspace={workspace} isAdmin={member.role === "admin"} />
            <div className='flex flex-col px-2 mt-3'>
                <SidebarItem
                    label="Threads"
                    icon={MessageSquareTextIcon}
                    id="threads"
                />
                <SidebarItem
                    label="Drafts & Sent"
                    icon={SendHorizonalIcon}
                    id="drafts"
                />
            </div>
            <WorkspaceSection
                label="Channels"
                hint="New channel"
                onNew={member.role === "admin" ? () => setOpen(true) : undefined}
            >
                {channels?.map((item) => (
                    <SidebarItem
                        key={item._id}
                        label={item.name}
                        icon={HashIcon}
                        id={item._id}
                        variant={channelId === item._id ? "active" : "default"}
                    />
                ))}
            </WorkspaceSection>

            <WorkspaceSection
                label='Direct Messages'
                hint='New DM'
                onNew={() => { }}
            >
                {members?.map((item) => (
                    <UserItem
                        key={item._id}
                        id={member._id}
                        image={item.user.image}
                        label={item.user.name}
                    />
                ))}
            </WorkspaceSection>
        </div>
    )
}

export default WorkspaceSidebar;