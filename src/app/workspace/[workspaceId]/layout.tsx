"use client";

import SideBar from "./sidebar";
import { ToolBar } from "./toolbar";

interface WorkspaceIdLayoutProps {
    children: React.ReactNode;
}

const WorkspaceIdLayout = ({ children }: WorkspaceIdLayoutProps) => {
    return (
        <div className="h-full">
            <ToolBar />
            <div className="flex h-[calc(100vh-40px)]">
                <SideBar />
                {children}
            </div>
        </div>
    )
}

export default WorkspaceIdLayout;