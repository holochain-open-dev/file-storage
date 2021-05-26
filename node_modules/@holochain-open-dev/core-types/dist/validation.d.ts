import { AgentPubKeyB64, DhtOpHashB64 } from './common';
import { Timestamp } from './timestamp';
export declare enum ValidationStatus {
    Valid = 0,
    Rejected = 1,
    Abandoned = 2
}
export interface ValidationReceipt {
    dht_op_hash: DhtOpHashB64;
    validation_status: ValidationStatus;
    validator: AgentPubKeyB64;
    when_integrated: Timestamp;
}
