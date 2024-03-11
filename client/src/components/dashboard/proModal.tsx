/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { closeModal } from "@/store/reducers/modalReducer";
import { useDispatch, useSelector } from "react-redux"
import { Check, Zap } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { tools } from "@/constants";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { RootState } from "@/store";
import { useUser } from "@clerk/clerk-react";

export const ProModal = () => {
    const { user } = useUser();
    const [loading, setLoading] = useState<boolean>(false);
    const { isOpen } = useSelector((state: RootState) => state.modal);

    const dispatch = useDispatch();

    const onSubscribe = async () => {
        try {
            setLoading(true);
            const response = await axios.get("http://localhost:8000/stripe", {
                headers: {
                    'x-user-id': user?.id,
                    'x-user-email': user?.emailAddresses[0]?.emailAddress,
                }
            });
            console.log(response.data);
            window.location.href = response.data.url;
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    }
    return (
        <Dialog open={isOpen} onOpenChange={() => dispatch(closeModal())}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex justify-center items-center flex-col gap-y-4 pb-2">
                        <div className="flex items-center gap-x-2 font-bold text-xl">
                            Upgrade to Ingenuity
                            <Badge variant="premium" className="text-white uppercase text-sm py-1">
                                pro
                            </Badge>
                        </div>
                    </DialogTitle>
                    <DialogDescription className="text-center pt-2 space-y-2 text-zinc-900 font-medium">
                        {tools.map((tool) => (
                            <Card key={tool.href} className="p-3 flex items-center justify-between">
                                <div className="flex items-center gap-x-4">
                                    <div className={cn("p-2 w-fit rounded-md", tool.bgColor)}>
                                        <tool.icon className={cn("w-6 h-6", tool.color)} />
                                    </div>
                                    <div className="font-semibold text-sm">
                                        {tool.label}
                                    </div>
                                </div>
                                <Check className="text-primary w-5 h-5" />
                            </Card>
                        ))}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button disabled={loading} onClick={onSubscribe} size="lg" variant="premium" className="w-full">
                        Upgrade
                        <Zap className="w-4 h-4 ml-2 fill-white" />
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}