import { AppWebsocket, CellId } from '@holochain/conductor-api';
export default function lenses(appWebsocket: AppWebsocket, cellId: CellId): {
    standalone: {
        name: string;
        render(root: ShadowRoot): void;
    }[];
    entryLenses: {};
    attachmentsLenses: never[];
};
