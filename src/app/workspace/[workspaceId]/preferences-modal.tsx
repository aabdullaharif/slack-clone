import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useRemoveWorkspace } from "@/features/workspaces/api/useRemoveWorkspace";
import { useUpdateWorkspace } from "@/features/workspaces/api/useUpdateWorkspace";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";
import { DialogClose, DialogTrigger } from "@radix-ui/react-dialog";
import { TrashIcon } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";


interface PreferenceModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    initialValue: string;
}

export const PreferencesModal = ({ open, setOpen, initialValue }: PreferenceModalProps) => {
    const router = useRouter();
    const workspaceId = useWorkspaceId();
    const [value, setValue] = useState(initialValue);
    const [editOpen, setEditOpen] = useState(false);

    const { mutate: updateWorkspace, isPending: isUpdatingWorkspace } = useUpdateWorkspace();
    const { mutate: removeWorkspace, isPending: isRemovingWorkspace } = useRemoveWorkspace();

    const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        updateWorkspace({ id: workspaceId, name: value }, {
            onSuccess: () => {
                toast.success("Workspace name updated");
                setEditOpen(false);
            },
            onError: (error) => {
                toast.error("Failed to update workspace");
            }
        });
    }

    const handleRemove = async () => {
        removeWorkspace({ id: workspaceId }, {
            onSuccess: () => {
                toast.success("Workspace deleted");
                router.replace("/");
            },
            onError: (error) => {
                toast.error("Failed to delete workspace");
            }
        });
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="p-0 bg-gray-50 overflow-hidden">
                <DialogHeader className="p-4 border-b bg-white">
                    <DialogTitle>
                        {value}
                    </DialogTitle>
                </DialogHeader>
                <div className="px-4 pb-4 flex flex-col gap-y-2">
                    <Dialog open={editOpen} onOpenChange={setEditOpen}>
                        <DialogTrigger asChild>
                            <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-semibold">
                                        Workspace name
                                    </p>
                                    <p className="text-sm text-[#1264a3] font-semibold hover:underline">Edit</p>
                                </div>
                                <p className="text-sm">{value}</p>
                            </div>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>
                                    Edit workspace name
                                </DialogTitle>
                            </DialogHeader>
                            <form className="space-y-4" onSubmit={handleEdit}>
                                <Input
                                    value={value}
                                    disabled={isUpdatingWorkspace}
                                    onChange={(e) => setValue(e.target.value)}
                                    required
                                    autoFocus
                                    minLength={3}
                                    maxLength={80}
                                    placeholder="Workspace name e.g. 'Work', 'Personal', 'Home'"
                                />

                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button variant='outline' disabled={isUpdatingWorkspace}>
                                            Cancel
                                        </Button>
                                    </DialogClose>
                                    <Button disabled={isUpdatingWorkspace}>
                                        Save
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                    <button
                        disabled={isRemovingWorkspace}
                        onClick={handleRemove}
                        className="flex items-center gap-x-2 px-5 py-2 bg-white rounded-lg border cursor-pointer hover:bg-gray-50 text-rose-600"
                    >
                        <TrashIcon className="size-4" />
                        <p className="text-sm font-semibold">Delete workspace</p>
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    )
}