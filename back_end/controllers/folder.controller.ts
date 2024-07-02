import fs from "fs";
import { Request, Response } from "express";
import {
  deleteFolderById,
  findFolderById,
  generateFolderId,
} from "../utils/utils";
import { isFolder } from "../types/typeGuards";
import rootFolder from "../db/store.json";

export function getFolders(req: Request, res: Response) {
  res.json(rootFolder);
}

export function getFolder(req: Request, res: Response) {
  res.json(
    findFolderById(rootFolder, +req.params.folderId) ||
      `Folder with Id ${req.params.folderId} not found`
  );
}

export function createChildFolder(req: Request, res: Response) {
  if (!req.body) {
    return res.json("ERROR: folder object is required");
  }

  const folder: unknown = req.body;

  if (isFolder(folder)) {
    const parentFolder = findFolderById(rootFolder, +req.params.parentId);

    if (!parentFolder) {
      return res.json(`Folder with Id ${req.params.parentId} not found`);
    } else {
      folder.id = generateFolderId();
      folder.child = [];
      parentFolder.child.push(folder);
      fs.writeFile("./db/store.json", JSON.stringify(rootFolder), (err) => {
        if (err) {
          console.log(err);
          return res.json("ERROR: 500 server error");
        } else {
          return res.json(folder);
        }
      });
    }
  } else {
    return res.json(
      "ERROR: wrong folder structure. Body must be { title: string }"
    );
  }
}

export function updateFolder(req: Request, res: Response) {
  if (!req.body) {
    return res.json("ERROR: folder object is required");
  }

  const folder: unknown = req.body;

  if (isFolder(folder)) {
    const currentFolder = findFolderById(rootFolder, +req.params.id);

    if (!currentFolder) {
      return res.json(`Folder with Id ${req.params.id} not found`);
    } else {
      currentFolder.title = req.body.title;

      fs.writeFile("./db/store.json", JSON.stringify(rootFolder), (err) => {
        if (err) {
          console.log(err);
          return res.json("ERROR: 500 server error");
        } else {
          return res.json(currentFolder);
        }
      });
    }
  } else {
    return res.json(
      "ERROR: wrong folder structure. Body must be { title: string }"
    );
  }
}

export function deleteFolder(req: Request, res: Response) {
  if (+req.params.id === rootFolder.id) {
    return res.json("ERROR: can't remove root folder");
  }

  const isDeleted = deleteFolderById(rootFolder, +req.params.id);

  if (!isDeleted) {
    return res.json(`Folder with Id ${req.params.id} not found`);
  } else {
    fs.writeFile("./db/store.json", JSON.stringify(rootFolder), (err) => {
      if (err) {
        console.log(err);
        return res.json("ERROR: 500 server error");
      } else {
        return res.json(rootFolder);
      }
    });
  }
}
