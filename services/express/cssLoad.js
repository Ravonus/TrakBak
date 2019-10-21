'use strict';

let dir = __dirname,
    fs = require('fs'),
    cssFiles = fs.readdirSync(`${dir}/scss`),
    compressor = require('minify'),
    contents = fs.readFileSync(`${dir}/views/partials/head.ejs`, 'utf8'),
    topContent = contents.replace(/\<!-- Don't Edit below this line -->(.|[\r\n])+/, ''),
    writecontent = '';

async function awaitArray() {

    await Functions.asyncForEach(cssFiles, async (file) => {

        let filePath = `${dir}/scss/${file}`,
            contents = await fs.readFile(filePath, 'utf8'),
            newFile = file.replace(/\d+-/, ''),
            newFilePath = `${dir}/public/css/${newFile}`;

        if (config.express.cssMinify) {
            var promise = compressor.minify({
                compressor: config.express.cssMinify,
                input: filePath,
                output: newFilePath
            });

            promise.then(function (min) { });

        } else {

        

            fs.writeFile(newFilePath, contents);

        }

        writecontent += `<link rel="stylesheet" href="/css/${newFile}">\n`

    });

    fs.writeFile(`${dir}/views/partials/head.ejs`, `${topContent}<!-- Don't Edit below this line -->\n${writecontent}`);

}

module.exports = awaitArray();