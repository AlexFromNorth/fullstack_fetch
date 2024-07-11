import axios from "axios";

export const getList = async () => {
  const response = await axios
    .get("http://localhost:3000/folder/list")
    .then((response) => {
      console.log(response.data);
      return response.data;
    })
    .catch((error) => console.error("Error fetching data:", error));
};

export const getFolder = async (id: number) => {
  const response = await axios
    .get(`http://localhost:3000/folder/${id}`)
    .then((response) => {
      console.log(response.data);
      return response.data;
    })
    .catch((error) => console.error("Error fetching data:", error));
};

export const addChild = async (title: string, parentId: number) => {
  const response = await axios
    .post(`http://localhost:3000/folder/create/${parentId}`, { title })
    .then((response) => {
      console.log(response.data);
      return response.data;
    })
    .catch((error) => console.error("Error adding folder:", error));
};

export const deleteFolder = async (id: number) => {
  const response = await axios
    .delete(`http://localhost:3000/folder/delete/${id}`)
    .then((response) => {
      console.log(response.data);
      return response.data;
    })
    .catch((error) => console.error("Error deleting folder:", error));
};

export const editFolder = async (title: string, id: number) => {
  const response = await axios
    .put(`http://localhost:3000/folder/update/${id}`, { title })
    .then((response) => {
      console.log(response.data);
      return response.data;
    })
    .catch((error) => console.error("Error editing folder:", error));
};