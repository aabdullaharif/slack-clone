"use client";

import { useEffect, useState } from "react";
import { CreateWorkspaceModal } from "@/features/workspaces/components/CreateWorkspaceModal";
import { CreateChannelModal } from "@/features/channels/components/CreateChannelModal";

export const Modals = () => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <>
            <CreateWorkspaceModal />
            <CreateChannelModal />
        </>
    )
}