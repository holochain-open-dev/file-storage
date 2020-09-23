import { Buffer } from 'buffer';

export function randomByte() {
  return Math.floor(Math.random() * 1000) % 256;
}

export function randomHash() {
  return {
    hash: Buffer.from(
      Array(35)
        .fill(false)
        .map(_ => randomByte())
    ),
    hash_type: Buffer.from(
      Array(3)
        .fill(false)
        .map(_ => randomByte())
    ),
  };
}
