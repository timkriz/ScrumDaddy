const fetch = require("node-fetch");
var tools = require('./tools');
require('dotenv').config();

module.exports = {
    checkIdVillage: async function(req, res, next, param) {
        let village = await(await(await tools.doApiRequest("villages/" + req.params.idVillage, "GET", "", false)).json()).data; 
        if (req.user._id == village.owner || req.user.email == "admin@test.com"){
            return next();
        } else{
            res.json({
                message: 'Authentication failed',
                data: ""
            });
            return;
        }
    },
    checkBuildingUpgradeId: async function(req, res, next) {
        if (req.user.email == "admin@test.com") return next();
        let villageBuildingUpgrade = await(await(await tools.doApiRequest("villageBuildingUpgrade/" + req.params.upgradeId, "GET", "", false)).json()).data;    
        let village = await(await(await tools.doApiRequest("villages/" + villageBuildingUpgrade.idVillage, "GET", "", false)).json()).data;
        if (req.user._id == village.owner || req.user.email == "admin@test.com"){
            return next();
        } else{
            res.json({
                message: 'Authentication failed',
                data: ""
            });
            return;
        }
    },
    checkResFieldUpgradeId: async function(req, res, next) {
        if (req.user.email == "admin@test.com") return next();
        let villageResFieldUpgrade = await(await(await tools.doApiRequest("villageResFieldUpgrade/" + req.params.upgradeId, "GET", "", false)).json()).data;    
        let village = await(await(await tools.doApiRequest("villages/" + villageResFieldUpgrade.idVillage, "GET", "", false)).json()).data;
        if (req.user._id == village.owner || req.user.email == "admin@test.com"){
            return next();
        } else{
            res.json({
                message: 'Authentication failed',
                data: ""
            });
            return;
        }
    },
};