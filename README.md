# NFTManager
NFT Management Wallet for DAOStack DAOs

### Functions
  - "Send NFT" - transfer a specified NFT (address + id) to any address
  
### Future Considerations
  - "Mint NFT" - Mint new NFTs with the DAO Avatar, and send to any address
  - "Auction/Sell NFT" - Sell or Auction a DAO-owned NFT on a smart-contract based marketplace


# Usage
### Installation / Setup
`npm install`

`npm run build`

### Contract Testing
`truffle test`

### UI Development & Testing
- [Alchemy](https://github.com/daostack/alchemy) is used to interact with the NFTManager from a DAOStack DAO via an interface.
- Follow the Alchemy [instructions](https://github.com/daostack/alchemy#run-app-locally) to deploy a local instance of Alchemy & supporting infrastructure
- Use `npm run start-local <DAO Avatar Address>` to deploy an instance of NFTManager and an NFT contract to use.
  - This could later be expanded to automatically add new GenericScheme + add scheme proposal
