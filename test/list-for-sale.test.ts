import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { deployNFT } from './utils/fixtures';
import { NewMint } from './utils/constants';

const { id } = NewMint;

describe('List product for sale', () => {
  it('Only owner can set the NFT belonging to a product for sale', async () => {
    const { nftDeployer, addr1, warranty } = await loadFixture(deployNFT);

    await warranty.safeMint(
      nftDeployer.address,
      NewMint.ipfsHash,
      NewMint.uri,
      NewMint.timeToExpiry
    );

    await expect(warranty.connect(addr1).listForSale(id)).to.be.revertedWith(
      'Warranty: caller is not the owner'
    );
  });

  it('Warranty can only be listed once at a time', async () => {
    const { nftDeployer, warranty } = await loadFixture(deployNFT);

    await warranty.safeMint(
      nftDeployer.address,
      NewMint.ipfsHash,
      NewMint.uri,
      NewMint.timeToExpiry
    );

    await warranty.listForSale(id);

    await expect(warranty.listForSale(id)).to.be.revertedWith(
      'Warranty: already listed for sale'
    );
  });

  it('Set out for sale as true', async () => {
    const { nftDeployer, warranty } = await loadFixture(deployNFT);

    await warranty.safeMint(
      nftDeployer.address,
      NewMint.ipfsHash,
      NewMint.uri,
      NewMint.timeToExpiry
    );

    expect(await warranty.isOutForSale(id)).to.equal(false);

    await warranty.listForSale(id);

    expect(await warranty.isOutForSale(id)).to.equal(true);
  });
});
