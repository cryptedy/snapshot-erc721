# Snapshot for ERC721 with Alchemy Transfers API

This reposity provide snapshot function for ERC721 with Alchemy Transfer API.

## How to use

### Preparation

After clone this repositry:
```
npm install
```

You have to sign in Alchemy, make the Apps to connection the block chain which the NFT that you want snapshot was deployed and get the endpoint URL and your API KEY!

### Execute

```
cd snapshot-erc721
node index.js
```

### Setting

`snapshot.config.json` is the setting file.

- `chain` : snapshot chain, "ethereum" and "polygon" are avaible now.
- `output` : output filenames, default directory is `.snapshot`.
  - `ownerOf` : filename for tokenIds and their owner addresses
  - `balanceOf` : filename for owner addresses and token balances
- `params` : request parameters for alchemy API. Please see https://docs.alchemy.com/alchemy/enhanced-apis/transfers-api .
 
  Attension: `category` is specified by this program.

That's all! Enjoy!


