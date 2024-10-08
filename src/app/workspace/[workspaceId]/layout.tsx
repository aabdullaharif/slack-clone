"use client";

import { Loader } from "lucide-react";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup
} from "@/components/ui/resizable";
import SideBar from "./sidebar";
import WorkspaceSidebar from "./workspace-sidebar";
import { ToolBar } from "./toolbar";
import { Thread } from "@/features/members/components/Thread";

import { usePanel } from "@/hooks/usePanel";
import { Id } from "../../../../convex/_generated/dataModel";

interface WorkspaceIdLayoutProps {
    children: React.ReactNode;
}

const WorkspaceIdLayout = ({ children }: WorkspaceIdLayoutProps) => {
    const { parentMessageId, onClose } = usePanel();

    const showPanel = !!parentMessageId;

    return (
        <div className="h-full">
            <ToolBar />
            <div className="flex h-[calc(100vh-40px)]">
                <SideBar />
                <ResizablePanelGroup
                    autoSaveId="ab-workspace-layout"
                    direction="horizontal">
                    <ResizablePanel
                        defaultSize={20}
                        minSize={11}
                        className="bg-[#5e2c5f]"
                    >
                        <WorkspaceSidebar />
                    </ResizablePanel>
                    <ResizableHandle withHandle />
                    <ResizablePanel
                        minSize={20}
                    >
                        {children}
                    </ResizablePanel>
                    {
                        showPanel && (
                            <>
                                <ResizableHandle withHandle />
                                <ResizablePanel minSize={20} defaultSize={29}>
                                    {parentMessageId ? (
                                        <Thread
                                            messageId={parentMessageId as Id<"messages">}
                                            onClose={onClose}
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center">
                                            <Loader className="size-5 animate-spin text-muted-foreground" />
                                        </div>
                                    )}
                                </ResizablePanel>
                            </>
                        )
                    }
                </ResizablePanelGroup>
            </div>
        </div>
    )
}

export default WorkspaceIdLayout;