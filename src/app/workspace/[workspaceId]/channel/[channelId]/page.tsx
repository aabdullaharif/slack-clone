"use client";

import { Header } from "./header";
import { Loader, TriangleAlert } from "lucide-react";
import { useChannelId } from "@/hooks/useChannelId";
import { useGetChannel } from "@/features/channels/api/useGetChannel";
import { ChatInput } from "./chat-input";

const ChannelIdPage = () => {
    const channelId = useChannelId();

    const { data: channel, isLoading: channelLoading } = useGetChannel({ id: channelId });

    if (channelLoading) {
        return (
            <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
                <Loader className="size-6 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (!channel) {
        return (
            <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
                <TriangleAlert className="size-6 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Channel not found</span>
            </div>
        )
    }

    return (
        <div className="h-full flex flex-col">
            <Header title={channel.name} />
            <div className="flex-1" />
            <ChatInput placeholder={`Message # ${channel.name}`} />
        </div>
    )
}

export default ChannelIdPage;