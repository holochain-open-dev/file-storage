import { AppApi, AppInfoRequest, AppInfoResponse, CallZomeRequestGeneric, CallZomeResponseGeneric, AppSignalCb } from '../api/app';
import { WsClient } from './client';
import { Transformer, Requester } from '../api/common';
export declare class AppWebsocket implements AppApi {
    client: WsClient;
    defaultTimeout: number;
    constructor(client: WsClient, defaultTimeout?: number);
    static connect(url: string, defaultTimeout?: number, signalCb?: AppSignalCb): Promise<AppWebsocket>;
    _requester: <ReqO, ReqI, ResI, ResO>(tag: string, transformer?: Transformer<ReqO, ReqI, ResI, ResO> | undefined) => (req: ReqO, timeout?: number | undefined) => Promise<ResO>;
    appInfo: Requester<AppInfoRequest, AppInfoResponse>;
    callZome: Requester<CallZomeRequestGeneric<any>, CallZomeResponseGeneric<any>>;
}
