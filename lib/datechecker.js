class Datechecker extends Date {
    constructor(date) {
        if(date.match(/(\d{4})\-(\d{2})\-(\d{2})/g) == null)
            throw Error('Invalid Date format').message
        super(date);
    }
}

module.exports = Datechecker;