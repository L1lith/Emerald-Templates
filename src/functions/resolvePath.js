const { join, isAbsolute } = require("path");
const normalize = require("normalize-path");

function resolvePath(path, workingDirectory) {
  let output;
  path = normalize(path);
  if (isAbsolute(path)) {
    output = path;
  } else {
    output = join(normalize(workingDirectory), path);
  }
  return output;
}

module.exports = resolvePath;
