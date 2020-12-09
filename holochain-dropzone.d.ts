import Dropzone, { DropzoneOptions } from 'dropzone';
import { FileStorageService } from './services/file-storage.service';
export declare class HolochainDropzone extends Dropzone {
    fileStorageService: FileStorageService;
    constructor(el: HTMLElement, fileStorageService: FileStorageService, options: DropzoneOptions);
    uploadFiles(files: Dropzone.DropzoneFile[]): void;
    _uploadFilesToHolochain(dropzoneFiles: Dropzone.DropzoneFile[]): Promise<void>;
}
