import Dropzone from 'dropzone';
export class HolochainDropzone extends Dropzone {
    constructor(el, fileStorageService, options) {
        options.url = 'https://holochain.org/'; // just to bypass the check.
        super(el, options);
        this.fileStorageService = fileStorageService;
    }
    uploadFiles(files) {
        this._uploadFilesToHolochain(files);
    }
    async _uploadFilesToHolochain(dropzoneFiles) {
        for (const file of dropzoneFiles) {
            try {
                this.emit('sending', file, undefined, undefined);
                const hash = await this.fileStorageService.uploadFile(file, (percentatge, bytesSent) => {
                    this.emit('uploadprogress', file, percentatge * 100, bytesSent);
                });
                this.emit('success', file, undefined);
                // @ts-ignore
                file.hash = hash;
                this.emit('complete', file);
            }
            catch (e) {
                console.error(e);
                this.emit('error', file, e.data.data);
            }
        }
    }
}
//# sourceMappingURL=holochain-dropzone.js.map