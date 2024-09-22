import { toast } from "sonner";
import dynamic from "next/dynamic";

import Hint from "./Hint";
import { Toolbar } from "./Toolbar";
import { Thumbnail } from "./Thumbnail";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

import { cn } from "@/lib/utils";
import { useConfirm } from "@/hooks/useConfirm";

import { format, isToday, isYesterday } from "date-fns";
import { Doc, Id } from "../../convex/_generated/dataModel";
import { useUpdateMessage } from "@/features/messages/api/useUpdateMessage";
import { useRemoveMessage } from "@/features/messages/api/useRemoveMessage";

const Renderer = dynamic(() => import("@/components/Renderer"), { ssr: false });
const Editor = dynamic(() => import("@/components/Editor"), { ssr: false });

interface MessageProps {
    id: Id<"messages">;
    memberId: Id<"members">;
    authorImage?: string;
    authorName?: string;
    isAuthor: boolean;
    reactions: Array<
        Omit<Doc<"reactions">, "memberId"> & {
            count: number;
            memberIds: Id<"members">[];
        }
    >;
    body: Doc<"messages">["body"];
    image: string | null | undefined;
    updatedAt: Doc<"messages">["updatedAt"];
    createdAt: Doc<"messages">["_creationTime"];
    isEditing: boolean;
    setEditingId: (id: Id<"messages"> | null) => void;
    isCompact?: boolean;
    hideThreadButton?: boolean;
    threadCount?: number;
    threadImage?: string;
    threadTimeStamp?: number;
}

const formatFullTime = (date: Date) => {
    return `${isToday(date) ? "Today" : isYesterday(date) ? "Yesterday" : format(date, "MMM d, yyyy")} at ${format(date, "h:mm:ss a")}`;
}

export const Message = ({
    id,
    memberId,
    authorImage,
    authorName = "Member",
    isAuthor,
    reactions,
    body,
    image,
    updatedAt,
    createdAt,
    isEditing,
    setEditingId,
    isCompact,
    hideThreadButton,
    threadCount,
    threadImage,
    threadTimeStamp,
}
    : MessageProps
) => {
    const avatarFallback = authorName.charAt(0).toUpperCase();
    const [ConfirmDialog, confirm] = useConfirm(
        "Delete message",
        "Are you sure you want to delete this message?",
    );
    const { mutate: updateMessage, isPending: isUpdatingMessage } = useUpdateMessage();
    const { mutate: removeMessage, isPending: isRemovingMessage } = useRemoveMessage();

    const isPending = isUpdatingMessage;

    const handleUpdate = ({ body }: { body: string }) => {
        updateMessage({ id, body }, {
            onSuccess: () => {
                toast.success("Message updated successfully");
                setEditingId(null);
            },
            onError: () => {
                toast.error("Failed to update message");
            },
        });
    }

    const handleRemove = async () => {
        const ok = await confirm();
        if (!ok) return;

        removeMessage({ id }, {
            onSuccess: () => {
                toast.success("Message deleted successfully");
                // TODO
            },
            onError: (e) => {
                console.log(e)
                toast.error("Failed to delete message");
            },
        });
    }

    if (isCompact) {
        return (
            <>
                <ConfirmDialog />
                <div className={cn(
                    "flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative",
                    isEditing && "bg-[#f2c74433] hover:bg-[#f2c74433]",
                    isRemovingMessage && "bg-rose-500/50 transform transition-all scale-y-0 origin-bottom duration-200"
                )}>
                    <div className="flex items-start gap-2">
                        <Hint label={formatFullTime(new Date(createdAt))}>
                            <button className="text-sm text-muted-foreground opacity-0 group-hover:opacity-100 w-[40px] leading-[22px] text-center hover:underline">
                                {format(new Date(createdAt), "HH:mm")}
                            </button>
                        </Hint>
                        {isEditing ? (
                            <div
                                className="w-full h-full"
                            >
                                <Editor
                                    onSubmit={handleUpdate}
                                    disabled={isPending}
                                    defaultValue={JSON.parse(body)}
                                    variant="update"
                                    onCancel={() => setEditingId(null)}
                                />
                            </div>
                        ) : (
                            <div className="flex flex-col w-full">
                                <Renderer value={body} />
                                <Thumbnail url={image} />
                                {updatedAt && (
                                    <span className="text-xs text-muted-foreground">(edited)</span>
                                )}
                            </div>
                        )}
                    </div>
                    {!isEditing && (
                        <Toolbar
                            isAuthor={isAuthor}
                            isPending={isPending}
                            handleEdit={() => setEditingId(id)}
                            handleThread={() => { }}
                            handleDelete={handleRemove}
                            handleReaction={() => { }}
                            hideThreadButton={hideThreadButton}
                        />
                    )}
                </div>
            </>
        );
    }

    return (
        <>
            <ConfirmDialog />
            <div className={cn(
                "flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative",
                isEditing && "bg-[#f2c74433] hover:bg-[#f2c74433]",
                isRemovingMessage && "bg-rose-500/50 transform transition-all scale-y-0 origin-bottom duration-200"
            )}>
                <div className="flex items-start gap-2">
                    <button>
                        <Avatar className="rounded-md">
                            <AvatarImage src={authorImage} alt={authorName} className="rounded-md" />
                            <AvatarFallback className="rounded-md bg-sky-500 text-white text-sm">
                                {avatarFallback}
                            </AvatarFallback>
                        </Avatar>
                    </button>
                    {isEditing ? (
                        <div
                            className="w-full h-full"
                        >
                            <Editor
                                onSubmit={handleUpdate}
                                disabled={isPending}
                                defaultValue={JSON.parse(body)}
                                variant="update"
                                onCancel={() => setEditingId(null)}
                            />
                        </div>
                    ) : (
                        <div className="flex flex-col w-full overflow-hidden">
                            <div className="text-sm">
                                <button className="font-bold text-primary hover:underline" onClick={() => { }}>
                                    {authorName}
                                </button>
                                <span>&nbsp;&nbsp;</span>
                                <Hint label={formatFullTime(new Date(createdAt))}>
                                    <button className="text-xs text-muted-foreground hover:underline">
                                        {format(new Date(createdAt), "h:mm a")}
                                    </button>
                                </Hint>
                            </div>
                            <Renderer value={body} />
                            <Thumbnail url={image} />
                            {updatedAt && (
                                <span className="text-xs text-muted-foreground">(edited)</span>
                            )}
                        </div>
                    )}
                </div>
                {!isEditing && (
                    <Toolbar
                        isAuthor={isAuthor}
                        isPending={isPending}
                        handleEdit={() => setEditingId(id)}
                        handleThread={() => { }}
                        handleDelete={handleRemove}
                        handleReaction={() => { }}
                        hideThreadButton={hideThreadButton}
                    />
                )}
            </div>
        </>
    );
};