import { useState } from "react"

import { FcGoogle } from "react-icons/fc"
import { FaGithub } from "react-icons/fa"
import { TriangleAlert } from "lucide-react";

import { useAuthActions } from "@convex-dev/auth/react";


import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@radix-ui/react-separator"
import { SignInFlow } from "../types"

interface SignUpCardProps {
    setState: (state: SignInFlow) => void;
};

export const SignUpCard = ({ setState }: SignUpCardProps) => {
    const { signIn } = useAuthActions();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [pending, setPending] = useState(false);
    const [error, setError] = useState("");

    const onPasswordSignUp = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        setPending(true);
        signIn("password", {
            name,
            email,
            password,
            flow: "signUp"
        })
            .catch(() => {
                setError("Invalid email or password");
            })
            .finally(() => {
                setPending(false);
            });
    }

    const onProviderSignUp = (value: "github" | "google") => {
        setPending(true);
        signIn(value)
            .finally(() => {
                setPending(false);
            });
    }

    return (
        <Card className="w-full h-full p-8">
            <CardHeader className="px-0 pt-0">
                <CardTitle>
                    Sign up to continue
                </CardTitle>
                <CardDescription>
                    Use your email or other service to continue
                </CardDescription>
            </CardHeader>
            {!!error && <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6">
                <TriangleAlert className="size-4" />
                <p>{error}</p>
            </div>}
            <CardContent className="space-y-5 px-0 pb-0">
                <form className="space-x-2.5" onSubmit={onPasswordSignUp}>
                    <div className="space-y-4">
                        <Input
                            disabled={pending}
                            value={name}
                            onChange={(e) => { setName(e.target.value) }}
                            required
                            placeholder="Full Name"
                        />
                        <Input
                            disabled={pending}
                            value={email}
                            onChange={(e) => { setEmail(e.target.value) }}
                            type="email"
                            required
                            placeholder="Email"
                        />
                        <Input
                            disabled={pending}
                            value={password}
                            onChange={(e) => { setPassword(e.target.value) }}
                            type="password"
                            required
                            placeholder="Password"
                        />
                        <Input
                            disabled={pending}
                            value={confirmPassword}
                            onChange={(e) => { setConfirmPassword(e.target.value) }}
                            type="password"
                            required
                            placeholder="Confirm Password"
                        />

                        <Button type="submit" className="w-full" size="lg" disabled={pending}>
                            Continue
                        </Button>
                    </div>
                </form>

                <Separator />

                <div className="flex flex-col gap-y-3">
                    <Button
                        disabled={pending}
                        onClick={() => onProviderSignUp("google")}
                        className="w-full relative"
                        variant="outline"
                        size="lg"
                    >
                        <FcGoogle
                            className="size-5 absolute left-2.5 top-2.5"
                        />
                        Continue with Google
                    </Button>
                    <Button
                        disabled={pending}
                        onClick={() => onProviderSignUp("github")}
                        className="w-full relative"
                        variant="outline"
                        size="lg"
                    >
                        <FaGithub
                            className="size-5 absolute left-2.5 top-3"
                        />
                        Continue with Github
                    </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                    Already have an account? <span
                        onClick={() => setState("signIn")}
                        className="text-sky-700 hover:underline cursor-pointer">Sign In</span>
                </p>
            </CardContent>
        </Card>
    )
}