import { encodeHashToBase64, EntryHash } from "@holochain/client";
import { createStore, del, entries, get, set } from "idb-keyval";

const store = createStore("HC_ZOME_FILE_STORAGE", "IMAGES");

interface CachedImage {
  image: string;
  lastRead: number;
}

export async function storeImage(imageHash: EntryHash, image: string) {
  await set(
    imageHash,
    {
      image,
      lastRead: Date.now(),
    },
    store
  );
  clearOldItems();
}

export async function getImage(
  imageHash: EntryHash
): Promise<string | undefined> {
  const image: CachedImage | undefined = await get(imageHash, store);

  if (!image) return undefined;

  storeImage(imageHash, image.image);

  return image.image;
}

const IMAGE_CLEAR_MS = 7 * 24 * 60 * 60 * 1000; // 3 days

async function clearOldItems() {
  const images = await entries<EntryHash, CachedImage>(store);

  for (const [imageHash, image] of images) {
    if (Date.now() - image.lastRead > IMAGE_CLEAR_MS) {
      await del(imageHash, store);
    }
  }
}
