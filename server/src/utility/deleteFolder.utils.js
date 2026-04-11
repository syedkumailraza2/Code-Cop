import fs from "fs";
import path from "path";

export const deleteFolder = async (folderPath) => {
  if (fs.existsSync(folderPath)) {
    fs.rmSync(folderPath, { recursive: true, force: true });
    console.log(`[Cleanup] Deleted: ${folderPath}`);
  } else {
    console.log(`[Cleanup] Path not found, skipping: ${folderPath}`);
  }
};