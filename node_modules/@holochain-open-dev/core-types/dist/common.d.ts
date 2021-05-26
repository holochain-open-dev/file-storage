export declare type Dictionary<T> = {
    [key: string]: T;
};
export declare type HoloHashB64 = string;
export declare type EntryHashB64 = HoloHashB64;
export declare type HeaderHashB64 = HoloHashB64;
export declare type DhtOpHashB64 = HoloHashB64;
export declare type DnaHashB64 = HoloHashB64;
export declare type AgentPubKeyB64 = HoloHashB64;
export declare type Signature = Uint8Array;
export declare type CellId = [DnaHashB64, AgentPubKeyB64];
