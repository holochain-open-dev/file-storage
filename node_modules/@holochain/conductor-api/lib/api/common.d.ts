/**
 * Take a Requester function which deals with tagged requests and responses,
 * and return a Requester which deals only with the inner data types, also
 * with the optional Transformer applied to further modify the input and output.
 */
export declare const requesterTransformer: <ReqO, ReqI, ResI, ResO>(requester: Requester<Tagged<ReqI>, Tagged<ResI>>, tag: string, transform?: Transformer<ReqO, ReqI, ResI, ResO>) => (req: ReqO, timeout?: number | undefined) => Promise<ResO>;
export declare type Transformer<ReqO, ReqI, ResI, ResO> = {
    input: (req: ReqO) => ReqI;
    output: (res: ResI) => ResO;
};
export declare type Requester<Req, Res> = (req: Req, timeout?: number) => Promise<Res>;
export declare type RequesterUnit<Res> = () => Promise<Res>;
export declare type Tagged<T> = {
    type: string;
    data: T;
};
