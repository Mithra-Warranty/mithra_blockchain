import { time, loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { deployNFT } from './utils/fixtures';
import { NewMint } from './utils/constants';
import { daysToSeconds } from './utils/helpers';

const { id, timeToExpiry } = NewMint;

describe('Expiration of warranty', () => {
  it('Returns the seconds left to expiry', async () => {
    const { nftDeployer, addr1, warranty } = await loadFixture(deployNFT);

    await warranty.safeMint(
      nftDeployer.address,
      NewMint.ipfsHash,
      NewMint.uri,
      NewMint.timeToExpiry
    );

    const startTime = await time.latest();

    await warranty.listForSale(id);
    await warranty.resale(id, addr1.address);

    await time.increase(daysToSeconds(1));

    const currentTimeStamp = await time.latest();
    expect(await warranty.checkIfWarrantyIsOver(id)).to.not.equal(0);
    expect(await warranty.checkIfWarrantyIsOver(id)).to.equal(
      daysToSeconds(timeToExpiry) - (currentTimeStamp - startTime)
    );
  });

  it('Returns 0 if warranty has expired', async () => {
    const { nftDeployer, addr1, warranty } = await loadFixture(deployNFT);

    await warranty.safeMint(
      nftDeployer.address,
      NewMint.ipfsHash,
      NewMint.uri,
      NewMint.timeToExpiry
    );

    await warranty.listForSale(id);
    await warranty.resale(id, addr1.address);

    await time.increase(daysToSeconds(15));

    expect(await warranty.checkIfWarrantyIsOver(id)).to.equal(0);
  });
});
