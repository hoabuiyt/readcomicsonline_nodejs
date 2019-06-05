const express = require("express");
const cheerio = require("cheerio");
const fetch = require("node-fetch");
const router = express.Router();

router.get("/:comicTitle/:chapter", async (req, res) => {
    const title = req.params.comicTitle;
    const chapter = req.params.chapter;
   
    const url = `https://readcomicsonline.ru/comic/${title}/${chapter}`;
   
    const response = await fetch(url);
    const body = await response.text();
    const $ = cheerio.load(body);
   
    const errorPage = $("h1.break-long-words").text();
   
    if (errorPage === "Whoops, looks like something went wrong.") {
      res.status("404").send("Comic Not Found");
      return;
    }
   
    const pages = [];
    const listPages = $("#all img").each((i, item) => {
      const $item = $(item);
      const id = i;
      const image = $item.attr("data-src").trim();
      const page = {
        id,
        image
      };
      pages.push(page);
    });
    res.send(pages);
  });

  module.exports = router;