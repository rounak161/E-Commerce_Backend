import multer from "multer";

const storage = multer.memoryStorage();

export const singleUpload = multer({ storage }).single("file");

// const storage = multer.memoryStorage();

// export const singleUpload = multer({ storage }).single("file");


// import multer from "multer";

// const storage = multer.memoryStorage();

// export const singleUpload = multer({ storage, dest: "../data/" }).single("file");
