// test/TokenMaster.mjs
const { expect } = require("chai")
const { ethers } = require("hardhat")
const { tokenToString } = require("typescript")

const NAME = "TokenMaster"
const SYMBOL = "TM"


const OCCASION_NAME = "ETH Texas"
const OCCASION_COST = ethers.utils.parseUnits('1', 'ether')
const OCCASION_MAX_TICKETS = 100
const OCCASION_DATE = "Apr 27"
const OCCASION_TIME = "10:00AM CST"
const OCCASION_LOCATION = "Austin, Texas"



describe("TokenMaster", () => {
  let tokenMaster;
  let deployer, signer; 

  beforeEach(async () => {
    // setup account
    [deployer, signer] = await ethers.getSigners();

    const TokenMaster = await ethers.getContractFactory("TokenMaster");
    tokenMaster = await TokenMaster.deploy(NAME, SYMBOL);
    await tokenMaster.deployed();
    
    // connect to deployer to tokenmaster 
    const transaction = await tokenMaster.connect(deployer).list(
      OCCASION_NAME,
      OCCASION_COST,
      OCCASION_MAX_TICKETS,
      OCCASION_DATE,
      OCCASION_TIME,
      OCCASION_LOCATION
    )
    
    await transaction.wait()


  })

  describe("Deployment", () => {
    it("Sets the name", async () => {
      const name = await tokenMaster.name();
      expect(name).to.equal(NAME);
    });

    it("Sets the symbol", async () => {
      const symbol = await tokenMaster.symbol();
      expect(symbol).to.equal(SYMBOL);
    });

    it("Sets the owner", async () => {
      const owner = await tokenMaster.owner();
      expect(owner).to.equal(deployer.address)
    });


  });

  describe("Occassions", () => {
      it("Update Total Occassions", async () => {
        const totalOccasions = await tokenMaster.totalOccasions(); 
        expect(totalOccasions).to.be.equal(1)
      })
      
      it("Returns Occassion Attributes", async () => {
        const occasion = await tokenMaster.getOccasion(1);
        expect(occasion.name).to.equal(OCCASION_NAME); 
        expect(occasion.cost).to.equal(OCCASION_COST); 
        expect(occasion.maxTickets).to.equal(OCCASION_MAX_TICKETS); 
        expect(occasion.date).to.equal(OCCASION_DATE); 
        expect(occasion.time).to.equal(OCCASION_TIME); 
        expect(occasion.location).to.equal(OCCASION_LOCATION); 
      } );

  })
  
}); 

