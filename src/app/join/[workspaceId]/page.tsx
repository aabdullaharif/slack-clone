"use client";

import Link from "next/link";
import Image from "next/image";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";
import { useGetWorkspaceInfo } from "@/features/workspaces/api/useGetWorkspaceInfo";

import VerificationInput from "react-verification-input";
import { useJoin } from "@/features/workspaces/api/useJoin";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const JoinPage = () => {
    const router = useRouter();
    const workspaceId = useWorkspaceId();

    const { data, isLoading } = useGetWorkspaceInfo({ id: workspaceId });
    const { mutate, isPending } = useJoin();

    const isMember = useMemo(() => data?.isMember, [data?.isMember]);
    useEffect(() => {
        if (isMember) {
            router.push(`/workspace/${workspaceId}`);
        }
    }, [isMember, router, workspaceId]);

    const handleComplete = (value: string) => {
        mutate({ workspaceId, joinCode: value }, {
            onSuccess: (id) => {
                router.replace(`/workspace/${id}`);
                toast.success("Successfully joined workspace");
            },
            onError: () => {
                toast.error("Failed to join workspace");
            }
        });
    }

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader className="size-6 animate-spin text-muted-foreground" />
            </div>
        )
    }

    return (
        <div className="h-full flex flex-col items-center justify-center gap-y-8 bg-white p-8 rounded-lg shadow-md">
            <Image src="/hashtag.svg" width={60} height={60} alt="logo" />
            <div className="flex flex-col gap-y-4 items-center justify-center max-w-md">
                <div className="flex flex-col gap-y-2 items-center justify-center">
                    <h1 className="text-2xl font-bold">Join {data?.name}</h1>
                    <p className="text-md text-muted-foreground">Enter the workspace code to join</p>
                </div>
                <VerificationInput
                    classNames={{
                        container: cn("flex gap-x-2", isPending && "opacity-50 cursor-not-allowed"),
                        character: "uppercase h-auto rounded-md border border-gray-300 text-center flex items-center justify-center text-lg font-medium text-gray-500",
                        characterInactive: "bg-muted",
                        characterSelected: "bg-white text-black",
                        characterFilled: "bg-white text-black",
                    }}
                    autoFocus
                    length={6}
                    onComplete={handleComplete}
                />
            </div>
            <div className="flex gap-x-4">
                <Button variant='outline' size='lg' asChild>
                    <Link href="/">
                        Go to home
                    </Link>
                </Button>
            </div>
        </div>
    )
}

export default JoinPage