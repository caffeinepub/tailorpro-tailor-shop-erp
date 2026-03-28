import { localBackend } from "./local-backend";
import type { TailorBackend } from "./tailor-types";

export const backend: TailorBackend = localBackend;
