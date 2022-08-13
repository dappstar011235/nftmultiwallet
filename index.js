
//endpoint
const endpoint = {
  http:"https://eth-rinkeby.alchemyapi.io/v2/UdVl55H5KSJkdnZfXcn47IC_j3EhObCO"
};
//web3
const Web3 = require("web3");
const { pretty } = require("pretty-bitte");
const ethers = require('ethers');
const web3 = new Web3(new Web3.providers.HttpProvider(endpoint.http));
const { JsonRpcProvider } = require("@ethersproject/providers");
const provider = new JsonRpcProvider(endpoint.http);
//ABI
const nftABI = require("./abi/nft.json");
//wallets
const {wallets, nftAddress} = require("./config.json");

const run = async () => {
  for(let i = 0; i < wallets.length; i++){
    _mint(wallets[i]);
  }
};
const _mint = async (wallet) => {
    try{
      const signer = new ethers.Wallet(wallet, provider);
      const contractInstance = new ethers.Contract(nftAddress, nftABI, signer);
      const gasTx ={ gasLimit: 300000, gasPrice: convertToHex(10)};
      const tx = await contractInstance.mint( convertToHex(1),gasTx);
      const txHash = tx.hash;
      console.log(`--Tx: ${txHash}`);
      const receipt = await tx.wait();
      console.log(`--Tx was mined in block: ${receipt.blockNumber}`);
    }catch(e){
      console.log('Error in _mint',e);
    }
};
function convertToHex( value ){
  if(value===NaN || value===false) return false;
  let maxDep = 70;
  let number = Number(value);
  let decimal = 0;
  while(maxDep>0){
      maxDep --;
      if(number < 10) {
          return ethers.utils.parseUnits(String(Number(number).toFixed(decimal)), decimal).toHexString()
      }
      else{
          number = number/10;
          decimal++;
      }
  }
  return false;
}
run();