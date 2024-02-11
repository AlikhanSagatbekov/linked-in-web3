const { expect } = require("chai");

describe("AITU", function() {
  let AITU;
  let aitu;
  let owner;

  beforeEach(async function() {
    AITU = await ethers.getContractFactory("AITU");
    [owner] = await ethers.getSigners();
    aitu = await AITU.deploy();
  });

  it("Should deploy AITU with the correct name and symbol", async function() {
    expect(await aitu.name()).to.equal("AITU");
    expect(await aitu.symbol()).to.equal("ATS");
  });

  it("Should mint initial supply to the owner", async function() {
    const ownerBalance = await aitu.balanceOf(owner.address);
    expect(ownerBalance).to.equal(2000 * 10 ** 18);
  });

  it("Should return the last transaction timestamp as a string", async function() {
    const timestampString = await aitu.getLastTransactionTimestamp();
    const timestampNumber = await aitu.getLastTransactionTimestampAsNumber();

    // Assuming this test runs quickly enough, the difference should be small
    const difference = Math.abs(Number(timestampString) - timestampNumber);
    expect(difference).to.be.lessThan(2);
  });

  it("Should return the correct transaction sender", async function() {
    const sender = await aitu.getTransactionSender();
    expect(sender).to.equal(owner.address);
  });

  it("Should return the correct transaction receiver", async function() {
    const receiver = await aitu.getTransactionReceiver();
    expect(receiver).to.equal(aitu.address);
  });
});
