const hardHat = require("hardhat");

const tokens = (tokenAmount) => {
  return hardHat.ethers.utils.parseUnits(tokenAmount.toString(), "ether");
};

async function main() {
  const [deployer] = await hardHat.ethers.getSigners();
  const NAME = "TokenMaster";
  const SYMBOL = "TM";

  // Deploy Contract
  const TokenMaster = await hardHat.ethers.getContractFactory("TokenMaster");
  const tokenMaster = await TokenMaster.deploy(NAME, SYMBOL);
  await tokenMaster.deployed();

  console.log(`Deployed TokenMaster Contract at : ${tokenMaster.address}\n`);

  // list 6 events
  const occasions = [
    {
      name: "UFC Miami",
      cost: tokens(3),
      tickets: 0,
      date: "Apr 8",
      time: "6:00PM EST",
      location: "Miami-Dade Arena - Miami, FL",
    },
    {
      name: "ETH Tokyo",
      cost: tokens(1),
      tickets: 125,
      date: "Apr 14",
      time: "1:00PM JST",
      location: "Tokyo, Japan",
    },
    {
      name: "ETH Privacy Hackathon",
      cost: tokens(0.25),
      tickets: 200,
      date: "Apr 27",
      time: "10:00AM TRT",
      location: "Turkey, Istanbul",
    },
    {
      name: "Dallas Mavericks vs. San Antonio Spurs",
      cost: tokens(5),
      tickets: 0,
      date: "May 2",
      time: "2:30PM CST",
      location: "American Airlines Center - Dallas, TX",
    },
    {
      name: "ETH Global Toronto",
      cost: tokens(1.5),
      tickets: 125,
      date: "Jun 23",
      time: "11:00AM EST",
      location: "Toronto, Canada",
    },
  ];
  //   assign event to tokenMaster
  for (var i = 0; i < occasions.length; i++) {
    const transaction = await tokenMaster
      .connect(deployer)
      .list(
        occasions[i].name,
        occasions[i].cost,
        occasions[i].tickets,
        occasions[i].date,
        occasions[i].time,
        occasions[i].location
      );

    await transaction.wait();

    console.log(
      `Listed Event ${i + 1} : ${occasions[i].name} (${occasions[i].cost}`
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
