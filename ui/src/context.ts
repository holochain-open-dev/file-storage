import { createContext } from "@lit/context";
import { FileStorageClient } from "./file-storage-client";

export const fileStorageClientContext = createContext<FileStorageClient>(
  "hc_zome_file_storage/file-storage-client"
);
