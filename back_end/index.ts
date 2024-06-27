import { Folder } from "./types/types";
import express from "express";
import fs from "fs";
import jsonDb from "./db/store.json";
const app = express();
const rootFolder: Folder = jsonDb;

app.use(express.json());

//get/list
app.get("/folder/", (req, res) => {
  res.send(rootFolder);
});

//get/folder
app.get("/folder/:folderId", (req, res) => {
  res.json(
    findFolderById(rootFolder, +req.params.folderId) ||
      `Folder with Id ${req.params.folderId} not found`
  );
});

//create/post
app.post("/create/:parentId", (req, res) => {
  if (!req.body) {
    return res.json("ERROR: folder object is required");
  }

  const folder: unknown = req.body;

  if (isFolder(folder)) {
    folder.id = generateFolderId();
    folder.child = [];

    const parentFolder = findFolderById(rootFolder, +req.params.parentId);

    if (!parentFolder) {
      return res.json(`Folder with Id ${req.params.parentId} not found`);
    } else {
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
    return res.json("ERROR: wrong folder structure. Body must be { title: string }");
  }
});

//post update
app.post("/update/:id", (req, res) => {
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
    return res.json("ERROR: wrong folder structure. Body must be { title: string }");
  }
});

function isFolder(folder: unknown): folder is Folder {
  return (
    typeof folder === "object" &&
    folder !== null &&
    "title" in folder &&
    typeof folder.title === "string"
  );
}

function findFolderById(folder: Folder, id: number): Folder | null {
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

// вынести в папку утилс
function generateFolderId() {
  return Math.floor(Math.random() * 100000);
}

// settings
app.listen(3000); //port
