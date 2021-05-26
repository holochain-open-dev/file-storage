import { HoloHashB64 } from './common';
export interface HoloHashed<T> {
    hash: HoloHashB64;
    content: T;
}
