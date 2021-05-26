import Dropzone, { DropzoneOptions } from 'dropzone';
import { FileStorageService } from './services/file-storage.service';

export class HolochainDropzone extends Dropzone {
  fileStorageService: FileStorageService;
  constructor(
    el: HTMLElement,
    fileStorageService: FileStorageService,
    options: DropzoneOptions
  ) {
    options.url = 'https://holochain.org/'; // just to bypass the check.
    super(el, options);
    this.fileStorageService = fileStorageService;
  }

  uploadFiles(files: Dropzone.DropzoneFile[]) {
    this._uploadFilesToHolochain(files);
  }

  async _uploadFilesToHolochain(
    dropzoneFiles: Dropzone.DropzoneFile[]
  ): Promise<void> {
    for (const file of dropzoneFiles) {
      try {
        this.emit('sending', file, undefined, undefined);
        const hash = await this.fileStorageService.uploadFile(
          file,
          (percentatge, bytesSent) => {
            this.emit('uploadprogress', file, percentatge * 100, bytesSent);
          }
        );
        this.emit('success', file, undefined);
        // @ts-ignore
        file.hash = hash;
        this.emit('complete', file);
      } catch (e) {
        this.emit('error', file, e.data.data);
        console.error(e);
      }
    }
  }
}
