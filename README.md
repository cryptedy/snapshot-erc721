# Snapshot for ERC721 with Alchemy Transfers API

This reposity provide snapshot function for ERC721 with Alchemy Transfer API.

## How to use

### Preparation

After clone this repositry and change directory:
```
npm install
```

You have to sign in Alchemy, make the Apps to connection the block chain which the NFT that you want snapshot was deployed and get the endpoint URL and your API KEY!

### Execute

```
node index.js
```

### Setting

`.env` must be prepared to specify Alchemy url and API KEY
You can copy sample from `.env.example`.

- `ETHEREUM_URL` : ethereum URL and API KEY
- `POLYGON_URL` : polygon URL and API KEY


`snapshot.config.json` is the setting file.

- `chain` : snapshot chain, "ethereum" and "polygon" are avaible now.
- `output` : output filenames, default directory is `.snapshot`.
  - `ownerOf` : filename for tokenIds and their owner addresses
  - `balanceOf` : filename for owner addresses and token balances
- `params` : request parameters for alchemy API. Please see https://docs.alchemy.com/alchemy/enhanced-apis/transfers-api .
  - `fromBlock` : first block number to query
  - `toBlock` : last block number to query
  - `contractAddresses` : array of contract addresses
 
  Attension: `category` is specified by this program.

That's all! Enjoy!


