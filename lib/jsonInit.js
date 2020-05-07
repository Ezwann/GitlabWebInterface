var inquirer = require("inquirer"),
    fs = require('fs');

const questions = [
    {
        name: "api_key",
        type: "password",
        validate: value => value.length?true:"This field is required",
    },
    {
        name: "project_id",
        type: "input",
        validate: value => value.length?true:"This field is required",
    },
    {
        name: "url",
        type: "input",
        validate: value => value.length?true:"This field is required",
        default: "https://gitlab.com/api/v4/"
    },
]

const sub_question = [
    {
        name: "use_previous",
        type: "list",
        choices: ["yes", "no"],
        message: "Use previous config.json ?\n"
    }
]

module.exports = async function() {
    try {
        if(fs.existsSync("./config/config.json")) {
            console.log(JSON.parse(fs.readFileSync("./config/config.json", 'utf-8')));
            var sub_res = await inquirer.prompt(sub_question);
            if(sub_res.use_previous === "yes")
                return JSON.parse(fs.readFileSync("./config/config.json", 'utf-8'));
        }
        var res = await inquirer.prompt(questions);
        if(!fs.existsSync("./config/"))
            fs.mkdirSync('./config/');
        fs.writeFileSync('./config/config.json', JSON.stringify(res), {encoding:'utf-8', flag: 'w'});
        return JSON.parse(fs.readFileSync("./config/config.json", 'utf-8'));
    } catch(e) {
        console.error(e.message);
        return false;
    }
}