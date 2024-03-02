import { SignedIn, SignedOut, UserButton, useAuth } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "../mode-toggle";

export const LandingNavbar = () => {
    const { isSignedIn } = useAuth();

    return (
        <nav className="p-4 bg-transparent flex items-center justify-between">
            <Link to="/" className="flex items-center">
                <div className="relative h-8 w-8 mr-4">
                    <img alt="Logo" src="/logo.png" />
                </div>
                <h1 className="text-2xl font-bold">
                    Ingenuity
                </h1>
            </Link>
            <div className="flex items-center gap-x-2">
                {isSignedIn ? (<SignedIn>
                    <UserButton afterSignOutUrl='/' />
                </SignedIn>) : (
                    <SignedOut>
                        <Link to="/sign-in">
                            <Button variant="outline" className="rounded-full">
                                Get Started
                            </Button>
                        </Link>
                    </SignedOut>)}
                <ModeToggle />
            </div>
        </nav>
    )
}
