import React, { useState } from "react";
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link
} from 'react-router-dom';

import './App.css';
import conf from './config.json';

import Home from './pages/Home';
import Mint from './pages/Mint';
import Gallery from './pages/Gallery';
import MyTokens from './pages/MyTokens';

import Login from './components/Login';

function App() {
	const curr=new URL(window.location.href);
	
	const refaddr=curr.searchParams.get('ref');
	const mintpath = "/mint/"+curr.search;
	//console.log(conf.contractaddr);
	//console.log(conf.tokenaddr);
	const [web3props, setWeb3Props] = useState({ web3: null, accounts: null, contract: null });

	// Callback function for the Login component to give us access to the web3 instance and contract functions
	const OnLogin = function(param){
		let { web3, accounts, contract } = param;
		if(web3 && accounts && accounts.length && contract){
			setWeb3Props({ web3, accounts, contract });
		}
	}
const targetNetworkId = '0x4';
	
const homepage = window.location.href;	
const chainChangedHandler = () => {
		// reload the page to avoid any errors with chain change mid use of application
		
		window.location.assign(homepage);
	}
	
const checkNetwork = async () => {
  if (window.ethereum) {
    const currentChainId = await window.ethereum.request({
      method: 'eth_chainId',
    });
	console.log(currentChainId)
    // return true if network id is the same
    if (currentChainId !== targetNetworkId) return true;
    // return false is network id is different
    return false;
  }
};
const switchNetwork = async () => {
  await window.ethereum.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: targetNetworkId }],
  });
  //console.log('switch');
  // refresh
  //window.location.reload();
};	
if(window.ethereum){	
window.ethereum.on('chainChanged', chainChangedHandler);
window.ethereum.on('accountsChanged', chainChangedHandler);
if(checkNetwork()){
	//alert('please switch network');
	switchNetwork();
	//alert('please switch net');
}
}



function isMobileDevice() {
 
  return 'ontouchstart' in window || 'onmsgesturechange' in window;
}

let contractAvailable = false;
let walletAddress = null;
if(!isMobileDevice()){
	// If the wallet is connected, all three values will be set. Use to display the main nav below.
	 contractAvailable = !(!web3props.web3 && !web3props.accounts && !web3props.contract);
	// Grab the connected wallet address, if available, to pass into the Login component
     walletAddress = web3props.accounts ? web3props.accounts[0] : "";
} 
if(isMobileDevice() && window.ethereum){
	contractAvailable = !(!web3props.web3 && !web3props.accounts && !web3props.contract);
	// Grab the connected wallet address, if available, to pass into the Login component
     walletAddress = web3props.accounts ? web3props.accounts[0] : "";
}	
	return (
		<div className="App">
			<Router>
				<header>
					<Link to="/">
							<svg id="logo" aria-hidden="true" focusable="false" className="greenzeta" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 625 105">
							<g>
								<path fill="#FFFFFF" d="M208.809,13.35v9.466h-67.314V50.63h54.108v9.583h-54.108v27.814h67.314v9.466h-76.781V13.35H208.809z"/>
								<path fill="#FFFFFF" d="M276.824,29.711h12.504l-28.281,33.307l28.398,34.476h-12.621L254.736,70.38l-21.971,27.113h-12.622l28.282-34.476l-28.282-33.307h12.622l21.971,25.71L276.824,29.711z"/>
								<path fill="#FFFFFF" d="M315.739,29.711h40.669c3.974,0,7.343,1.384,10.109,4.149c2.765,2.767,4.148,6.097,4.148,9.992v39.501c0,3.896-1.384,7.228-4.148,9.992c-2.767,2.767-6.136,4.148-10.109,4.148h-40.669c-3.897,0-7.228-1.382-9.992-4.148c-2.767-2.765-4.149-6.096-4.149-9.992V43.852c0-3.895,1.383-7.226,4.149-9.992C308.512,31.095,311.842,29.711,315.739,29.711zM356.408,39.294h-40.669c-1.247,0-2.319,0.449-3.214,1.344c-0.896,0.896-1.344,1.969-1.344,3.214v39.501c0,1.247,0.447,2.319,1.344,3.214c0.895,0.896,1.967,1.344,3.214,1.344h40.669c1.245,0,2.317-0.447,3.214-1.344c0.895-0.895,1.344-1.967,1.344-3.214V43.852c0-1.245-0.449-2.317-1.344-3.214C358.726,39.743,357.653,39.294,356.408,39.294z"/>
								<path fill="#FFFFFF" d="M462.404,51.449l0.469,1.986c3.115,2.883,4.674,6.351,4.674,10.401v19.633c0,3.897-1.363,7.208-4.09,9.935c-2.729,2.728-6.039,4.09-9.934,4.09h-70.119V13.35H449.9c3.895,0,7.205,1.364,9.934,4.09c2.727,2.729,4.09,6.039,4.09,9.934v17.88C463.924,47.358,463.416,49.423,462.404,51.449z M449.9,22.816h-52.473c-1.248,0-2.32,0.449-3.215,1.344c-0.896,0.896-1.344,1.968-1.344,3.214v17.88c0,1.247,0.447,2.319,1.344,3.214c0.895,0.896,1.967,1.344,3.215,1.344H449.9c1.246,0,2.297-0.447,3.156-1.344c0.855-0.895,1.285-1.967,1.285-3.214v-17.88c0-1.246-0.43-2.317-1.285-3.214C452.197,23.265,451.146,22.816,449.9,22.816z M458.082,83.469V63.836c0-1.246-0.449-2.317-1.346-3.214c-0.896-0.896-1.967-1.344-3.213-1.344h-56.096c-1.248,0-2.32,0.448-3.215,1.344c-0.896,0.896-1.344,1.968-1.344,3.214v19.633c0,1.248,0.447,2.319,1.344,3.214c0.895,0.897,1.967,1.345,3.215,1.345h56.096c1.246,0,2.316-0.447,3.213-1.345C457.633,85.789,458.082,84.717,458.082,83.469z"/>
								<path fill="#FFFFFF" d="M479.816,7.506h9.582v9.583h-9.582V7.506z M479.816,97.494V29.711h9.582v67.783H479.816z"/>
								<path fill="#FFFFFF" d="M543.156,39.294h-29.332v44.059c0,1.247,0.447,2.319,1.344,3.214c0.895,0.896,1.967,1.344,3.213,1.344h24.775v9.583h-24.775c-3.973,0-7.324-1.382-10.051-4.148c-2.729-2.765-4.09-6.096-4.09-9.992V7.506h9.584v22.205h29.332V39.294z"/>
								<path fill="#FFFFFF" d="M620.639,43.852v0.935h-9.701v-0.935c0-1.245-0.449-2.317-1.344-3.214c-0.896-0.895-1.969-1.344-3.213-1.344h-40.67c-1.248,0-2.318,0.449-3.215,1.344c-0.896,0.896-1.344,1.969-1.344,3.214v10.401c0,1.247,0.447,2.318,1.344,3.214c0.896,0.896,1.967,1.344,3.215,1.344h40.67c3.973,0,7.342,1.384,10.109,4.148c2.764,2.767,4.148,6.098,4.148,9.992v10.401c0,3.896-1.385,7.228-4.148,9.992c-2.768,2.767-6.137,4.148-10.109,4.148h-40.67c-3.896,0-7.227-1.382-9.992-4.148c-2.766-2.765-4.148-6.096-4.148-9.992v-0.936h9.582v0.936c0,1.247,0.447,2.319,1.344,3.214c0.896,0.896,1.967,1.344,3.215,1.344h40.67c1.244,0,2.316-0.447,3.213-1.344c0.895-0.895,1.344-1.967,1.344-3.214V72.952c0-1.245-0.449-2.317-1.344-3.214c-0.896-0.895-1.969-1.344-3.213-1.344h-40.67c-3.896,0-7.227-1.383-9.992-4.148c-2.766-2.765-4.148-6.096-4.148-9.992V43.852c0-3.895,1.383-7.226,4.148-9.992c2.766-2.765,6.096-4.149,9.992-4.149h40.67c3.973,0,7.342,1.384,10.109,4.149C619.254,36.626,620.639,39.957,620.639,43.852z"/>
							</g>
							<g>
								<path fill="#EE2222" d="M26.795,95.523c-0.113,3.104-2.083,5.361-5.905,6.771c-3.526,1.354-7.066,1.59-10.623,0.713c-3.941-0.879-5.955-2.779-6.038-5.693C2.976,93.078,3.494,83.267,5.78,67.88c3.394-23.072,7.946-39.959,13.656-50.666c1.489-2.746,2.858-4.601,4.104-5.567c1.246-0.965,2.708-1.913,4.385-2.844c1.676-0.93,3.433-1.836,5.273-2.72c3.678-1.767,7.212-3.181,10.6-4.238c3.388-1.056,6.574-1.229,9.561-0.516c2.984,0.713,5.466,2.12,7.439,4.218c1.971,2.099,3.447,4.733,4.428,7.904c0.978,3.17,1.5,6.582,1.566,10.231c0.064,3.65-0.346,7.429-1.235,11.333c-0.888,3.907-2.232,7.646-4.031,11.221c-3.932,7.83-9.213,13.404-15.839,16.724l1.474,1.691c1.246,1.311,2.726,2.727,4.438,4.258s3.431,3.1,5.159,4.701c1.727,1.605,3.324,3.234,4.789,4.889c1.466,1.654,2.612,3.252,3.441,4.793c1.874,3.428,1.438,6.246-1.31,8.457c-2.181,1.947-4.049,2.682-5.602,2.203c-0.667-0.262-1.349-0.615-2.049-1.064c-0.703-0.445-1.609-0.758-2.72-0.936c-4.16,2.088-7.721,1.598-10.683-1.471c-1.835-1.971-3.299-3.816-4.391-5.541c-1.095-1.723-2.021-3.166-2.777-4.338c-1.857-2.506-3.83-4.604-5.919-6.293c-0.445,2.164-0.895,4.906-1.353,8.23c-0.528,4.188-1.177,8.547-1.947,13.086L26.795,95.523z M37.204,26.266c-0.818,3.469-1.369,5.885-1.652,7.248c-0.571,2.729-1.202,5.739-1.896,9.028c0.082,1.682,0.112,2.871,0.089,3.569l1.271-1.857l1.733-1.249c1.201-0.995,2.305-1.895,3.311-2.701c1.005-0.805,1.872-1.738,2.599-2.799c1.393-2.035,2.36-5.106,2.902-9.217c-0.139-0.745-0.149-1.514-0.027-2.308c0.121-0.793,0.15-1.57,0.085-2.329c-0.01-1.693-0.896-2.723-2.659-3.088c-1.518,0.13-3.15,1.708-4.897,4.734C37.714,25.901,37.428,26.224,37.204,26.266z"/>
								<path fill="#EE2222" d="M108.117,62.851c-1.291,0.934-2.571,1.715-3.842,2.336c-1.271,0.627-2.766,1.291-4.485,1.996c-4.511,1.848-7.797,3.039-9.854,3.578c0.363,0.705,1.648,1.389,3.854,2.055c1.383-0.025,2.815-0.506,4.299-1.439c1.482-0.932,3.047-1.842,4.694-2.729c1.645-0.887,3.3-1.523,4.963-1.91c1.662-0.389,3.362-0.053,5.104,1.01c0.846,1.23,1.476,1.92,1.891,2.074c0.414,0.154,0.77,0.203,1.068,0.146c0.297-0.055,0.653-0.004,1.067,0.148c0.414,0.152,1.115,0.91,2.103,2.268c0.986,1.357,1.063,2.807,0.235,4.35s-2.272,3.008-4.326,4.396c-2.053,1.385-4.515,2.654-7.383,3.811c-2.868,1.15-5.771,2.117-8.709,2.898c-6.608,1.775-11.808,2.207-15.602,1.299c-5.387-0.768-9.298-3.541-11.735-8.33c-3.19-6.342-3.573-14.367-1.148-24.073c1.081-4.518,3.189-9.538,6.319-15.06c2.721-4.825,6.068-8.574,10.041-11.245c4.585-3.093,9.613-5.074,15.08-5.943c5.838-0.937,10.335,0.842,13.489,5.341c1.605,2.4,2.512,6.008,2.719,10.826c-0.051,6.333-0.807,10.946-2.269,13.84C114.212,57.315,111.688,60.102,108.117,62.851zM98.333,46.407c-4.103-0.081-6.776,2.732-8.021,8.439c-0.405,1.539-0.648,3.127-0.728,4.762c2.586-0.175,5.004-2.093,7.251-5.752c0.805-1.46,1.347-2.891,1.625-4.292C98.737,48.163,98.696,47.111,98.333,46.407z"/>
							</g>
							</svg>
					</Link>
					<nav>
						<ul>
								{contractAvailable && <>
									<li>
										<Link to={mintpath}>Mint</Link>
									</li>
									<li>
										<Link to="/gallery">Gallery</Link>
									</li>
									<li>
										<Link to="/mytokens">My Exobits</Link>
									</li>
								</>}
								<li>
									<Login callback={OnLogin} contractaddr={conf.contractaddr} url={curr.href} connected={contractAvailable} address={walletAddress}></Login>
								</li>
						</ul>
					</nav>
				</header>
				<div className="content">
					<Switch>
						<Route path="/mytokens">
							<MyTokens contract={web3props.contract} address={walletAddress}></MyTokens>
						</Route>
						<Route path="/gallery">
							<Gallery contract={web3props.contract}></Gallery>
						</Route>
						<Route path="/mint/">
							<Mint tokenaddr={conf.tokenaddr} tokenprice={conf.tokenprice} contractaddr={conf.contractaddr} url={curr.href} refaddr={refaddr} contract={web3props.contract} address={walletAddress}></Mint>
						</Route>
						<Route path="/">
							<Home refaddr={refaddr}></Home>
						</Route>
					</Switch>
				</div>
			</Router>
		</div>
	);
}

export default App;