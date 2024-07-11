/**
 * Represents a folder structure with nested child folders.
 * @typedef {Object} Folder
 * @property {number} id - The unique identifier of the folder.
 * @property {string} title - The title of the folder.
 * @property {Folder[]} child - An array of child folders nested within this folder.
 */
type Folder = {
    id: number
    title: string
    child: Folder[]
}

export { Folder }
