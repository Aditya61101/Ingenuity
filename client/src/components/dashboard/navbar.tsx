import { UserButton } from "@clerk/clerk-react";
import { MobileSidebar } from "@/components/dashboard/mobileSidebar";
import { ModeToggle } from "../mode-toggle";
// import { getApiLimitCount } from "@/lib/api-limit";
// import { checkSubscription } from "@/lib/subscription";

const Navbar = () => {
    //   const apiLimitCount = await getApiLimitCount();
    //   const isPro = await checkSubscription();

    return (
        <div className="flex items-center p-4">
            {/* <MobileSidebar isPro={isPro} apiLimitCount={apiLimitCount} /> */}
            <MobileSidebar />
            <div className="flex gap-x-2 items-center w-full justify-end">
                <ModeToggle />
                <UserButton afterSignOutUrl="/" />
            </div>
        </div>
    );
}

export default Navbar;