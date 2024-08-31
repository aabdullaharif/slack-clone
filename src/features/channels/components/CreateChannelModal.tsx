import { useState } from "react";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useCreateChannelModal } from "../store/useCreateChannelModal"
import { useCreateChannel } from "../api/useCreateChannel";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";

export const CreateChannelModal = () => {
    const [name, setName] = useState("");
    const workspaceId = useWorkspaceId();
    const [open, setOpen] = useCreateChannelModal();

    const { mutate, isPending } = useCreateChannel();

    const handleClose = () => {
        setName("");
        setOpen(false);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\s+/g, "-").toLowerCase();
        setName(value);
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        mutate({ name, workspaceId }, {
            onSuccess: (id) => {
                // TODO:
                handleClose();
            }
        });
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Add a channel
                    </DialogTitle>
                </DialogHeader>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <Input
                        value={name}
                        onChange={handleChange}
                        disabled={isPending}
                        required
                        autoFocus
                        minLength={3}
                        maxLength={80}
                        placeholder="e.g. plan-budget"
                    />
                    <div className="flex justify-end">
                        <Button disabled={isPending}>
                            Create
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
