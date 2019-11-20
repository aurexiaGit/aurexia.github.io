
// for the "sending tokens" loading sentence
var sending = false; 

// hide admin logo 

//document.getElementById("adminPage").style.display = "none";

// connect to ethereum API web3
const infura = 'https://ropsten.infura.io/v3/cc89e42528e441afb25d84e1499632ba';
web3.eth.defaultAccount = "0xc4d446c6B924c431f89214319D5A3e6bb67e7627";

var web3 = new Web3(new Web3.providers.HttpProvider(infura));

var abi = [
  {
    "constant": true,
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "name": "",
        "type": "bytes32"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x06fdde03"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "sizeListCharity",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x1c6c72b0"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "openDonation",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x30e3fcad"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [
      {
        "name": "",
        "type": "uint8"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x313ce567"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "initialSupply",
    "outputs": [
      {
        "name": "",
        "type": "uint32"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x378dc3dc"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "_totalSupply",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x3eaaf86b"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "acceptOwnership",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0x79ba5097"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x8da5cb5b"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "name": "",
        "type": "bytes32"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x95d89b41"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "initialDonation",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0xb47333ca"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "indexNewWording",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0xd3c49371"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "newOwner",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0xd4ee1d90"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "sizeListAccount",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0xd6eb5782"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0xf2fde38b"
  },
  {
    "inputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "constructor",
    "signature": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "tokens",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event",
    "signature": "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "spender",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Approval",
    "type": "event",
    "signature": "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "_from",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "_to",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event",
    "signature": "0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "totalSupply",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x18160ddd"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "_address",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x70a08231"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_to",
        "type": "address"
      },
      {
        "name": "_value",
        "type": "uint256"
      },
      {
        "name": "_text",
        "type": "bytes32"
      }
    ],
    "name": "transfer",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0x57cfeeee"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_from",
        "type": "address"
      },
      {
        "name": "_to",
        "type": "address"
      },
      {
        "name": "_value",
        "type": "uint256"
      },
      {
        "name": "_text",
        "type": "bytes32"
      }
    ],
    "name": "transferFrom",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0x401e3367"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_address",
        "type": "address"
      },
      {
        "name": "_name",
        "type": "bytes32"
      },
      {
        "name": "_grade",
        "type": "uint8"
      }
    ],
    "name": "addToAurexiaMembers",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0x7112ba11"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_address",
        "type": "address[]"
      },
      {
        "name": "_name",
        "type": "bytes32[]"
      },
      {
        "name": "_grade",
        "type": "uint8[]"
      },
      {
        "name": "taille",
        "type": "uint256"
      }
    ],
    "name": "authorizeManyMembers",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0xeed414b8"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_address",
        "type": "address"
      }
    ],
    "name": "remAurexiaMembers",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0x53e18bdc"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getAllWordings",
    "outputs": [
      {
        "name": "",
        "type": "address[]"
      },
      {
        "name": "",
        "type": "address[]"
      },
      {
        "name": "",
        "type": "uint256[]"
      },
      {
        "name": "",
        "type": "bytes32[]"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0xe0fcd9ff"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "_address",
        "type": "address"
      }
    ],
    "name": "getPersonalWordings",
    "outputs": [
      {
        "name": "",
        "type": "address[]"
      },
      {
        "name": "",
        "type": "address[]"
      },
      {
        "name": "",
        "type": "uint256[]"
      },
      {
        "name": "",
        "type": "bytes32[]"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0xcecb2a88"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "_address",
        "type": "address"
      }
    ],
    "name": "getPersoInfoTransaction",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      },
      {
        "name": "",
        "type": "uint256"
      },
      {
        "name": "",
        "type": "uint256"
      },
      {
        "name": "",
        "type": "uint256"
      },
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x04c6928c"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getAllInfoTransaction",
    "outputs": [
      {
        "name": "",
        "type": "uint256[]"
      },
      {
        "name": "",
        "type": "uint256[]"
      },
      {
        "name": "",
        "type": "uint256[]"
      },
      {
        "name": "",
        "type": "uint256[]"
      },
      {
        "name": "",
        "type": "uint256[]"
      },
      {
        "name": "",
        "type": "bytes32[]"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0xabbf7a73"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getMembers",
    "outputs": [
      {
        "name": "",
        "type": "address[]"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x9eab5253"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getMembersCharityAndName",
    "outputs": [
      {
        "name": "",
        "type": "address[]"
      },
      {
        "name": "",
        "type": "bytes32[]"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x33b0f6cb"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getMembersAndNameAndBalance",
    "outputs": [
      {
        "name": "",
        "type": "address[]"
      },
      {
        "name": "",
        "type": "bytes32[]"
      },
      {
        "name": "",
        "type": "uint256[]"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x77f36225"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "_address",
        "type": "address"
      }
    ],
    "name": "getName",
    "outputs": [
      {
        "name": "",
        "type": "bytes32"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x5fd4b08a"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "_address",
        "type": "address"
      }
    ],
    "name": "getNbrTransaction",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x61a48dcf"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "_address",
        "type": "address"
      }
    ],
    "name": "getTotalSend",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x6f485075"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "_address",
        "type": "address"
      }
    ],
    "name": "getTotalReceive",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x33352d03"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "_address",
        "type": "address"
      }
    ],
    "name": "getNbrSend",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x38790228"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "_address",
        "type": "address"
      }
    ],
    "name": "getNbrReceive",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x1f1423b1"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_address",
        "type": "address"
      },
      {
        "name": "newGrade",
        "type": "uint8"
      }
    ],
    "name": "modifyGrade",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0xf09d0874"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_address",
        "type": "address"
      },
      {
        "name": "newName",
        "type": "bytes32"
      }
    ],
    "name": "modifyName",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0x9ca1221c"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_receiver",
        "type": "address"
      },
      {
        "name": "_value",
        "type": "uint256"
      }
    ],
    "name": "mint",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0x40c10f19"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_address",
        "type": "address"
      },
      {
        "name": "_value",
        "type": "uint256"
      }
    ],
    "name": "burn",
    "outputs": [
      {
        "name": "success",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0x9dc29fac"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_address",
        "type": "address"
      },
      {
        "name": "_name",
        "type": "bytes32"
      }
    ],
    "name": "addAssociation",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0x097a80b8"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_address",
        "type": "address"
      }
    ],
    "name": "remAssociation",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0x1a76e209"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_address",
        "type": "address"
      },
      {
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "transferToAssociation",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0x32e639e4"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getCharityAddress",
    "outputs": [
      {
        "name": "",
        "type": "address[]"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x1ad06393"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getCharitySize",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0xae1de61c"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "launchDonation",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0x60aa8c73"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "closeDonation",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0x59abef9a"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getCharityAndNameAndBalance",
    "outputs": [
      {
        "name": "",
        "type": "address[]"
      },
      {
        "name": "",
        "type": "bytes32[]"
      },
      {
        "name": "",
        "type": "uint256[]"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x38fafcc0"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "isDonationOpen",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x33ccaffa"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "spender",
        "type": "address"
      },
      {
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0x095ea7b3"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "sender",
        "type": "address"
      },
      {
        "name": "spender",
        "type": "address"
      }
    ],
    "name": "allowance",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0xdd62ed3e"
  }
];
var pk  = "b22c556ba9ef9ef133550363fa40a8b38e995fdad1cb7a5b460a944ef61c669f";  // private key of your account
var toadd = process.env.WALLET_DESTINATION;
var address = '0xaD57d1eD8A07Dcd5657eb7A1880C2Cc0C71257aE'; //Contract Address

web3.eth.getTransactionCount(web3.eth.defaultAccount, function (err, nonce) {
  console.log("nonce value is ", nonce);
  const contract = new web3.eth.Contract(JSON.parse(abi), address, {
  from: web3.eth.defaultAccount ,
  gas: 3000000,
  })
  const functionAbi = contract.methods.mymethodname(args).encodeABI();
  var details = {
  "nonce": nonce,
  "gasPrice": web3.utils.toHex(web3.utils.toWei('47', 'gwei')),
  "gas": 300000,
  "to": address,
  "value": 0,
  "data": functionAbi,
  };
  const transaction = new EthereumTx(details);
  transaction.sign(Buffer.from(pk, 'hex') )
  var rawData = '0x' + transaction.serialize().toString('hex');
  web3.eth.sendSignedTransaction(rawData)
  .on('transactionHash', function(hash){
  console.log(['transferToStaging Trx Hash:' + hash]);
  })
  .on('receipt', function(receipt){
  console.log(['transferToStaging Receipt:', receipt]);
  })
  .on('error', console.error);
  });
// check that user has Metamask installed 

if (window.ethereum===undefined) {
	window.confirm('Pas installe'); 
}
else {
  window.ethereum
  ethereum.enable()
}


//fonction de log (notamment pour le bandeau => reconnaissance js de l'admin)

const getLog = async () =>{

  let curAddress;
  let ownerAddress;

  //fonction intéragissant avec le SC 
  const getCurAddress = async () =>{        
    return new Promise(function(resolve, reject){
      web3.eth.getAccounts((err, accounts) => {
        if (err) return reject(err);
        resolve(accounts[0]);
    })
  })}

  const getOwner = async () =>{
    return new Promise(function(resolve, reject){
      Token.owner((err, accounts) => {
        if (err) return reject(err);
        resolve(accounts);
    })
  })}

  const getName = async (address) =>{                        
		return new Promise(function(resolve, reject){
			Token.getName(address, (err, res) => {
				if (err) return reject(err);
				let name = web3.toAscii(res);
				resolve(name);
			})
		})
	}

  //assignation des valeurs 
  curAddress = await getCurAddress();
  ownerAddress = await getOwner();
  curName = await getName(curAddress);

  //on retourne l'affichage de la banner
  //return getBanner(curAddress, ownerAddress, curName);
};

//fonction affichant la banner
/*const getBanner = (_curAddress, _ownerAddress, _name) => {
  if (_curAddress == _ownerAddress && _curAddress !== undefined && _ownerAddress!== undefined) {
    var identity = document.getElementById("identity");
    identity.innerHTML= "<br><div id = 'name'> " + _name + "</div> </br> ";
    document.getElementById("adminPage").style.display = "block";
    }
  else {
    var identity = document.getElementById("identity");
    identity.innerHTML= "<br><div id = 'name'> " + _name + "</div> </br> ";
  }
};*/

getLog();

/************************************** */
/*        update drop-down list         */
/************************************** */

//fonction créant la dropdown list
const dropdownList = (_curAddress, _users, _keyName) => {
  //ciblage via la borne html
  //var select = document.getElementById("dest-select");
  //remplissage de la dropdown list via l'object _users'
  for (let i=0; i<_keyName.length; i++){
    key = _keyName[i];
	  if (_users.hasOwnProperty(key) && key !== "admin" && _users[key].address.toLowerCase() !== _curAddress.toLowerCase() && _users[key].address !== "0x0000000000000000000000000000000000000000") {
      var opt = document.createElement('option');
      opt.value = _users[key].address.toLowerCase();
      opt.innerHTML = _users[key].name;
      //select.appendChild(opt);
    }
  }
}

//fonction récupérant les utilisateurs et stockant ces données dans un objet js
const getUsers = async () =>{

  let users = {}; //objet js
	let listAddressAndName;
	let name;
	var i = 0;
  
  //fonctions intéragissant avec le SC pour récupérer la liste (membre, name) ainsi que sa taille
	const getMembersAndName = async () =>{                        
		return new Promise(function(resolve, reject){
			Token.getMembersAndNameAndBalance((err, members) => {
				if (err) return reject(err);
				resolve(members);
	  	})
	})}
  
  const getTaille = async () =>{
    return new Promise(function(resolve, reject){
      Token.sizeListAccount((err, result) => {
        if (err) return reject(err);
        resolve(result);
    })
  })}

  //assignation des valeurs (le await permet de stopper la compilation d'une fonction asynchrone tant que la promesse n'a pas fini son execution, c'est nécessaire car l'appel au smart contract est plus lent que la compilation js). 
	listAddressAndName = await getMembersAndName();
  let taille = await getTaille();

  // Remplissage de l'objet js
	while (i < taille) {
		var address = listAddressAndName[0][i];
		name = web3.toAscii(listAddressAndName[1][i]);
		users[name]={};
		users[name].address=address;
		users[name].name=name;
		i++
  }
  
  let keyName = listAddressAndName[1];
  //console.log(keyName);
  for (let i=0; i<keyName.length; i++){
    keyName[i]=web3.toAscii(keyName[i]);
  }
  keyName.splice(0,1);
  keyName.sort();
  keyName.splice(0,0, "Administrator");
  //console.log(keyName);

  //get current address before dropdownlist call, to remove own name from dropdown list
  let curAddress;

  const getCurAddress = async () =>{                         
  return new Promise(function(resolve, reject){
    web3.eth.getAccounts((err, accounts) => {
      if (err) return reject(err);
      resolve(accounts[0]);
  })
  })}


  curAddress = await getCurAddress();
  return dropdownList(curAddress, users, keyName);
};

getUsers();