const fetch = require("node-fetch");
var tools = require('./tools');
require('dotenv').config();

module.exports = {
    checkId: async function(req, res, next, param) {
        return next(); //TODO
        let user = await(await(await tools.doApiRequest("users/" + req.params.id, "GET", "", false)).json()).data;
        if (req.user._id == user._id || req.user.email == "admin@test.com"){
            return next();
        } else{
            res.json({
                message: 'Authentication failed',
                data: ""
            });
            return;
        }
    },
    checkProjectId: async function(req, res, next) {
        let projectsUsers = await(await(await tools.doApiRequest("projects/" + req.params.projectid + "/users", "GET", "", false)).json()).data;
        let user = await(await(await tools.doApiRequest("users/" + req.user._id, "GET", "", false)).json()).data;
        if(user.role == "ADMIN") return next();

        for(let projectsUser of projectsUsers){
            if (req.user._id == projectsUser.userId){
                return next();
            }
        }

        
    },
    isProdLead: async function(req, res, next) {
        let projectsUsers = await(await(await tools.doApiRequest("projects/" + req.params.projectid + "/users", "GET", "", false)).json()).data;
        let user = await(await(await tools.doApiRequest("users/" + req.user._id, "GET", "", false)).json()).data;
        if(user.role == "ADMIN") return next();

        for(let projectsUser of projectsUsers){
            if (req.user._id == projectsUser.userId && projectsUser.userRole == "PROD_LEAD"){
                return next();
            }
        }

        res.status(403).json({
            message: 'Authentication failed! User is not assigned to this project',
            data: ""
        });
        return;
    },
    isMethKeeperOrProdLead: async function(req, res, next) {
        let projectsUsers = await(await(await tools.doApiRequest("projects/" + req.params.projectid + "/users", "GET", "", false)).json()).data;
        let user = await(await(await tools.doApiRequest("users/" + req.user._id, "GET", "", false)).json()).data;
        if(user.role == "ADMIN") return next();

        for(let projectsUser of projectsUsers){
            if (req.user._id == projectsUser.userId && (projectsUser.userRole == "PROD_LEAD" || projectsUser.userRole == "METH_KEEPER")){
                return next();
            }
        }

        res.status(403).json({
            message: 'Authentication failed! User is not assigned to this project',
            data: ""
        });
        return;
    }
};