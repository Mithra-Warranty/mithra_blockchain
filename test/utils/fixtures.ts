import { ethers } from 'hardhat';
import { TokenName, TokenSymbol } from './constants';

const deployNFT = async (): Promise<any> => {
  const [nftDeployer, addr1, addr2, addr3] = await ethers.getSigners();

  const WarrantyCard = await ethers.getContractFactory('Warranty');
  const warranty = await WarrantyCard.deploy(TokenName, TokenSymbol);

  await warranty.deployed();

  return { nftDeployer, warranty, addr1, addr2, addr3 };
};

export { deployNFT };
