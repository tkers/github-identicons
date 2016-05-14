# GitHub Identicons

NodeJS implementation of GitHub-like identicons.

Inspired by [infinitemule/github-identicons](https://github.com/infinitemule/github-identicons).

## Install
`npm install github-like-identicons`

## Example

```
var identicon = require("github-like-identicon);
var icon = identicon("Lapixx");

console.log(icon); // { mask : [], color : {} }
```

## API
This module exposes a single function to generate the identicon for a given username.

### createIdenticon(username, algorithm)
Algorithm: (optional) either `md5`, `sha1`, `sha256`, `sha512`.

Returns an object containing:

- **mask**: A 5x5 nested array containing booleans indicating if a pixel is part of the identicon (true) or the background (false)
- **color**: An object containing the keys **r**, **g**, **b** and **h**, **s**, **v**, each with a value in the range (0-255) indicating the colour of the identicon (in RGB and HSV)
