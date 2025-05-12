import multer from "multer";

//Using diskStorage to store files in directory

const storage = multer.diskStorage({
  //Destination of file
  destination: function (req, file, cb) {
    //file path in callback
    cb(null, "./public/temp");
  },
  //file name
  filename: function (req, file, cb) {
    //file name in callback
    cb(null, file.originalname);
  },
});

//Middleware
export const upload = multer({
  storage,
});
