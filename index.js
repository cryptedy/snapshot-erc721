/*
 * Snapshot ERC721
 *
 * Copyright (c) edy
 *   https://github.com/cryptedy
 * 
 * Released under the MIT license.
 * see https://opensource.org/licenses/MIT
 * 
 * Thanks to Alchemy
 * 
 * GitHub repository:
 * see https://github.com/cryptedy/snapshot-erc721
 */

require("dotenv").config();
const axios = require("axios");
const conf = require("./snapshot.config.json");
const fs = require("fs");
const path = require("path");

let cwd = process.cwd();
let ownerList={};
let fnOwner, fnBalance;

const main = async () =>{
    // prepare alchemy endpoint with apikey by chain
    let url;
    switch (conf.chain.toLowerCase()) {
        case "ethereum" :
            url = process.env?.ETHEREUM_URL;
            break;
        case "polygon" :
            url = process.env?.POLYGON_URL;
            break;
        default:
            console.log("ERROR:invalid chain is specified.")
            process.exit(1);
    }

    // check definition of URL in .env
    if (!url){
        console.log("ERROR:URL in .env may be empty. Please check .env file.")
        process.exit(1);
    }

    // check parameters in setting
    if (!conf?.params){
        console.log("ERROR:params in snapshot.config.json is undefined.")
        process.exit(1);
    }

    // set category for erc721
    conf.params.category = ["erc721"];

    // init file path
    if (!conf?.output?.ownerOf  || !conf?.output?.balanceOf){
        console.log("ERROR:output filenames in snapshot.config.json are undefined.")
        process.exit(1);
    }
    fnOwner = path.join(cwd,conf.output.ownerOf);
    fnBalance = path.join(cwd,conf.output.balanceOf);
    if (!fs.existsSync(path.dirname(fnOwner))) fs.mkdirSync(path.dirname(fnOwner));
    if (!fs.existsSync(path.dirname(fnBalance))) fs.mkdirSync(path.dirname(fnBalance));

    // if decimal mode, change numbers from decimal to hex with 0x
    if (conf?.format == "decimal"){
        if (conf.params?.fromBlock){
            if (conf.params?.fromBlock != "latest"){
                conf.params.fromBlock = "0x" + parseInt(conf.params?.fromBlock).toString(16);
            }
        }
        if (conf.params?.toBlock){
            if (conf.params?.toBlock != "latest"){
                conf.params.toBlock = "0x" + parseInt(conf.params?.toBlock).toString(16);
            }
        }
        if (conf.params?.maxCount){
            conf.params.maxCount = "0x" + parseInt(conf.params?.maxCount).toString(16);
        }
    }

    // prepare request contents
    let contents = {
        "jsonrpc": "2.0",
        "id": 0,
        "method": "alchemy_getAssetTransfers",
        "params": [ conf.params ]
         
    };

    // inform request data for user's debuging setting file.
    console.log("Request data as json : ", JSON.stringify(conf.params));

    // execute post loop to alchemy api.
    await requestData(url, contents);

}

const requestData = async (url, data) =>{
    let final = false;    
    await axios.post(url, JSON.stringify(data))
    .then( async(response) =>{
        //check response contents
        if (!response.data?.result){
            console.log("ERROR:result of response does not exist.")
            process.exit(1);
        }
        if (!response.data.result?.transfers){
            console.log("ERROR:Any transfer transactions do not exist.")
            process.exit(1);
        }
        console.log("pageKey : ", response.data.result?.pageKey);
        // At first, check pagenation
        if (typeof response.data.result?.pageKey === "undefined"){
            // final loop
            final = true;
            console.log("reading final json");
        } else{
            console.log("reading json");
            // set pageKey in contents
            data.params[0].pageKey = response.data.result?.pageKey;
        }
        // update owner list
        const transfers = response.data.result.transfers;
        let len = transfers.length;
        for (let i = 0 ; i < len ; i++){
            let id = parseInt(transfers[i].tokenId,16).toString();
            ownerList[id] = transfers[i].to;
        }
        console.log("finish parsing json, the amount of transfer:", len);
    })
    .catch( (error) => {
        console.log(error);
    })
    .finally(async()=>{
        if (!final) {
            // recursive post
            requestData(url, data);
        }else{
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
            // save balanceOf data
            fs.writeFileSync(fnBalance, JSON.stringify(balance));
            // inform success of procession
            console.log("SUCCESS:finish writing the results in the specified filenames.");
        }
    });

}

main();
