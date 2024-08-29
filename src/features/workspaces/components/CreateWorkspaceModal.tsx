import React, { useState } from 'react'
import { useRouter } from 'next/navigation';

import { Dialog, DialogHeader, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { useCreateWorkspaceModal } from '../store/useCreateWorkspaceModal';
import { useCreateWorkspace } from '../api/useCreateWorkspace';
import { toast } from 'sonner';

export const CreateWorkspaceModal = () => {
    const router = useRouter();
    const [name, setName] = useState('');
    const [open, setOpen] = useCreateWorkspaceModal();
    const { mutate, isPending } = useCreateWorkspace();

    const handleClose = () => {
        setOpen(false);
        setName('');
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        mutate({ name }, {
            onSuccess(id) {
                toast.success('Workspace created');
                router.push(`/workspace/${id}`);
                handleClose();
            }
        });
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add a workspace</DialogTitle>
                </DialogHeader>
                <form className='space-y-4' onSubmit={handleSubmit}>
                    <Input
                        disabled={isPending}
                        placeholder="Workspace name e.g. 'Home', 'Work', 'Personal'"
                        value={name}
                        onChange={(e) => { setName(e.target.value) }}
                        minLength={3}
                        required
                        autoFocus
                    />
                    <div className='flex justify-end'>
                        <Button type='submit' disabled={isPending}>Create</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
