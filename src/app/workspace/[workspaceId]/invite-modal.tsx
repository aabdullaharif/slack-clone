import { toast } from "sonner";
import { CopyIcon, RefreshCcwIcon } from "lucide-react";

import { useConfirm } from "@/hooks/useConfirm";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogDescription, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";
import { useNewJoinCode } from "@/features/workspaces/api/useNewJoinCode";

interface InviteModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    name: string;
    joinCode: string;
}

export const InviteModal = ({ open, setOpen, name, joinCode }: InviteModalProps) => {
    const workspaceId = useWorkspaceId();
    const [ConfirmDialog, confirm] = useConfirm(
        "Are you sure?",
        "This will invalidate the current invite code and generate a new one"
    );

    const { mutate, isPending } = useNewJoinCode();

    const handleCopy = () => {
        const inviteLink = `${window.location.origin}/join/${workspaceId}`;
        navigator.clipboard.writeText(inviteLink).then(() => toast.success("Link copied to clipboard"));
    }

    const handleNewCode = async () => {
        const ok = await confirm();
        if (!ok) return;

        mutate({ id: workspaceId }, {
            onSuccess: () => {
                toast.success("Invite code regenerated");
            },
            onError: () => {
                toast.error("Failed to regenerate new invite code");
            }
        });
    }

    return (
        <>
            <ConfirmDialog />
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Invite people to {name}</DialogTitle>
                        <DialogDescription>
                            Use the code below to invite people to this workspace
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-y-4 items-center justify-center py-10">
                        <p className="text-4xl font-bold uppercase tracking-widest">{joinCode}</p>
                        <Button
                            variant='ghost'
                            size='sm'
                            onClick={handleCopy}
                        >
                            Copy link
                            <CopyIcon className="size-4 ml-2" />
                        </Button>
                    </div>
                    <div className="flex items-center justify-between w-full">
                        <Button onClick={handleNewCode} variant='outline' disabled={isPending}>
                            New Code
                            <RefreshCcwIcon className="size-4 ml-2" />
                        </Button>
                        <DialogClose asChild>
                            <Button>
                                Close
                            </Button>
                        </DialogClose>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
