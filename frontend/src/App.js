import {useState,useEffect } from 'react';
import './App.css';
import { ethers } from 'ethers';
import VideoNFT from './contracts/VideoNFT.json'
const ethPrice = require('eth-price');
//rinkeby
//const contractAddress = '0xE44fc88d581Ba086b090ce116a1af475D837AE51';

const contractAddress = '0xB1ba7EA28EdB173B8E5573D19ccBB1aA17fD7f8D';

function App() {
  const [accounts,setAccounts] = useState([]);
  const [tokenId,setTokenId] = useState(0);


  async function connectAccounts(){
    if(window.ethereum){
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts"
      });
      setAccounts(accounts);
    }
  }

 useEffect(() => {
    connectAccounts();
  },[] );


  async function executeMint(){
    if(window.ethereum){
      try{
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress,VideoNFT.abi,signer);

      const message = ethers.utils.solidityKeccak256(['string'],['123456'] );
      const arrayifyMessage = ethers.utils.arrayify(message);
      const msgSignature = await signer.signMessage(arrayifyMessage);

        const ethprice = await ethPrice('usd');
        const amt = 1000 / ethprice[0].split(':')[1].trim();
 
        const response = contract.mint(tokenId,msgSignature,{value : ethers.utils.parseEther(amt.toString())});
        console.log("result : " , response);
      }
      catch(error){
        console.log("error : " , error);
      }
    }
  }

  return (
    <div className="App">
       Minting NFT Token
     {
      accounts.length && (
        <div>
          <br />
        Account :   {accounts[0]} <br />
        <br />
				Token ID: <input id="tokenId" type="text" value = {tokenId}  onChange={(e) => setTokenId(e.target.value)}/>
				{ <button onClick={executeMint}> Mint </button> }
        </div>
       ) 
     } 
      
    </div>
  );
}

export default App;
