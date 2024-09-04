"use client";

import { useEffect, useMemo } from "react";
import { Loader, TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";

import { useGetWorkspace } from "@/features/workspaces/api/useGetWorkspace";
import { useGetChannels } from "@/features/channels/api/useGetChannels";
import { useCreateChannelModal } from "@/features/channels/store/useCreateChannelModal";
import { useCurrentMember } from "@/features/members/api/useCurrentMember";

const WorkspaceIdPage = () => {
    const router = useRouter();
    const workspaceId = useWorkspaceId();
    const [open, setOpen] = useCreateChannelModal();

    const { data: member, isLoading: memberLoading } = useCurrentMember({ workspaceId });
    const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({ id: workspaceId });
    const { data: channel, isLoading: channelLoading } = useGetChannels({ workspaceId });

    const channelId = useMemo(() => {
        return channel?.[0]?._id;
    }, [channel]);

    const isAdmin = useMemo(() => {
        return member?.role === "admin";
    }, [member?.role]);

    useEffect(() => {
        if (workspaceLoading || channelLoading || memberLoading || !member || !workspace) return;

        if (channelId) {
            router.push(`/workspace/${workspaceId}/channel/${channelId}`);
        } else if (!open && isAdmin) {
            setOpen(true);
        }

    }, [channelId, workspace, workspaceLoading, channelLoading, router, workspaceId, open, setOpen, member, memberLoading, isAdmin]);

    if (workspaceLoading || channelLoading || memberLoading) {
        return (
            <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
                <Loader className="size-6 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (!workspace || !member) {
        return (
            <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
                <TriangleAlert className="size-6 animate-spin text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Workspace not found</span>
            </div>
        )
    }

    return (
        <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
            <TriangleAlert className="size-6 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">No channel found</span>
        </div>
    )
}

export default WorkspaceIdPage;
