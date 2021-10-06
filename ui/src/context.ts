import { createContext, Context } from '@lit-labs/context';
import { FileStorageService } from './services/file-storage.service';

export const fileStorageServiceContext: Context<FileStorageService> =
  createContext('hc_zome_file_storage/file-storage-servce');
