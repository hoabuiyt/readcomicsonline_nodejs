const express = require("express");
const cheerio = require("cheerio");
const fetch = require("node-fetch");
const router = express.Router();
 
router.get("/:comicTitle", async (req, res) => {
  const endPoint = `https://readcomicsonline.ru/comic/${req.params.comicTitle}`;
  const result = await fetch(endPoint);
  const response = await result.text();
  const $ = cheerio.load(response);
 
  const errorPage = $(".error-content p").text();
 
  if (errorPage === "We could not find the page you were looking for.") {
    res.status("404").send("Comic Not Found");
    return;
  }
  const comics = [];
 
  const getTitle = $(".listmanga-header")
    .eq(0)
    .text()
    .trim();
  const getSummary = $("div.manga.well p")
    .text()
    .trim()
    .replace(/\r?\n|\r/g, " ");
  const getImage = $(".boxed img").attr("src");
  const getAuthors = $(".dl-horizontal dd")
    .eq(3)
    .text()
    .trim();
 
  // Chapters Object
  const chapters = [];
  const listChapters = $("ul.chapters li").each((i, item) => {
    const $item = $(item);
    const chapterTitle = $item
      .find(".chapter-title-rtl")
      .text()
      .trim();
    const chapterLink = $item.find(".chapter-title-rtl a").attr("href");
    const link = `${req.params.comicTitle}/${chapterLink.substr(
      chapterLink.lastIndexOf("/") + 1
    )}`;
    const uploadDate = $item
      .find(".date-chapter-title-rtl")
      .text()
      .trim();
    const chapter = {
      title: chapterTitle,
      link: link,
      uploadDate: uploadDate
    };
    chapters.push(chapter);
  });
 
  // Tags Object
  const tags = [];
 
  const listTags = $(".tag-links a").each((i, item) => {
    const $item = $(item);
    const tagName = $item.text();
 
    const tag = {
      name: tagName
    };
 
    tags.push(tag);
  });
 
  const comic = {
    title: getTitle,
    image: getImage,
    authors: getAuthors,
    tags: tags,
    summary: getSummary,
    chapters
  };
 
  comics.push(comic);
 
  res.send(comics);
});
 
module.exports = router;