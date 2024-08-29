"use client";

import { useRouter } from 'next/navigation';

import { UserButton } from '@/features/auth/components/UserButton';
import { useCreateWorkspaceModal } from '@/features/workspaces/store/useCreateWorkspaceModal';

import { useGetWorkspaces } from '@/features/workspaces/api/useGetWorkspaces';
import { useEffect, useMemo } from 'react';

const Home = () => {
  const router = useRouter();
  const [open, setOpen] = useCreateWorkspaceModal();
  const { data, isLoading } = useGetWorkspaces();

  const workspaceId = useMemo(() => data?.[0]?._id, [data]);

  useEffect(() => {
    if (isLoading) return;
    if (workspaceId) {
      router.replace(`/workspace/${workspaceId}`);
    } else if (!open) {
      setOpen(true);
    }
  }, [workspaceId, isLoading, open, setOpen, router]);

  return (
    <UserButton />
  )
}

export default Home