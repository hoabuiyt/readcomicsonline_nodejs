const express = require("express");
const cheerio = require("cheerio");
const fetch = require("node-fetch");
const router = express.Router();
 
router.get("/:page", async (req, res) => {
  const page = req.params.page;
  const endPoint = `https://readcomicsonline.ru/filterList?page=${page}&cat=&alpha=&sortBy=last_release&asc=true&author=&tag=`;
  console.log('endPoint',endPoint);
  const result = await fetch(endPoint);
  const response = await result.text();
  const $ = cheerio.load(response);
 
  const errorPage = $(".error-content p").text();
 
  if (errorPage === "We could not find the page you were looking for.") {
    res.status("404").send("Comic Not Found");
    return;
  }
  const comicsList = [];

  const listPages = $("body div.col-sm-6").each((i, item) => {  
    const id = i;
    const url = $('a','.media-left', item).attr("href").trim(); 
    const image = 'http:' +  $('img','.media-left a', item).attr("src").trim(); 
    const title = $('img','.media-left a', item).attr("alt").trim(); 
    const comic = {
      id,
      url,
      image,
      title
    };
    comicsList.push(comic);
  });

  //
  // const totalPage = $(".pagination").each((i, item) => {  
  //   const id = i;
  //   const url = $('li' , item).attr("href").text(); 
  // });
  // console.log('totalPage',totalPage);
  res.send(comicsList);
});
 
module.exports = router;