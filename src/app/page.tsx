"use client";

import { UserButton } from '@/features/auth/components/UserButton';
import { useCreateWorkspaceModal } from '@/features/workspaces/store/useCreateWorkspaceModal';

import { useGetWorkspaces } from '@/features/workspaces/api/useGetWorkspaces';
import { useEffect, useMemo } from 'react';

const Home = () => {
  const [open, setOpen] = useCreateWorkspaceModal();
  const { data, isLoading } = useGetWorkspaces();

  const workspaceId = useMemo(() => data?.[0]?._id, [data]);

  useEffect(() => {
    if (isLoading) return;
    if (workspaceId) {
      console.log('workspaceId', workspaceId);
    } else if (!open) {
      console.log('No workspaces');
      setOpen(true);
    }
  }, [workspaceId, isLoading, open, setOpen]);

  return (
    <UserButton />
  )
}

export default Home