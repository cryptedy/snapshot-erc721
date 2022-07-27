require("dotenv").config();
const axios = require("axios");
const conf = require("./snapshot.config.json");
const fs = require("fs");
const path = require("path");

let cwd = process.cwd();
let ownerList={};

const main = async () =>{
    // set category for erc721
    conf.params.category = ["erc721"];
    // prepare alchemy endpoint with apikey by chain
    let url;
    switch (conf.chain.toLowerCase()) {
        case "ethereum" :
            url = process.env.ETHEREUM_URL;
            break;
        case "polygon" :
            url = process.env.POLYGON_URL;
            break;
        default:
            console.log("ERROR:invalid chain is specified.")
            process.exit(1);
    }
    // prepare request contents
    let contents = {
        "jsonrpc": "2.0",
        "id": 0,
        "method": "alchemy_getAssetTransfers",
        "params": [ conf.params ]
         
    };
    // prepare post request header
    let request = {
        headers: {
            "content-Type" : "application/json"
        },
        data : contents
    };

    await requestData(url, contents);

}

const requestData = async (url, data) =>{
    let final = false;    
    await axios.post(url, JSON.stringify(data))
    .then( async(response) =>{
        console.log(response.data.result?.pageKey);
        // At first, check pagenation
        if (typeof response.data.result?.pageKey === "undefined"){
            // final loop
            final = true;
            console.log("final json");
        } else{
            console.log("reading json");
            // set pageKey in contents
            data.params[0].pageKey = response.data.result?.pageKey;
        }
        // update owner list
        let loop = true;
        const transfers = response.data.result.transfers;
        let len = transfers.length;
        for (let i = 0 ; i < len ; i++){
            let id = parseInt(transfers[i].tokenId,16).toString();
            ownerList[id] = transfers[i].to;
        }
        console.log("finish parsing json");
    })
    .catch( (error) => {
        console.log(error);
    })
    .finally(async()=>{
        if (!final) {
            // recursive post
            requestData(url, data);
        }else{
            // init file path
            let fnOwner = path.join(cwd,conf.output.ownerOf);
            let fnBalance = path.join(cwd,conf.output.balanceOf);
            if (!fs.existsSync(path.dirname(fnOwner))) fs.mkdirSync(path.dirname(fnOwner));
            if (!fs.existsSync(path.dirname(fnBalance))) fs.mkdirSync(path.dirname(fnBalance));
            // save ownerOf data 
            fs.writeFileSync(fnOwner, JSON.stringify(ownerList));
            // aggregate balance
            let balance = {};
            for (let i = 0 ; i < Object.keys(ownerList).length ; i++){
                let addr = ownerList[Object.keys(ownerList)[i]];
                if (balance[addr] == null){
                    // add owner in balList and init count
                    balance[addr] = 1;
                } else {
                    balance[addr] += 1;
                }
            }
            fs.writeFileSync(fnBalance, JSON.stringify(balance));

        }
    });

}



main();
