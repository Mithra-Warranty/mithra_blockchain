import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { deployNFT } from './utils/fixtures';
import { NewMint } from './utils/constants';

const { id } = NewMint;

describe('Soulbound Nature', () => {
  it('Cannot be transferred to another user unless transferred by Contract owner', async () => {
    const { nftDeployer, addr1, addr2, warranty } = await loadFixture(
      deployNFT
    );

    await warranty.safeMint(
      nftDeployer.address,
      NewMint.ipfsHash,
      NewMint.uri,
      NewMint.timeToExpiry
    );

    await warranty.listForSale(id);

    await warranty.resale(id, addr1.address);

    await warranty.connect(addr1).listForSale(id);

    await expect(
      warranty.connect(addr1).resale(id, addr2.address)
    ).to.be.revertedWith('Ownable: caller is not the owner');

    await expect(warranty.resale(id, addr2.address))
      .to.emit(warranty, 'WarrantyCardTransferred')
      .withArgs(id, addr2.address);

    expect(await warranty.ownerOf(id)).to.equal(addr2.address);
  });

  it('Cannot be transferred to another user using "transferFrom" function', async () => {
    const { nftDeployer, addr1, addr2, warranty } = await loadFixture(
      deployNFT
    );

    await warranty.safeMint(
      nftDeployer.address,
      NewMint.ipfsHash,
      NewMint.uri,
      NewMint.timeToExpiry
    );

    await warranty.listForSale(id);

    await warranty.resale(id, addr1.address);

    await warranty.connect(addr1).listForSale(id);

    await expect(
      warranty.connect(addr1).transferFrom(addr1.address, addr2.address, id)
    ).to.be.revertedWith('Warranty: Cannot transfer this token.');
  });
});
