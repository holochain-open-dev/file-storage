import { AgentPubKeyB64 } from "./common";
export declare type CapSecret = string;
export interface CapClaim {
    tag: string;
    grantor: AgentPubKeyB64;
    secret: CapSecret;
}
export interface ZomeCallCapGrant {
    tag: string;
    access: CapAccess;
    functions: Array<{
        zome: string;
        fn_name: string;
    }>;
}
export declare type CapAccess = "Unrestricted" | {
    Transferable: {
        secret: CapSecret;
    };
} | {
    Assigned: {
        secret: CapSecret;
        assignees: AgentPubKeyB64[];
    };
};
export declare type CapGrant = {
    ChainAuthor: AgentPubKeyB64;
} | {
    RemoteAgent: ZomeCallCapGrant;
};
