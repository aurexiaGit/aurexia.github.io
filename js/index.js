// ******************************************* 
//Test update amount value after sending tokens

const refreshBalance= async () => {

	const getCurAddress = async () =>{                         
		return new Promise(function(resolve, reject){
		web3.eth.getAccounts((err, accounts) => {
			if (err) return reject(err);
			resolve(accounts[0]);
		})
  	})};
	
  	const getBalance = async (_curAddress) =>{
		return new Promise(function(resolve, reject){
			Token.balanceOf(_curAddress, (err, result) => {
				if (err) return reject (err);
				resolve(result*Math.pow(10,-18));
			})
		})
	};
	
	let curAddress = await getCurAddress();
	let balance = await getBalance(curAddress);

	//var today to delete
	var today = new Date();
	var time;

	const filter = web3.eth.filter('latest');
	filter.watch((err, res) => {
	if (err) {
		console.log(`Watch error: ${err}`);
	} else {
	// Update balance
		const refresh= async (curAddress,balance) => {
			let bal;
			bal = await getBalance(curAddress);
			time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
			console.log("Real account balance at " + time + ": " + bal)
			if (balance > bal) {
				//alert("Your transaction has been executed!")
				balance = bal;
				console.log("Transaction has been executed, balance is " + balance);
				document.getElementById("astValue").innerHTML = (Math.round(balance)).toString() + " AST";
				balance = await getBalance(curAddress)
				bal = await getBalance(curAddress)
			} else if (balance < bal) {
				//alert("You have received " + (balance - bal).toString() + " AST!")
				balance = bal;
				console.log("Reception of tokens, balance is " + balance);
				document.getElementById("astValue").innerHTML = (Math.round(balance)).toString()
				balance = await getBalance(curAddress)
				bal = await getBalance(curAddress)
			}
			//return balance;
		}
		refresh(curAddress,balance);
		//balance = refresh(curAddress, balance);
	}
	});
}

refreshBalance();
// *******************************************

//Affichage de la balance
function createPage(Balance) {	
	if (document.getElementById("astValue") !== undefined) {
		document.getElementById("astValue").innerHTML = (Math.round(Balance)).toString()	
	}
}

//Fonction récupérant la balance de l'utilisateur
const accountManagement = async () => {

	//fonctions interagissant avec le smart contract pour la fonction SC balanceOf
	const getCurAddress = async () =>{                         
		return new Promise(function(resolve, reject){
		web3.eth.getAccounts((err, accounts) => {
			if (err) return reject(err);
			resolve(accounts[0]);
		})
  	})};

  	const getBalance = async (_curAddress) =>{
		return new Promise(function(resolve, reject){
			Token.balanceOf(_curAddress, (err, result) => {
				if (err) return reject (err);
				resolve(result*Math.pow(10,-18));
			})
		})
	};

	//assignation des valeurs
	let curAddress = await getCurAddress();
	let balance = await getBalance(curAddress);

	return createPage(balance)
}

accountManagement ();

//Transfer tokens when clicking on "send" in home page
const Transfer = async() => {

	//récupération des infos 
	let address = document.getElementById("dest-select").value;
	let amount = document.getElementById("amount").value;
	let wording = document.getElementById("wording").value;
	wording = web3.fromAscii(wording);

	//fonction intéragissant avec le SC pour le transfert de token
	const transferEvent = async (address, amount, _wording) =>{
		return new Promise(function(resolve, reject){
			Token.transfer(address, amount*Math.pow(10,18), _wording, (err, result) => {
				if (err) return reject (err);
				resolve(result);
			})
		})
	};

	transferTransaction = await transferEvent(address,amount, wording);

	//reset de la page
	var frm = document.getElementById("send");
	frm.reset();
	return transferTransaction
}
  