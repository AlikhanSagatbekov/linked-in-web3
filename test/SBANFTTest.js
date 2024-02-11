const { expect } = require("chai");

describe("SBANFT", function() {
  let SBANFT;
  let sbanft;
  let owner;

  beforeEach(async function() {
    SBANFT = await ethers.getContractFactory("SBANFT");
    [owner] = await ethers.getSigners();
    sbanft = await SBANFT.deploy();
  });

  it("Should deploy SBANFT with the correct name and symbol", async function() {
    expect(await sbanft.name()).to.equal("SBANFT");
    expect(await sbanft.symbol()).to.equal("NFT");
  });

  it("Should have a base URI set correctly", async function() {
    const baseURI = await sbanft.baseURI();
    expect(baseURI).to.equal("https://img.freepik.com/free-vector/hand-drawn-nft-style-ape-illustration_23-2149622021.jpg");
  });
});
