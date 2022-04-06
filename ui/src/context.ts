import { createContext, Context } from '@holochain-open-dev/context';
import { FileStorageService } from './services/file-storage.service';

export const fileStorageServiceContext: Context<FileStorageService> =
  createContext('hc_zome_file_storage/file-storage-servce');
