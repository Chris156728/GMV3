import React, { useState } from 'react';

import Web3 from "web3";
//import conf from '../config.json';

const minABI = [
      // balanceOf
      {
        "constant":true,
        "inputs":[{"name":"_owner","type":"address"}],
        "name":"balanceOf",
        "outputs":[{"name":"balance","type":"uint256"}],
        "type":"function"
      },
      // decimals
      {
        "constant":true,
        "inputs":[],
        "name":"decimals",
        "outputs":[{"name":"","type":"uint8"}],
        "type":"function"
      },
      {
        "constant": false,
        "inputs": [{name: "_to",type: "address",},{name: "_value",type: "uint256",},],
        "name": "transfer",
        "outputs": [{name: "",type: "bool",},],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function",
      },
      {
        "constant": false,
        "inputs": [{name: "usr",type: "address",},{name: "wad",type: "uint256",},],
        "name": "approve",
        "outputs": [{name: "",type: "bool",},],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function",
      },
	  {
        "constant": false,
        "inputs": [{name: "usr",type: "address",},{name: "wad",type: "uint256",},],
        "name": "allowance",
        "outputs": [{name: "allowance",type: "uint256",},],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
      },
	  
	  //{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
	  
    ];


// IMPORTANT NOTE: In this example, the URI is used as a unique key to identify
// a token associated with an asset. This is fine for demonstration, but in a 
// production project you should have a unique key associated with the asset
// and store that in the contract along with the URI.
export default function Mint(props) {
	let imgbase = 'https://ipfs.io/ipfs/QmVaaDwixStwnwrYFaQ4hNf9LVfKiHwFZ7A2bWS8KFccA2/';
	const [assetURIs, setAssetURIs] = useState([]);
	//const [assetURIs, setAssetURIs] = useState([]);
	//var WAValidator = require('wallet-address-validator');
	// Populate the assetURIs variable with tokens that are not yet minted.
	let tkid = 1;
	const tokenAddress = props.tokenaddr[tkid];
	
	const CheckAssetURIs = async () => {
		let uris = [];
		
		// For this demo there are only 4 assets, named sequentially. 
		for(let idx = 1; idx <= 9; idx++ ){
			let base ='';// 'ipfs://QmU8V6P1kcwPrCvdVbkDpEvgn4uxUMWRwU3Tz3cGmvsNN3/';
			let ext = idx+'.json';//'/token_data/exobit_'+idx+'.json';
			let uri= base+ext;
			let pid = 1;//props.tokenprice[1];
			// Call the contract and get the id of the uri. If the uri doesn't belong to a token, it will return 0.
			let tokenId = await props.contract.methods.tokenByUri(uri).call();
			// The token ID comes in as a string. "0" means that uri is not associated with a token.
		if(tokenId === "0") uris.push({uri:uri,pid:pid});
		}

		// Update the list of available asset URIs
		if(uris.length) setAssetURIs([...uris]);
	}

	// Handle the click to mint
	const DoMint = async (tokenURI,pid) => {
		const contractAddress = props.contractaddr;//"0x7a7b4757543987dD07936D473Ead236ebcdc4999";
		const nAddress = "0x0000000000000000000000000000000000000000";
		const web3 = new Web3(window.web3.currentProvider);
		const usdc = new web3.eth.Contract(minABI, tokenAddress);
		
		console.log('minting: ', tokenURI);
		gomint:try{
			// Estimate the gas required for the transaction
			//console.log('caddress', contractAddress, 'waddress', props.address);
			let refaddr = props.refaddr;
			//var valid = WAValidator.validate(props.ref, 'ETH');
			let valid = Web3.utils.isAddress(refaddr)
			if(refaddr!=null){
				
				if(!valid) {
					alert("referral address format not valid")
					window.location.assign(props.url);
					break gomint;
				}	
				if(refaddr==props.address){
					alert("Can not refer yourself");
					window.location.assign("/");
				}
			}
			else {
				refaddr = nAddress;
			}
			
			
			let uresult = await usdc.methods.approve(contractAddress, props.tokenprice[pid]).send({ from: props.address })
			//console.log('uresult', uresult);
				
			let gasLimit = await props.contract.methods.CustomMint(tokenURI,refaddr,pid,tkid).estimateGas(
				{ 
					from: props.address, 
					value: 10000000000000000
				}
			);
			// Call the mint function.
			
			let result = await props.contract.methods.CustomMint(tokenURI,refaddr,pid,tkid)
				.send({ 
					from: props.address, 
					value: 10000000000000000,
					// Setting the gasLimit with the estimate accuired above helps ensure accurate estimates in the wallet transaction.
					gasLimit: gasLimit
				});

			// Output the result for the console during development. This will help with debugging transaction errors.
			console.log('result', result);

			// Refresh the gallery
			CheckAssetURIs();

		}catch(e){
			console.error('There was a problem while minting', e);
			alert(e.message);
		}
	};

	// Handle contract unavailable. 
	// This is an extra precaution since the user shouldn't be able to get to this page without connecting.
	if(!props.contract) return (<div className="page error">Contract Not Available</div>);

	// Set up the list of available token URIs when the component mounts.
	if(!assetURIs.length) CheckAssetURIs();

	// Display the minting gallery
	return (
		<div className="page mint">
			<h2>Click on an image to mint a token</h2>
			{assetURIs.map((uri, idx) => (
					<div onClick={() => DoMint(uri.uri,uri.pid)} key={idx}>
						<img src={(imgbase)+uri.uri.replace('.json', '.png')} alt={''+(idx+1)} />
					</div>
				)
			)}
		</div>
	);
}