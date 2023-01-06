const storage = require("./firebaseSetup");
const { ref, deleteObject } = require("firebase/storage");

const deleteImage = async (url) => {
  if (url) {
    const oldRef = ref(storage, url);
    await deleteObject(oldRef).catch(() => {
      throw new Error("server_error");
    });
  }
};
module.exports = { deleteImage };
