import { UserButton } from "@clerk/clerk-react";
import { MobileSidebar } from "@/components/dashboard/mobileSidebar";
import { ModeToggle } from "../mode-toggle";

const Navbar = () => {
    return (
        <div className="flex items-center p-4">
            <MobileSidebar />
            <div className="flex gap-x-2 items-center w-full justify-end">
                <ModeToggle />
                <UserButton afterSignOutUrl="/" />
            </div>
        </div>
    );
}

export default Navbar;