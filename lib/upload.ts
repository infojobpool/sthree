import { mkdir, writeFile } from "fs/promises";
import path from "path";

const types: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export async function saveUpload(value: FormDataEntryValue | null) {
  if (!value || typeof value === "string") return null;
  const file = value as File;
  if (!file.size) return null;
  const ext = types[file.type];
  if (!ext) return null;
  if (file.size > 8 * 1024 * 1024) return null;
  const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
  return `/uploads/${name}`;
}
