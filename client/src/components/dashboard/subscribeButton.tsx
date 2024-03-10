import axios from "axios";
import { useState } from "react";
import { Zap } from "lucide-react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/clerk-react";

export const SubscriptionButton = ({
    isPro = false
}: {
    isPro: boolean;
}) => {
    const [loading, setLoading] = useState(false);
    const { user } = useUser();
    const onClick = async () => {
        try {
            setLoading(true);
            const response = await axios.get("http://localhost:8000/stripe", {
                headers: {
                    'x-user-id': user?.id,
                    'x-user-email': user?.emailAddresses[0]?.emailAddress,
                }
            });
            window.location.href = response.data.url;
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button variant={isPro ? "default" : "premium"} disabled={loading} onClick={onClick} >
            {isPro ? "Manage Subscription" : "Upgrade"}
            {!isPro && <Zap className="w-4 h-4 ml-2 fill-white" />}
        </Button>
    )
};