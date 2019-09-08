const express = require('express');
const router = express.Router();
const request = require('request');
const fs = require('fs');

router.get('/', (req, res) => {
    getJson(function(response){
        res.write(response);
        fs.writeFile('temp/testData.json', response, (err) => {
            if (err) throw err;
        });
        res.end();
    });
});

function getJson(callback) {
    request.get('https://data-endpoint.herokuapp.com/data', (err, res, body) => {
        if (err) { return callback(err); }
        let tempBody = JSON.parse(body);
        let results = [];
        for(let a in tempBody) {
            if(tempBody[a]) {
                results.push(filterData(tempBody[a]));
            }
        }
        results = JSON.stringify(results);
        return callback(results);
    });
}

function filterData(item, index) {
    let filtered = {};
    if(item.hasOwnProperty('firstName') && item.firstName !== null && item.firstName !== '') {
        let tempFirstName = item.firstName.split(' ');
        if(tempFirstName.length > 1) {
            if(!item.hasOwnProperty('lastName') || item.lastName === null || item.lastName === '') {
                filtered.firstName = tempFirstName[0];
                filtered.lastName = tempFirstName[1];
            }
        }else {
            filtered.firstName = tempFirstName[0];
        }
    }else{
        filtered.firstName = 'N/A';
    }
    if(item.hasOwnProperty('lastName') && item.lastName != null && item.lastName !== '') {
        let tempLastName = item['lastName'].split(' ');
        if(tempLastName.length > 1) {
            if(!item.hasOwnProperty('firstName') || item.firstName == null || item.firstName === '' || item.firstName === 'N/A') {
                filtered.firstName = tempLastName[0];
                filtered.lastName = tempLastName[1];
            }
        }else {
            filtered.lastName = tempLastName[0];
        }
    }else{
        if(!filtered.lastName) {
            filtered.lastName = 'N/A';
        }
    }
    if(item.hasOwnProperty('phone')) {
        if(typeof item.phone != 'string') {
            item.phone = String(item.phone);
            if(item.phone.length === 10) {
                filtered.phone = item.phone.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
            }else {
                filtered.phone = 'N/A';
            }
        }else {
            filtered.phone = item.phone;
        }
    }else{
        filtered.phone = 'N/A'
    }
    if(item.hasOwnProperty('email')) {
        if(!validateEmail(item.email)) {
            filtered.email = 'N/A'
        }else {
            filtered.email = item.email;
        }
    }else{
        filtered.email = 'N/A'
    }
    return filtered;
}

function validateEmail(email) {
    let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

module.exports = router;
