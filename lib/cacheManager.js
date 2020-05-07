var fs = require('fs');

class CacheManager {
    constructor(params) {
        //Make sure that path "./cache/" exists or create it
        if(!fs.existsSync("./cache/"))
            fs.mkdirSync("./cache/");
        var name = "";
        for (var prop in params) {
            /**
             * Make sure the property did actually exists (and avoid fails if property name is "hasOwnProperty")
             * Also make sure that the access token isn't part of the name file.
             */
            if (Object.prototype.hasOwnProperty.call(params, prop) && prop !== "access_token") {
                name += params[prop] + '_';
            }
        }
            var date = new Date();
            this.filePath = `./cache/${name}${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}`
    }
    
    async findCache() {
        if(fs.existsSync(this.filePath)){
            return await JSON.parse(fs.readFileSync(this.filePath, 'utf-8'));
        }
        return false;
    }

    async writeCache(data) {
        fs.writeFile(this.filePath, JSON.stringify(data), err => {
            if(err) throw err;
            console.log(`${this.filePath} saved`);
        });
    }
}

module.exports =  CacheManager;