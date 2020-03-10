let router = require("express-router");

module.exports =(common)=>{
    let routes=[
        {route:"/api",key:"sentimentAPI",routePath:"../api/sentiment_api"}
    ];
    if(!common.routes) common.routes={};
    let checkAllRoutes=(routes)=>{
        for(let route of routes){
            if(route.route && route.routePath && !common.routes[route.route]){
                let r =  new (common.utils.requirePathNoCache(route.routePath))(common);
                common.routes[route.route]=r;
                if(route.key) common[route.key] =  r;
            }
        }
    };

    checkAllRoutes(routes)
};
