const fs = require('fs');

function writeTextFile(filepath, output) {
    fs.appendFileSync(filepath, output + "\n", { flag: "a+" }, (err, data) => {
        if (err) {
          console.log("Error @ Write Text File: " + err);
        }
      });
}

module.exports = writeTextFile;