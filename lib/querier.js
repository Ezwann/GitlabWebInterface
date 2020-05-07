var axios = require('axios'),
    CacheManager = require('./cacheManager');

module.exports = async (url, params) => {
    try {
        var cacheMananger = new CacheManager(params);
        var res = await cacheMananger.findCache();
        if(res)
            return res;
        else {
            //Delete property "name", because isn't a parameter but a part of the url
            delete params.name;
            res = await axios.get(url, {params: params});
            cacheMananger.writeCache(res.data);
        }
        return res.data;
    } catch(e) {
        console.error(e);
        return false;
    }
}