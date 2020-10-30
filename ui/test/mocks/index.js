import { FileStorageMock } from './file-storage.mock';
import { AppWebsocketMock, DnaMock } from 'holochain-ui-test-utils';
import ConductorApi from '@holochain/conductor-api';

export function getAppWebsocket() {
  if (process.env.CONDUCTOR_URL)
    return ConductorApi.AppWebsocket.connect(process.env.CONDUCTOR_URL);
  const dnaMock = new DnaMock({
    file_storage: new FileStorageMock(),
  });
  return new AppWebsocketMock([dnaMock]);
}
