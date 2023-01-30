import Dropzone, { DropzoneOptions } from "dropzone";
import { FileStorageClient } from "./file-storage-client";

export class HolochainDropzone extends Dropzone {
  fileStorageClient: FileStorageClient;
  constructor(
    el: HTMLElement,
    fileStorageClient: FileStorageClient,
    options: DropzoneOptions
  ) {
    options.url = "https://holochain.org/"; // just to bypass the check.
    super(el, options);
    this.fileStorageClient = fileStorageClient;
  }

  uploadFiles(files: Dropzone.DropzoneFile[]) {
    this._uploadFilesToHolochain(files);
  }

  async _uploadFilesToHolochain(
    dropzoneFiles: Dropzone.DropzoneFile[]
  ): Promise<void> {
    for (const file of dropzoneFiles) {
      try {
        this.emit("sending", file, undefined, undefined);
        const hash = await this.fileStorageClient.uploadFile(
          file,
          (percentatge, bytesSent) => {
            this.emit("uploadprogress", file, percentatge * 100, bytesSent);
          }
        );
        this.emit("success", file, undefined);
        (file as any).hash = hash;
        this.emit("complete", file);
      } catch (e) {
        console.error(e);
        this.emit("error", file, (e as any).data.data);
      }
    }
  }
}
