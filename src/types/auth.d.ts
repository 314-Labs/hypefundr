import type { DefaultSession } from "@auth/core/types";

declare module "@auth/core/types" {
    export interface Session {
        user: {
            image: string,
            name: string,
            id: string,
        };
    }
}