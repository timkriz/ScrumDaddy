const fetch = require("node-fetch");
require('dotenv').config();

module.exports = {
    doApiRequest: async function (path, method, data, jsonf){
        let response;
        console.log('http://' + process.env.HOSTNAME + ':8080/api/' + path);
        if (jsonf){
            response = await fetch('http://' + process.env.HOSTNAME + ':8080/api/' + path, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + process.env.ADMIN_TOKEN
                },
                body: JSON.stringify(data),
            });
        } else {
            response = await fetch('http://' + process.env.HOSTNAME + ':8080/api/' + path, { method: method, headers: {'Authorization': 'Bearer ' + process.env.ADMIN_TOKEN}});
        }
        return response;
    },
};