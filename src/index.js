const l = console.log.bind(console);

const axios = require("axios"),
  { createWriteStream, existsSync, mkdirSync } = require("fs");

const loader = (courseURL, dataSize = "all", baseDir) => {
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

    if (!baseDir) baseDir = dir;
    if (dataSize === "all") dataSize = lessonsNumber;
    let counter = dataSize - 1;
    const route = id => `/lesson${id}.mp4`;

    for (let i = 1; i < dataSize + 1; i++) {
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
