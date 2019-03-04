# coursehunters-downloader

A plugin for downloading video from https://coursehunters.net

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Support](#support)
- [Contributing](#contributing)

## Installation

```sh
npm i coursehunters-downloader
```

## Usage

Create `index.js`:

```sh
// get loader function, check "Options" section for details
const loader = require("./coursehunters-downloader");

const url = "https://coursehunters.net/course/regulyarnye-vyrazheniya";

loader(url);

```

Run script with:

```sh
node index.js
```

### Options

- `loader(courseURL, range, baseDir)` - downloads video files from `courseURL` base route and saves it as .mp4 to `baseDir` folder. `range` attribute defines it's id range. By default `baseDir` is defined by the end of `courseURL` and `range` includes full course video list.

Here is a list of supported `range` attribute configurations:

```sh
// downloads videos from 2nd up to last inclusively
loader(url, {from: 2});

// downloads videos from 1st up to 5th inclusively
loader(url, {to: 5});

// downloads videos from 3rd up to 7th inclusively
loader(url, {from: 3, to: 7});

// downloads 1st, 3rd, 4th videos
loader(url, {from: [1, 3, 4]});

// effect is the same
loader(url, {to: [1, 3, 4]});
```

## Support

Please [open an issue](https://github.com/Fewed/coursehunters-downloader/issues/new) for support.

## Contributing

Please contribute using [Github Flow](https://guides.github.com/introduction/flow/). Create a branch, add commits, and [open a pull request](https://github.com/Fewed/coursehunters-downloader/compare).
