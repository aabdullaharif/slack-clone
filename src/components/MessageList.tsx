import { Message } from "./Message";
import { differenceInMinutes, format, isToday, isYesterday } from "date-fns";
import { GetMessagesReturnType } from "@/features/members/api/useGetMessages";

const TIME_THRESHOLD = 5;

interface MessageListProps {
    memberName?: string;
    memberImage?: string;
    channelName?: string;
    channelCreationTime?: number;
    variant?: "channel" | "thread" | "conversation";
    data: GetMessagesReturnType | undefined;
    loadMore: () => void;
    isLoadingMore: boolean;
    canLoadMore: boolean;
}

const formatDateLabel = (dateKey: string) => {
    const date = new Date(dateKey);
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "EEEE, MMMM d");
}

export const MessageList = ({ memberName, memberImage, channelName, channelCreationTime, variant, data, loadMore, isLoadingMore, canLoadMore }: MessageListProps) => {

    const groupMessages = data?.reduce((groups, messages) => {
        const date = new Date(messages._creationTime);
        const dateKey = format(date, "yyyy-MM-dd");
        if (!groups[dateKey]) {
            groups[dateKey] = [];
        }
        groups[dateKey].unshift(messages);
        return groups;
    }, {} as Record<string, GetMessagesReturnType>);

    return (
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
                                isAuthor={false}
                                reactions={message.reactions}
                                body={message.body}
                                image={message.image}
                                updatedAt={message.updatedAt}
                                createdAt={message._creationTime}
                                isEditing={false}
                                setEditingId={() => { }}
                                isCompact={isCompact}
                                hideThreadButton={false}
                                threadCount={message.threadCount}
                                threadImage={message.threadImage}
                                threadTimeStamp={message.threadTimeStamp}
                            />
                        );
                    })}
                </div>
            ))}
        </div>
    )
}
