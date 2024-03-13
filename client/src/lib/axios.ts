import { UserResource } from "@clerk/types";
import axios from "axios";

const instance = axios.create({
    baseURL: 'https://ingenuity-cj1p.onrender.com/api/',
    headers: {},
});

export const apiCall = (user:UserResource|null|undefined) => {
    instance.interceptors.request.use(
        (config) => {
            if (user) {
                config.headers['x-user-id'] = user?.id;
                config.headers['x-user-email'] = user?.emailAddresses[0]?.emailAddress;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );
    return instance;
}