import { customAlphabet } from "nanoid";

const ID_SEED =
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_";

export default customAlphabet(ID_SEED, 6);
