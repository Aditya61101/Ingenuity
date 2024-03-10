import { UserButton } from "@clerk/clerk-react";
import { MobileSidebar } from "@/components/dashboard/mobileSidebar";
import { ModeToggle } from "../mode-toggle";

export const Navbar = () => {
    return (
        <div className="flex items-center p-4">
            <MobileSidebar />
            <div className="flex gap-x-2 items-center w-full justify-end">
                <UserButton afterSignOutUrl="/" />
                <ModeToggle />
            </div>
        </div>
    );
}