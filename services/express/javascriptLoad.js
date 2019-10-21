'use strict';

let dir = __dirname,
    fs = require('fs'),
    javascriptFiles = fs.readdirSync(`${dir}/js`),
    compressor = require('minify'),
    contents = fs.readFileSync(`${dir}/views/partials/scripts.ejs`, 'utf8'),
    topContent = contents.replace(/\<!-- Don't Edit below this line -->(.|[\r\n])+/, ''),
    writecontent = '';

async function awaitArray() {
    let admin = false
    let adminContent = '';
    let adminTopContent;
    let newFile;
    let both = false;
    await Functions.asyncForEach(javascriptFiles, async (file) => {
        admin = false;
        both = false;
        async function setAdmin(bothSet) {
            if(bothSet) both = true;
            admin = true;
            let contents = await fs.readFileSync(`${dir}/views/partials/admin/scripts.ejs`, 'utf8');
            adminTopContent = await contents.replace(/\<!-- Don't Edit below this line -->(.|[\r\n])+/, '');
        }

        let adminCheck = {
            
            'adminApp.js': {both:false},
            '9-getFunctions.js': {both:true},
            '8-postFunctions.js': {both:true},
            '5-datatables.js': {both:true},
            '6-datatables-select.js' : {both:true},
            '6-dataTables-buttons.js' : {both:true},
            '6-dataTables-editor.min.js' : {both:true},
            '2-jquery-ui.js' : {both:true},
            '6-buttons-print.min.js' : {both:true},
            '6-dataTables.colReorder.js' : {both:true},
            '6-dataTables-responsive.js' : {both:true},
            'moment.js' : {both:true},
            'mgSync.js' : {both:true},
            'sockets.js' : {both:true},
            'letterAvatars.js' : {both:true},
            '9-toastr.min.js' : {both:true}
        }

        if(adminCheck[file]) await setAdmin(adminCheck[file].both);

        let filePath = `${dir}/js/${file}`,
            contents = await fs.readFile(filePath, 'utf8'),
            newFile = file.replace(/\d+-/, ''),
            newFilePath = `${dir}/public/js/${newFile}`;

        if (config.express.minify) {
            var promise = compressor.minify({
                compressor: config.express.minify,
                input: filePath,
                output: newFilePath
            });

            promise.then(function (min) { });

        } else {

            fs.writeFile(newFilePath, contents);

        }

        if(admin) {
        adminContent += `<script src="/js/${newFile}"></script>\n`
        } else {
            writecontent += `<script src="/js/${newFile}"></script>\n`
        }

        if(both) {
            writecontent += `<script src="/js/${newFile}"></script>\n`
        }
        
    });


     
        
        fs.writeFile(`${dir}/views/partials/admin/scripts.ejs`, `${adminTopContent}<!-- Don't Edit below this line -->\n${adminContent}`);

        
        fs.writeFile(`${dir}/views/partials/scripts.ejs`, `${topContent}<!-- Don't Edit below this line -->\n${writecontent}`);
    
    

}

module.exports = awaitArray();