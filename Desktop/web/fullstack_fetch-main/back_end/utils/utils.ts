import  fs  from 'fs';
import { Folder } from "../types/types";
import currentId from "../db/id.json";

export function generateFolderId() {
  fs.writeFileSync('./db/id.json', JSON.stringify({id: ++currentId.id}))
  return currentId.id
}

/**
 * Recursively searches for a folder with the given ID within a nested folder structure.
 * @param {Folder} folder - The root folder to start the search from.
 * @param {number} id - The ID of the folder to find.
 * @returns {Folder|null} The folder object if found, or null if not found.
 */
export function findFolderById(folder: Folder, id: number): Folder | null {
  if (folder.id === id) {
    return folder;
  }

  if (folder.child && folder.child.length > 0) {
    for (const child of folder.child) {
      const found = findFolderById(child, id);

      if (found) {
        return found;
      }
    }
  }

  return null;
}

/**
 * Recursively searches for the parent folder that contains a child folder with the given ID.
 * @param {Folder} folder - The root folder to start the search from.
 * @param {number} id - The ID of the child folder to find the parent for.
 * @returns {Folder|null} The parent folder object if found, or null if not found.
 */
export function findParentFolderById(folder: Folder, id: number): Folder | null {
  if (folder.child.some(child => child.id === id)) {
    return folder;
  }

  if (folder.child && folder.child.length > 0) {
    for (const child of folder.child) {
      const found = findParentFolderById(child, id)

      if (found) {
        return found;
      }
    }
  }

  return null;
}

/**
 * Removes a folder with the given ID from the nested folder structure.
 * @param {Folder} folder - The root folder to start the search from.
 * @param {number} id - The ID of the folder to delete.
 * @returns {boolean} True if the folder was found and deleted, false if not found.
 */
export function deleteFolderById(folder: Folder, id: number): Boolean {
  const parentFolder = findParentFolderById(folder, id) 
  
  if(parentFolder) {
      parentFolder.child = parentFolder.child.filter((child: Folder) => {
          return child.id !== id
      })
  }
  return !!parentFolder
}
