import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

export const CrispChat = () => {
    useEffect(() => {
        Crisp.configure("06eafc2a-1de7-4ae6-ab3c-be2a2b57be63");
    }, []);

    return null;
};