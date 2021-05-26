import { Entry } from './entry';
import { SignedHeaderHashed } from './header';
import { EntryDhtStatus } from './metadata';
import { Element } from './element';
import { ValidationStatus } from './validation';
export interface EntryDetails {
    entry: Entry;
    headers: Array<SignedHeaderHashed>;
    rejected_headers: Array<SignedHeaderHashed>;
    deletes: Array<SignedHeaderHashed>;
    updates: Array<SignedHeaderHashed>;
    entry_dht_status: EntryDhtStatus;
}
export interface ElementDetails {
    element: Element;
    validation_status: ValidationStatus;
    deletes: Array<SignedHeaderHashed>;
    updates: Array<SignedHeaderHashed>;
}
export declare type Details = {
    type: DetailsType.Element;
    content: ElementDetails;
} | {
    type: DetailsType.Entry;
    content: EntryDetails;
};
export declare enum DetailsType {
    Entry = 0,
    Element = 1
}
