import { customAlphabet } from 'nanoid';

const ID_SEED =
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const nanoid = customAlphabet(ID_SEED, 6);
