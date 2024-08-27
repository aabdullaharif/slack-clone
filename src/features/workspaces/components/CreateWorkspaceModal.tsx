import React from 'react'
import { useCreateWorkspaceModal } from '../store/useCreateWorkspaceModal';
import { Dialog, DialogHeader, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export const CreateWorkspaceModal = () => {
    const [open, setOpen] = useCreateWorkspaceModal();

    const handleClose = () => {
        setOpen(false);
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add a workspace</DialogTitle>
                </DialogHeader>
                <form className='space-y-4'>
                    <Input
                        disabled={false}
                        placeholder="Workspace name e.g. 'Home', 'Work', 'Personal'"
                        value=""
                        onChange={() => { }}
                        minLength={3}
                        required
                        autoFocus
                    />
                    <div className='flex justify-end'>
                        <Button type='submit' disabled={false}>Create</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
