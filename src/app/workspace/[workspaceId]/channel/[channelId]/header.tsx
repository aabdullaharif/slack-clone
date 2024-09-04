import { useState } from "react";
import { useRouter } from "next/navigation";

import { toast } from "sonner";
import { TrashIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DialogClose, DialogTrigger } from "@radix-ui/react-dialog";
import { FaChevronDown } from "react-icons/fa";
import { Input } from "@/components/ui/input";

import { useConfirm } from "@/hooks/useConfirm";
import { useChannelId } from "@/hooks/useChannelId";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";

import { useUpdateChannel } from "@/features/channels/api/useUpdateChannel";
import { useRemoveChannel } from "@/features/channels/api/useRemoveChannel";
import { useCurrentMember } from "@/features/members/api/useCurrentMember";

interface HeaderProps {
    title: string;
}

export const Header = ({ title }: HeaderProps) => {
    const router = useRouter();
    const workspaceId = useWorkspaceId();
    const channelId = useChannelId();

    const [value, setValue] = useState(title);
    const [editOpen, setEditOpen] = useState(false);

    const [ConfirmDialog, confirm] = useConfirm(
        "Delete this channel?",
        "This action cannot be undone.",
    );

    const { data: member } = useCurrentMember({ workspaceId });
    const { mutate: updateChannel, isPending: isUpdatingChannel } = useUpdateChannel();
    const { mutate: removeChannel } = useRemoveChannel();

    const handleEditOpen = (value: boolean) => {
        if (member?.role !== "admin") return;
        setEditOpen(value);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\s+/g, "-").toLowerCase();
        setValue(value);
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        updateChannel({ name: value, id: channelId }, {
            onSuccess: () => {
                toast.success("Channel name updated");
                setEditOpen(false);
            },
            onError: () => {
                toast.error("Failed to update channel name");
                setEditOpen(false);
            }
        });
    }

    const handleDelete = async () => {
        const ok = await confirm();
        if (!ok) return;

        removeChannel({ id: channelId }, {
            onSuccess: () => {
                router.push(`/workspace/${workspaceId}`);
                toast.success("Channel deleted");
            },
            onError: () => {
                toast.error("Failed to delete channel");
            }
        });
    }


    return (
        <div className="bg-white border-b h-[49px] flex items-center px-4 overflow-hidden">
            <ConfirmDialog />
            <Dialog>
                <DialogTrigger asChild>
                    <Button
                        variant='ghost'
                        className="text-lg font-semibold px-2 overflow-hidden w-auto"
                        size='sm'
                    >
                        <span className="truncate"># {title}</span>
                        <FaChevronDown className="size-2.5 ml-2" />
                    </Button>
                </DialogTrigger>
                <DialogContent className="p-0 bg-gray-50 overflow-hidden">
                    <DialogHeader className="bg-white border-b p-4">
                        <DialogTitle>
                            # {title}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="px-4 pb-4 flex flex-col gap-y-2">
                        <Dialog open={editOpen} onOpenChange={handleEditOpen}>
                            <DialogTrigger asChild>
                                <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-semibold">Channel name</p>
                                        {
                                            member?.role === "admin" && (
                                                <p className="text-sm text-[#1264a3] hover:underline font-semibold">
                                                    Edit
                                                </p>
                                            )
                                        }
                                    </div>
                                    <p className="text-sm"># {title}</p>
                                </div>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                        Edit channel name
                                    </DialogTitle>
                                </DialogHeader>
                                <form
                                    className="space-y-4"
                                    onSubmit={handleSubmit}
                                >
                                    <Input
                                        value={value}
                                        onChange={handleChange}
                                        placeholder="e.g. plan-budget"
                                        disabled={isUpdatingChannel}
                                        required
                                        autoFocus
                                        minLength={3}
                                        maxLength={80}
                                    />
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button variant='outline' disabled={isUpdatingChannel}>
                                                Cancel
                                            </Button>
                                        </DialogClose>
                                        <Button disabled={isUpdatingChannel}>
                                            Save
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                        {
                            member?.role === "admin" && (
                                <button
                                    className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50 text-rose-600 w-full"
                                    onClick={handleDelete}
                                >
                                    <TrashIcon className="size-4" />
                                    <p className="text-sm font-semibold">Delete channel</p>
                                </button>
                            )
                        }
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
