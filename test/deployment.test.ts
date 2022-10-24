import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { TokenName, TokenSymbol } from './utils/constants';
import { deployNFT } from './utils/fixtures';

describe('Deployment', () => {
  it('Should have correct name and symbol', async () => {
    const { warranty } = await loadFixture(deployNFT);
    expect(await warranty.name()).to.equal(TokenName);
    expect(await warranty.symbol()).to.equal(TokenSymbol);
  });

  it('Set the contract owner as the deployer', async () => {
    const { nftDeployer, warranty } = await loadFixture(deployNFT);
    expect(await warranty.getContractOwner()).to.equal(nftDeployer.address);
  });
});
