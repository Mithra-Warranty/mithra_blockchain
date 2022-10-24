import { time, loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { anyValue } from '@nomicfoundation/hardhat-chai-matchers/withArgs';
import { expect } from 'chai';
import { deployNFT } from './utils/fixtures';
import { NewMint } from './utils/constants';

const { id, ipfsHash, uri, timeToExpiry } = NewMint;

describe('Minting of Warranty NFT', () => {
  it('Should mint a new NFT with correct params', async () => {
    const { nftDeployer, warranty } = await loadFixture(deployNFT);

    const currentBlockTimestamp = await time.latest();

    await expect(
      warranty.safeMint(nftDeployer.address, ipfsHash, uri, timeToExpiry)
    )
      .to.emit(warranty, 'WarrantyCardMinted')
      .withArgs(anyValue, 0, uri, timeToExpiry)
      .to.emit(warranty, 'WarrantyPeriodStarted')
      .withArgs(id, currentBlockTimestamp + 1, anyValue);
  });

  it('Should mint only 1 nft with same ipfs hash', async () => {
    const { nftDeployer, warranty } = await loadFixture(deployNFT);

    await warranty.safeMint(
      nftDeployer.address,
      NewMint.ipfsHash,
      NewMint.uri,
      NewMint.timeToExpiry
    );

    await expect(
      warranty.safeMint(nftDeployer.address, ipfsHash, uri, timeToExpiry)
    ).to.be.revertedWith('Warranty: already minted');
  });

  it('Warranty can only be minted by the contract deployer', async function () {
    const { warranty, addr1 } = await loadFixture(deployNFT);

    await expect(
      warranty
        .connect(addr1)
        .safeMint(addr1.address, ipfsHash, uri, timeToExpiry)
    ).to.be.revertedWith('Ownable: caller is not the owner');
  });
});
