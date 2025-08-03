import multer from "multer";
import fs from "fs";
import path from "path";
import { Request } from "express";
import CustomError from "./error-handler.middleware";

export const uploader = () => {
  const fileSize = 5 * 1024 * 1024;

  const allowedExts = ["jpg", "png", "webp", "gif", "svg", "jpeg"];

  const myStorage = multer.diskStorage({
    //diskstorage  function
    destination: (req, file, cb) => {
      const uploadPath = "uploads/";
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },

    filename: (req, file, cb) => {
      //file.jpeg
      const uniqueName = Date.now() + "-" + file.originalname;
      cb(null, uniqueName);            // unique file name banakooo same file name save nahos bhanera
    },
  });

  const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
  ) => {
    //file ko extension nieekalne
    const ext = path.extname(file.originalname).replace(".", ""); // dot file lie dot hatako

    if (allowedExts.includes(ext)) {
      cb(null, true);
    } else {
      const err = new CustomError(`file format ${ext} is not allowed`, 400);
      cb(err);
    }
  };

  const upload = multer({
    storage: myStorage,
    limits: { fileSize },
    fileFilter,
  });
  return upload;
};










// import multer from 'multer'

// export const uploader = () => {
//     const storage = multer.diskStorage({            //diskstorage  function
//         destination: function (req, file, cb) {
//             cb(null, 'uploads/')
//         },
//         filename: function (req, file, cb) {
//             const uniqueSuffix = Date.now() + '-' + file.originalname
//             cb(null, file.originalname + '-' + uniqueSuffix)   // yo filename rakheko file unique hunxa
//         },
//     })

//     const upload = multer({ storage })
//     return upload;
// };
