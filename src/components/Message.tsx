import Hint from "./Hint";
import { format, isToday, isYesterday } from "date-fns";
import dynamic from "next/dynamic";
import { Doc, Id } from "../../convex/_generated/dataModel";

const Renderer = dynamic(() => import("@/components/Renderer"), { ssr: false });

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

    return (
        <div className="flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative">
            <div className="flex items-start gap-2">
                <Hint label={formatFullTime(new Date(createdAt))}>
                    <button className="text-sm text-muted-foreground opacity-0 group-hover:opacity-100 w-[40px] leading-[22px] text-center hover:underline">
                        {format(new Date(createdAt), "HH:mm")}
                    </button>
                </Hint>
            </div>
            <Renderer value={body} />
        </div>
    );
};