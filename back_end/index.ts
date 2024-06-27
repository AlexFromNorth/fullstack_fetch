import { Folder } from "./types/types";

import express from "express";
import fs from "fs";
import jsonDb from "./db/store.json";
const app = express();
const rootFolder: Folder = jsonDb;

//get/list
app.get("/folder/:folderId", (req, res) => {
  // res.send(text[0]);
  res.json(
    findFolderById(rootFolder, +req.params.folderId) ||
      `Folder with Id ${req.params.folderId} not found`
  );
});

app.use(express.json());

//create/post
app.post("/create/:parentId", (req, res) => {
  // res.send("Got a POST request" + req.params.testId);

  if (!req.body) {
    res.json("ERROR: folder object is required");
  }

  const folder: unknown = req.body;

  if (isFolder(folder)) {
    folder.id = generateFolderId();
    folder.child = [];

    const parentFolder = findFolderById(rootFolder, +req.params.parentId);

    if (!parentFolder) {
      res.json(`Folder with Id ${req.params.parentId} not found`);
    } else {
      parentFolder.child.push(folder);
      fs.writeFile("./db/store.json", JSON.stringify(rootFolder), (err) => {
        if (err) {
          res.json("ERROR: 500 server error");
          console.log(err);
        } else {
          res.json(folder);
        }
      });
    }
  } else {
    res.json("ERROR: wrong folder structure. Body must be { title: string }");
  }

  res.send(
    "Got a POST request" +
      JSON.stringify(findFolderById(rootFolder, +req.params.parentId))
  );
});

app.listen(3000); //port

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

function generateFolderId() {
  return Math.floor(Math.random() * 100000);
}
