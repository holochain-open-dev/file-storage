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
      await this.fileStorageService.uploadFile(file)
    }
  }
}
