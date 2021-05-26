import { AgentPubKeyB64, DnaHashB64, EntryHashB64, HeaderHashB64, Signature } from './common';
import { EntryType } from './entry';
import { HoloHashed } from './hashed';
import { Timestamp } from './timestamp';
export interface SignedHeaderHashed<H extends Header = Header> {
    header: HoloHashed<H>;
    signature: Signature;
}
export declare type HeaderHashed = HoloHashed<Header>;
export declare enum HeaderType {
    Dna = "Dna",
    AgentValidationPkg = "AgentValidationPkg",
    InitZomesComplete = "InitZomesComplete",
    CreateLink = "CreateLink",
    DeleteLink = "DeleteLink",
    OpenChain = "OpenChain",
    CloseChain = "CloseChain",
    Create = "Create",
    Update = "Update",
    Delete = "Delete"
}
export declare type HeaderContent<T extends HeaderType, H> = H & {
    type: T;
};
export declare type Header = Dna | AgentValidationPkg | InitZomesComplete | CreateLink | DeleteLink | OpenChain | CloseChain | Delete | NewEntryHeader;
export declare type NewEntryHeader = Create | Update;
export interface Dna {
    type: HeaderType.Dna;
    author: AgentPubKeyB64;
    timestamp: Timestamp;
    hash: DnaHashB64;
}
export interface AgentValidationPkg {
    type: HeaderType.AgentValidationPkg;
    author: AgentPubKeyB64;
    timestamp: Timestamp;
    header_seq: number;
    prev_header: HeaderHashB64;
    membrane_proof: any;
}
export interface InitZomesComplete {
    type: HeaderType.InitZomesComplete;
    author: AgentPubKeyB64;
    timestamp: Timestamp;
    header_seq: number;
    prev_header: HeaderHashB64;
}
export interface CreateLink {
    type: HeaderType.CreateLink;
    author: AgentPubKeyB64;
    timestamp: Timestamp;
    header_seq: number;
    prev_header: HeaderHashB64;
    base_address: EntryHashB64;
    target_address: EntryHashB64;
    zome_id: number;
    tag: any;
}
export interface DeleteLink {
    type: HeaderType.DeleteLink;
    author: AgentPubKeyB64;
    timestamp: Timestamp;
    header_seq: number;
    prev_header: HeaderHashB64;
    base_address: EntryHashB64;
    link_add_address: HeaderHashB64;
}
export interface OpenChain {
    type: HeaderType.OpenChain;
    author: AgentPubKeyB64;
    timestamp: Timestamp;
    header_seq: number;
    prev_header: HeaderHashB64;
    prev_dna_hash: DnaHashB64;
}
export interface CloseChain {
    type: HeaderType.CloseChain;
    author: AgentPubKeyB64;
    timestamp: Timestamp;
    header_seq: number;
    prev_header: HeaderHashB64;
    new_dna_hash: DnaHashB64;
}
export interface Update {
    type: HeaderType.Update;
    author: AgentPubKeyB64;
    timestamp: Timestamp;
    header_seq: number;
    prev_header: HeaderHashB64;
    original_header_address: HeaderHashB64;
    original_entry_address: EntryHashB64;
    entry_type: EntryType;
    entry_hash: EntryHashB64;
}
export interface Delete {
    type: HeaderType.Delete;
    author: AgentPubKeyB64;
    timestamp: Timestamp;
    header_seq: number;
    prev_header: HeaderHashB64;
    deletes_address: HeaderHashB64;
    deletes_entry_address: EntryHashB64;
}
export interface Create {
    type: HeaderType.Create;
    author: AgentPubKeyB64;
    timestamp: Timestamp;
    header_seq: number;
    prev_header: HeaderHashB64;
    entry_type: EntryType;
    entry_hash: EntryHashB64;
}
