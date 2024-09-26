import Quill from "quill";
import { toast } from "sonner";
import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
    AlertTriangle,
    Loader,
    XIcon
} from "lucide-react";
import { differenceInMinutes, format, isToday, isYesterday } from "date-fns";
import { Button } from "@/components/ui/button";
import { Message } from "@/components/Message";

import { Id } from "../../../../convex/_generated/dataModel";
import { useCurrentMember } from "../api/useCurrentMember";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";
import { useChannelId } from "@/hooks/useChannelId";

import { useGetMessage } from "@/features/messages/api/useGetMessage";
import { useCreateMessage } from "@/features/messages/api/useCreateMessage";
import { useGenerateUploadUrl } from "@/features/upload/api/useGenerateUploadUrl";
import { useGetMessages } from "@/features/messages/api/useGetMessages";

const Editor = dynamic(() => import('@/components/Editor'), { ssr: false })

const TIME_THRESHOLD = 5;

interface ThreadProps {
    messageId: Id<"messages">;
    onClose: () => void;
}

type CreateMessageValues = {
    channelId: Id<"channels">;
    workspaceId: Id<"workspaces">;
    parentMessageId: Id<"messages">;
    body: string;
    image: Id<"_storage"> | undefined;
}

const formatDateLabel = (dateKey: string) => {
    const date = new Date(dateKey);
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "EEEE, MMMM d");
}

export const Thread = ({ messageId, onClose }: ThreadProps) => {
    const channelId = useChannelId();
    const workspaceId = useWorkspaceId();
    const [editedId, setEditedId] = useState<Id<"messages"> | null>(null);
    const [editorKey, setEditorKey] = useState(0);
    const [isPending, setIsPending] = useState(false);
    const editorRef = useRef<Quill | null>(null);

    const { data: currentMember } = useCurrentMember({ workspaceId });
    const { data: message, isLoading: loadingMessage } = useGetMessage({ id: messageId });
    const { results, status, loadMore } = useGetMessages({
        channelId,
        parentMessageId: messageId,
    });

    const canLoadMore = status === "CanLoadMore";
    const isLoadingMore = status === "LoadingMore";

    const { mutate: createMessage } = useCreateMessage();
    const { mutate: generateUploadUrl } = useGenerateUploadUrl();

    const handleSubmit = async ({ body, image }: { body: string, image: File | null }) => {
        try {
            setIsPending(true);
            editorRef?.current?.enable(false);

            const values: CreateMessageValues = {
                channelId,
                workspaceId,
                parentMessageId: messageId,
                body,
                image: undefined
            }

            if (image) {
                const url = await generateUploadUrl({}, { throwError: true });
                if (!url) throw new Error("Failed to generate upload url");

                const results = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": image.type
                    },
                    body: image
                });

                if (!results.ok) throw new Error("Failed to upload image");

                const { storageId } = await results.json();
                values.image = storageId;
            }

            await createMessage(values, { throwError: true });

            setEditorKey((key) => key + 1);
        } catch (error) {
            toast.error("Failed to send message");
        } finally {
            setIsPending(false);
            editorRef?.current?.enable(true);
        }
    }

    const groupMessages = results?.reduce((groups, messages) => {
        const date = new Date(messages._creationTime);
        const dateKey = format(date, "yyyy-MM-dd");
        if (!groups[dateKey]) {
            groups[dateKey] = [];
        }
        groups[dateKey].unshift(messages);
        return groups;
    }, {} as Record<string, typeof results>);

    if (loadingMessage || status === "LoadingFirstPage") {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader className="size-5 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (!message) {
        return (
            <div className="flex h-full flex-col">
                <div className="flex justify-between items-center px-4 h-[49px] border-b">
                    <p className="text-lg font-bold">Thread</p>
                    <Button onClick={onClose} size="iconSm" variant="ghost">
                        <XIcon className="size-5 stroke-[1.5]" />
                    </Button>
                </div>
                <div className="flex h-full items-center flex-col gap-y-2 justify-center">
                    <AlertTriangle className="size-5 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Message not found</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex h-full flex-col">
            <div className="flex justify-between items-center px-4 h-[49px] border-b">
                <p className="text-lg font-bold">Thread</p>
                <Button onClick={onClose} size="iconSm" variant="ghost">
                    <XIcon className="size-5 stroke-[1.5]" />
                </Button>
            </div>
            <div className="flex flex-1 flex-col-reverse pb-4 overflow-y-auto messages-scrollbar">
                {Object.entries(groupMessages || {}).map(([dateKey, messages]) => (
                    <div key={dateKey}>
                        <div className="text-center my-2 relative">
                            <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
                            <span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border-gray-300 shadow-sm">
                                {formatDateLabel(dateKey)}
                            </span>
                        </div>
                        {messages.map((message, index) => {
                            const previousMessage = messages[index - 1];
                            const isCompact = previousMessage && previousMessage.user?._id === message.user?._id && differenceInMinutes(
                                new Date(message._creationTime),
                                new Date(previousMessage._creationTime),
                            ) < TIME_THRESHOLD;

                            return (
                                <Message
                                    key={message._id}
                                    id={message._id}
                                    memberId={message.memberId}
                                    authorImage={message.user.image}
                                    authorName={message.user.name}
                                    isAuthor={message.memberId === currentMember?._id}
                                    reactions={message.reactions}
                                    body={message.body}
                                    image={message.image}
                                    updatedAt={message.updatedAt}
                                    createdAt={message._creationTime}
                                    isEditing={editedId === message._id}
                                    setEditingId={setEditedId}
                                    isCompact={isCompact}
                                    hideThreadButton
                                    threadCount={message.threadCount}
                                    threadImage={message.threadImage}
                                    threadTimeStamp={message.threadTimeStamp}
                                />
                            );
                        })}
                    </div>
                ))}
                <div
                    className="h-1"
                    ref={(el) => {
                        if (el) {
                            const observer = new IntersectionObserver(([entry]) => {
                                if (entry.isIntersecting && canLoadMore) {
                                    loadMore();
                                }
                            }, { threshold: 1.0 });

                            observer.observe(el);
                            return () => observer.disconnect();
                        }
                    }}
                />
                {
                    isLoadingMore && (
                        <div className="text-center my-2 relative">
                            <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
                            <span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border-gray-300 shadow-sm">
                                <Loader className="size-4 animate-spin" />
                            </span>
                        </div>
                    )
                }
                <Message
                    hideThreadButton
                    memberId={message.memberId}
                    authorImage={message.user.image}
                    authorName={message.user.name}
                    isAuthor={message.memberId === currentMember?._id}
                    body={message.body}
                    image={message.image}
                    createdAt={message._creationTime}
                    updatedAt={message.updatedAt}
                    id={message._id}
                    reactions={message.reactions}
                    isEditing={editedId === message._id}
                    setEditingId={setEditedId}
                />
            </div>
            <div className="px-4">
                <Editor
                    key={editorKey}
                    onSubmit={handleSubmit}
                    disabled={isPending}
                    placeholder="Reply..."
                    defaultValue={[]}
                    innerRef={editorRef}
                />
            </div>
        </div>
    )
}