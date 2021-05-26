export declare const DEFAULT_TIMEOUT = 15000;
export declare const catchError: (res: any) => Promise<any>;
export declare const promiseTimeout: (promise: Promise<any>, tag: string, ms: number) => Promise<unknown>;
