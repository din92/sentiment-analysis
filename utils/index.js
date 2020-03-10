
module.exports=(common)=>{
    return {
        requirePathNoCache:(path)=>{
            delete require.cache[require.resolve(path)];
            return require(path)
        }
    };

};