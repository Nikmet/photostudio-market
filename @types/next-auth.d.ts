import "next-auth";

declare module "next-auth" {
    interface User {
        phone?: string;
    }

    interface DefaultJWT {
        id: string;
        phone?: string;
    }

    interface Session {
        user: {
            phone?: string;
        } & DefaultSession["user"];
    }
}
