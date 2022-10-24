import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { deployNFT } from './utils/fixtures';
import { NewMint } from './utils/constants';

const { id } = NewMint;

describe('Sale', () => {
  it('Warranty can only be sold by the owner', async () => {
    const { nftDeployer, addr1, warranty } = await loadFixture(deployNFT);

    await warranty.safeMint(
      nftDeployer.address,
      NewMint.ipfsHash,
      NewMint.uri,
      NewMint.timeToExpiry
    );

    await expect(
      warranty.connect(addr1).resale(id, nftDeployer.address)
    ).to.be.revertedWith('Ownable: caller is not the owner');
  });

  it('Only valid token id can be sold', async () => {
    const { nftDeployer, addr1, warranty } = await loadFixture(deployNFT);

    await warranty.safeMint(
      nftDeployer.address,
      NewMint.ipfsHash,
      NewMint.uri,
      NewMint.timeToExpiry
    );

    await expect(warranty.resale(25, addr1.address)).to.be.revertedWith(
      'Warranty: token Id is not valid'
    );
  });

  it("Warranty cannot be sold if it isn't listed for sale", async () => {
    const { nftDeployer, addr1, warranty } = await loadFixture(deployNFT);

    await warranty.safeMint(
      nftDeployer.address,
      NewMint.ipfsHash,
      NewMint.uri,
      NewMint.timeToExpiry
    );

    await expect(warranty.resale(id, addr1.address)).to.be.revertedWith(
      'Warranty: token is not out for sale'
    );
  });

  it('Warranty transferred emitting event with correct params', async () => {
    const { nftDeployer, addr1, warranty } = await loadFixture(deployNFT);

    await warranty.safeMint(
      nftDeployer.address,
      NewMint.ipfsHash,
      NewMint.uri,
      NewMint.timeToExpiry
    );

    await warranty.listForSale(id);

    await expect(warranty.resale(id, addr1.address))
      .to.emit(warranty, 'WarrantyCardTransferred')
      .withArgs(id, addr1.address);

    expect(await warranty.ownerOf(id)).to.equal(addr1.address);
  });
});
