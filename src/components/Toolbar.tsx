import { MessageSquareTextIcon, PencilIcon, SmileIcon, TrashIcon } from "lucide-react";
import { Button } from "./ui/button";
import Hint from "./Hint";
import { EmojiPopover } from "./EmojiPopover";

interface ToolbarProps {
    isAuthor: boolean;
    isPending: boolean;
    handleEdit: () => void;
    handleDelete: () => void;
    handleThread: () => void;
    handleReaction: (value: string) => void;
    hideThreadButton?: boolean;
}

export const Toolbar = ({ isAuthor, isPending, handleEdit, handleDelete, handleThread, handleReaction, hideThreadButton }: ToolbarProps) => {
    return (
        <div className="absolute top-0 right-5">
            <div className="group-hover:opacity-100 opacity-0 transition-opacity border bg-white">
                <EmojiPopover hint="Add reaction" onEmojiSelect={(emoji) => handleReaction(emoji.native)}>
                    <Button
                        variant="ghost"
                        size="iconSm"
                        disabled={isPending}
                    >
                        <SmileIcon className="size-4" />
                    </Button>
                </EmojiPopover>
                {!hideThreadButton && (
                    <Hint label="Reply in thread">
                        <Button
                            variant="ghost"
                            size="iconSm"
                            disabled={isPending}
                            onClick={handleThread}
                        >
                            <MessageSquareTextIcon className="size-4" />
                        </Button>
                    </Hint>
                )}
                {isAuthor && (
                    <Hint label="Edit message">
                        <Button
                            variant="ghost"
                            size="iconSm"
                            disabled={isPending}
                            onClick={handleEdit}
                        >
                            <PencilIcon className="size-4" />
                        </Button>
                    </Hint>
                )}
                {isAuthor && (
                    <Hint label="Delete">
                        <Button
                            variant="ghost"
                            size="iconSm"
                            disabled={isPending}
                            onClick={handleDelete}
                        >
                            <TrashIcon className="size-4" />
                        </Button>
                    </Hint>
                )}
            </div>
        </div>
    )
}