let fs = require("fs");
const path = require("path");

const artifacts = ["README.md", "CHANGELOG.md", "LICENSE.md"];

fs.copyFile(
  path.join(__dirname, "../dist/angular-monnify/package.json"),
  path.join(__dirname, "../projects/angular-monnify/package.json"),
  (err) => {
    if (err) {
      console.log("An error occurred", err.message);
    } else {
      console.log(`PACKAGE.JSON copied.`);
    }
  }
);
