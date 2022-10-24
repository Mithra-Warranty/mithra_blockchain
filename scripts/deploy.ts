import { ethers } from 'hardhat';

async function main(): Promise<any> {
  const Warranty = await ethers.getContractFactory('Warranty');
  const warranty = await Warranty.deploy('TestToken', 'TT');
  await warranty.deployed();

  console.log('Warranty deployed to:', warranty.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
