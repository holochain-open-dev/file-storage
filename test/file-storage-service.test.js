import { expect } from '@open-wc/testing';

import { FileStorageService } from '../dist';
import { getAppWebsocket } from './mocks';

describe('FileStorageService', () => {
  it('upload a file and retrieve it', async () => {
    const appWebsocket = await getAppWebsocket();

    const appInfo = await appWebsocket.appInfo({ app_id: 'test-app' });

    const cellId = appInfo.cell_data[0][0];

    const fileStorage = new FileStorageService(appWebsocket, cellId);

    const blob = new Uint8Array(Array(4).fill(3));
    const file = new File([blob], 'example.txt', {
      lastModified: Date.now(),
      type: 'txt',
    });

    const fileHash = await fileStorage.uploadFile(file);

    expect(fileHash).to.be.ok;

    const fileResult = await fileStorage.downloadFile(fileHash);

    expect(fileResult.name).to.equal('example.txt');
    const bytes = await fileResult.arrayBuffer();
    expect(new Uint8Array(bytes)[0]).to.equal(3);
  });
});
