const express = require("express");
const comicRouter = require("./api/comic");
const chapterRouter = require("./api/chapters");
const comicListRouter = require("./api/comicList");
const app = express();
 
app.use("/api/comic", comicRouter);
app.use("/api/comic/read", chapterRouter);
app.use("/api/comic/list", comicListRouter);
 
app.listen(3000, () => {
  console.log("Server is runnning ...");
});