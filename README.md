# Snapshot for ERC721 with Alchemy Transfers API

This repositry provides snapshot function for ERC721 with Alchemy Transfer API.

## How to use

### Installation

After clone this repositry and change directory:
```
npm install
```

You have to sign in Alchemy, make the Apps to connection the block chain which the NFT that you want snapshot was deployed and get the endpoint URL and your API KEY!

### Usage

After install, you can enter the following in terminal:

```
node index.js
```

## Setting

### 1. `.env`

**`.env` must be prepared to specify Alchemy url and API KEY.**

You can copy sample from `.env.example`.

- `ETHEREUM_URL` : ethereum URL and API KEY
- `POLYGON_URL` : polygon URL and API KEY

### 2. `snapshot.config.json`
This is the setting file.

- `chain` : Snapshot chain, "ethereum" and "polygon" are avaible now.
- `format` : Select format of numbers. Use "decimal", program automatically change from decimal number to hex number with "0x". This option applied to `fromBlock`, `toBlock` and `maxCount`. When you don't select decimal mode, you have to use hex with "0x".
- `output` : Output filenames as json, default directory is `.snapshot`.
  - `ownerOf` : Filename for tokenIds and their owner addresses
  - `balanceOf` : Filename for owner addresses and token balances
- `params` : Request parameters for alchemy API. Please see https://docs.alchemy.com/alchemy/enhanced-apis/transfers-api .
  - `fromBlock` : First block number to query
  - `toBlock` : Last block number to query
  - `contractAddresses` : Array of contract addresses
 
  Attension: `category` is specified by this program.

That's all! Enjoy!

## License

Snapshot ERC721 is released under the MIT license.
