import { Folder } from "./types";

/**
 * Checks if the given value is a Folder object.
 * @param {unknown} folder - The value to check.
 * @returns {folder is Folder} True if the value is a Folder object, false otherwise.
 */
export function isFolder(folder: unknown): folder is Folder {
    return (
        typeof folder === "object" &&
        folder !== null &&
        "title" in folder &&
        typeof folder.title === "string"
    );
}