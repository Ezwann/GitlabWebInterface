var jsonInit = require('./jsonInit'),
    chalk = require('chalk'),
    querier = require('./querier'),
    fs = require('fs');

class GitLab {
    help() {
        console.log(chalk.redBright("Help :\n"));
        console.log(chalk.yellow("Commands available :"));
        console.log(chalk.red('node index.js --init'));
        console.log(chalk.yellow('Init a new config.json file'));
        console.log(chalk.red('node index.js --stats --created_after YYYY-MM-JJ --created_before YYYY-MM-JJ'));
        console.log(chalk.yellow('Number of issues between two dates'));
        console.log(chalk.red('node index.js --closed --created_after YYYY-MM-JJ --created_before YYYY-MM-JJ'));
        console.log(chalk.yellow('List closed issues between two dates'));
        console.log(chalk.red('node index.js --opened --created_after YYYY-MM-JJ --created_before YYYY-MM-JJ'));
        console.log(chalk.yellow('List opened issues between two dates'));
        console.log(chalk.red('node index.js --average --created_after YYYY-MM-JJ --created_before YYYY-MM-JJ'));
        console.log(chalk.yellow('Return average time (in days) for issues resolution between two dates'));
        console.log(chalk.red('node index.js --recent'));
        console.log(chalk.yellow('Return last 20 issues'));
    }

    async init() {
        var jsonData = await jsonInit();
        if(!jsonData)
            console.error('init() failed');
        else if(jsonData.hasOwnProperty("api_key")) {
            this.api_key = jsonData.api_key;
            this.project_id = jsonData.project_id;
            this.url = jsonData.url;
        }
    }

    async issuesStats(created_after, created_before) {
        await this.checkInit();
        var params = {
            created_after: created_after.toString(),
            created_before: created_before.toString(),
            access_token: this.api_key,
            scope: "all",
            name: 'stats'
        }
        var res = await querier(`${this.url}projects/${this.project_id}/issues_statistics`, params)
        return res;
    }

    async listRecentIssues() {
        await this.checkInit();
        var params = {
            access_token: this.api_key,
            name: "issue"
        }
        var res = await querier(`${this.url}projects/${this.project_id}/issues`, params);
        return res;
    }

    async listClosedIssues(created_after, created_before) {
        await this.checkInit();
        var params = {
            created_after: created_after.toString(),
            created_before: created_before.toString(),
            state: "closed",
            access_token: this.api_key,
            name: "closed"
        }
        var res = await querier(`${this.url}projects/${this.project_id}/issues`, params);
        return res;
    }

    async listOpenedIssues(created_after, created_before) {
        await this.checkInit();
        var params = {
            created_after: created_after.toString(),
            created_before: created_before.toString(),
            state: "opened",
            access_token: this.api_key,
            name: "opened"
        }
        var res = await querier(`${this.url}projects/${this.project_id}/issues`, params);
        return res;

    }

    async averageOpenTime(created_after, created_before) {
        var ret = [];
        await this.checkInit();
        var res = await this.listClosedIssues(created_after, created_before);
        res.forEach(e => {
            var dt1 = new Date(e.created_at),
                dt2 = new Date(e.closed_at),
                diff = Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) /(1000 * 60 * 60 * 24));
            ret.push({'id': e.id, 'title': e.title, 'nbDays': diff})
        })
        return ret;
    }

    async checkInit() {
        if(fs.existsSync('./config/config.json')) {
            var config = JSON.parse(fs.readFileSync('./config/config.json', 'utf-8'));
            this.api_key = config.api_key;
            this.project_id = config.project_id;
            this.url = config.url;
        } else
            await this.init();
    }
}

module.exports = new GitLab;