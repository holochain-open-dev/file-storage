import { Dictionary, EntryHashB64, HeaderHashB64 } from './common';
import { NewEntryHeader } from './header';
import { Timestamp } from './timestamp';
export interface Metadata {
    system_meta: Dictionary<SysMetaVal[]>;
    link_meta: Array<{
        key: LinkMetaKey;
        value: LinkMetaVal;
    }>;
    misc_meta: Dictionary<MiscMetaVal>;
}
export declare type SysMetaVal = {
    NewEntry: HeaderHashB64;
} | {
    Update: HeaderHashB64;
} | {
    Delete: HeaderHashB64;
} | {
    Activity: HeaderHashB64;
} | {
    DeleteLink: HeaderHashB64;
} | {
    CustomPackage: HeaderHashB64;
};
export declare function getSysMetaValHeaderHash(sys_meta_val: SysMetaVal): HeaderHashB64 | undefined;
export interface LinkMetaKey {
    base: EntryHashB64;
    zome_id: number;
    tag: any;
    header_hash: HeaderHashB64;
}
export interface LinkMetaVal {
    link_add_hash: HeaderHashB64;
    target: EntryHashB64;
    timestamp: Timestamp;
    zome_id: number;
    tag: any;
}
export declare type MiscMetaVal = {
    EntryStatus: EntryDhtStatus;
} | 'StoreElement' | {
    ChainItem: Timestamp;
} | {
    ChainObserved: HighestObserved;
} | {
    ChainStatus: ChainStatus;
};
export declare enum ChainStatus {
    Empty = 0,
    Valid = 1,
    Forked = 2,
    Invalid = 3
}
export interface HighestObserved {
    header_seq: number;
    hash: HeaderHashB64[];
}
export declare enum EntryDhtStatus {
    Live = 0,
    Dead = 1,
    Pending = 2,
    Rejected = 3,
    Abandoned = 4,
    Conflict = 5,
    Withdrawn = 6,
    Purged = 7
}
export interface CoreEntryDetails {
    headers: NewEntryHeader[];
    links: LinkMetaVal[];
    dhtStatus: EntryDhtStatus;
}
