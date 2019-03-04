const l = console.log.bind(console);

const axios = require("axios"),
  { createWriteStream, existsSync, mkdirSync } = require("fs");

const loader = (courseURL, { from, to }, baseDir) => {
  const getURLs = async url => {
    const list = {
        from: `<ul id="lessons-list" class="lessons-list">`,
        to: "</ul>"
      },
      link = {
        from: `<link href="`,
        to: `" `
      };

    let data;
    try {
      ({ data } = await axios.get(url, { responseType: "text" }));
    } catch (e) {
      l("Request error!");
      return {};
    }

    let ul = data.slice(data.indexOf(list.from) + list.from.length);
    ul = ul.slice(0, ul.indexOf(list.to));
    const lessonsNumber = ul.match(/<\/li>/g).length;

    let baseURL = ul.slice(ul.indexOf(link.from) + link.from.length);
    baseURL = baseURL.slice(0, url.indexOf(link.to));
    baseURL = baseURL.match(/(.*?\/\/.*?\/.*?)\//)[1];
    const dir = baseURL.match(/\/([\w-]*$)/)[1];

    return { baseURL, lessonsNumber, dir };
  };

  const loadVideos = async () => {
    const { baseURL, lessonsNumber, dir } = await getURLs(courseURL);
    if (!baseURL) return;

    const getRange = (from = 1, to = lessonsNumber) => {
      if (Array.isArray(from)) return from;
      if (Array.isArray(to)) return to;

      if (typeof (from + to) !== "number") {
        l(
          `Invalid data type! typeof (from) is ${typeof from}, typeof (to) is ${typeof to}`
        );
        return undefined;
      }

      from = Math.max(from, 1);
      to = Math.min(to, lessonsNumber);

      const arr = [];
      for (let i = from; i < to + 1; i++) arr.push(i);
      return arr;
    };

    if (!baseDir) baseDir = dir;
    const range = getRange(from, to);
    if (!range) return;
    let counter = range.length - 1;
    const route = id => `/lesson${id}.mp4`;

    for (let i of range) {
      let data;
      try {
        ({ data } = await axios.get(baseURL + route(i), {
          responseType: "stream"
        }));
      } catch (e) {
        l("Request error!");
        return;
      }

      if (!existsSync(baseDir)) mkdirSync(baseDir);
      const write = createWriteStream(baseDir + route(i));
      write.on("close", () => {
        l(`lesson${i} is ready!`);
        if (!counter--) l("Loading is finished!");
      });
      data.pipe(write);
    }
  };

  loadVideos();
};

module.exports = loader;
