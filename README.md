# pug-to-react-element

A plugin for producing React elements from Pug templates without JSX

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Syntax](#syntax)
- [Support](#support)
- [Contributing](#contributing)

## Installation

A plugin does not download any packages but require React module.

```sh
npm i pug-to-react-element
```

## Usage

### API

- `pre(markup)` - transforms Pug template string markup into React element structure. It is exported as default. A static property `tabSize` defines markup indentation.
- `getID()` - generates unique string. Can be used for React element "key" property.

### Example

Create React component `MyComponent.js`:

```sh
import React, { Component } from "react";
import pre from "pug-to-react-element";

// config indentation size in range from 2 (default) to 4 if it needs
// pre.tabSize = 4;

const markup = `

div() 0#[span() 1]2#[span() 3]4
div()
  div() 5
    6
    span() 7
    8
div() 9
    div() 10
      div() 11
    input(type="tel" required)

`;

class MyComponent extends Component {
	render() {
		return pre(markup);
	}
}

export default MyComponent;
```

Use it:

```sh
import ReactDOM from "react-dom";
import React, { Component } from "react";
import MyComponent from "./components/MyComponent.js";

const   root = document.querySelector("#root"),
        myComponent = new MyComponent().render();

ReactDOM.render(myComponent, root);
```

## Syntax

A plugin uses limited [pug](https://pugjs.org/api/getting-started.html) syntax. Here is a list of supported constructions:

```sh
// creates <div></div>
div()

// creates <input id="id0" className=".div" required>
input(id="id0" className=".div" required)

// creates <p>Lorem ipsum</p>
p() Lorem ipsum

// creates <div></div><p></p>
div()
p()

// creates <div><p></p></div>
div()
    p()

// creates <div>0<span>1</span>2</div>
div() 0#[span() 1]2
```

## Support

Please [open an issue](https://github.com/Fewed/Pug-to-React-elements/issues/new) for support.

## Contributing

Please contribute using [Github Flow](https://guides.github.com/introduction/flow/). Create a branch, add commits, and [open a pull request](https://github.com/Fewed/Pug-to-React-elements/compare).
