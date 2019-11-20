const getHistory = async () =>{

	let curAddress;
	let users = {};
  
//Foncions qui intéragissent avec le SC pour récupérer les adresses des utilisateurs et leur nom ainsi que la taille de cette liste dans le coté front.
	const getCurAddress = async () =>{                         
	  return new Promise(function(resolve, reject){
		web3.eth.getAccounts((err, accounts) => {
		  if (err) return reject(err);
		  resolve(accounts[0]);
	  })
	})}

	const getMembersAndName = async () =>{                        
		return new Promise(function(resolve, reject){
			Token.getMembersCharityAndName((err, members) => {
				if (err) return reject(err);
				resolve(members);
	  	})
	})}

	const getPersoWordings = async (_address) =>{                        
		return new Promise(function(resolve, reject){
			Token.getPersonalWordings(_address, (err, members) => {
			if (err) return reject(err);
			resolve(members);
	  	})
	})}



	//récupération des informations
	curAddress = await getCurAddress();
	let listAddressAndName = await getMembersAndName();
	let taille = listAddressAndName[0].length;
	let listPersoWording = await getPersoWordings(curAddress);
	let tailleWording = listPersoWording[0].length;
	console.log("liste perso");
	console.log(listPersoWording);


	//stockage de ces données dans un objet javascript (cette méthode permet une meilleur rapidité lorsqu'on cherchera le nom d'un utilisateur grâce à son adresse publique)
	for (let i=0; i<taille; i++) {
		let address = listAddressAndName[0][i];
		let name = web3.toAscii(listAddressAndName[1][i]);
		users[address]={};
		users[address].address=address;
		users[address].name=name;
	}
	

	//On doit intégrer l'adresse null car lors de le création d'un smart contract, l'admin est crédité par cette adresse (sans l'intégrer cela fait crasher la page)
	users["0x0000000000000000000000000000000000000000"]={};
	users["0x0000000000000000000000000000000000000000"].address="0x0000000000000000000000000000000000000000";
	users["0x0000000000000000000000000000000000000000"].name="";
  	console.log("users");
  	console.log(users);

	//use of Etherscan API to get the list of transactions for current user. Results are saved in a JSON file
	//On ajoute et retire les parametres dans l'adresse afin d'avoir ce qu'on veut  "&ce_qu'on_veut=paramtre"
	$.getJSON('https://api-ropsten.etherscan.io/api?module=account&action=tokentx&address=' + curAddress + '&contractaddress=0xaD57d1eD8A07Dcd5657eb7A1880C2Cc0C71257aE&startblock=0&endblock=999999999&sort=asc&apikey=NSAMUW521D6CQ63KHUPRQEERSW8FVRAF9B', function(data) {
		var resultArray = data.result;

		// fill the history with data from json file. Required/relevant columns from json are:
		//1) timeStamp (nb of seconds since 01/01/1970)
		//2) from: originator of the transactions
		//3) to: receiver of the transaction
		//4) value: transaction value (to divide by 10^18)
		const fillHistory = async (resultArray, curAddress, _users, _listPersoWording) =>{
			var table = document.getElementById("content-history")
			var i = 1
			console.log("_users");
			console.log(_users);
			console.log("resultat array");
			console.log (resultArray);
			for (let key=tailleWording - 1; key>=0; key--){
				console.log("key");
				console.log(key);
				if(Math.round(resultArray[key].value*Math.pow(10,-18)) > 0){
					var row = document.createElement('tr')
					row.class = "row" + i.toString() + " body"
					table.appendChild(row)

					var column1 = document.createElement('td')
					column1.className = "column1History"
					//convert timestamp to date (*1000 below is to get it in ms)
					var d = new Date(parseInt(resultArray[key].timeStamp)*1000);
					var date = d.getDate();
					var month = d.getMonth(); 
					var dateString = date + "-" + (month + 1);

					column1.innerHTML = dateString;
					row.appendChild(column1);

					if (resultArray[key].from == curAddress) {
						var column2 = document.createElement('td');
						column2.className = "column2History";
						let addressTo = resultArray[key].to;
						column2.innerHTML = _users[addressTo].name;
						row.appendChild(column2);

						var column3 = document.createElement('td');
						column3.className = "column3History";
						column3.innerHTML = "-" + Math.round(resultArray[key].value*Math.pow(10,-18));
						row.appendChild(column3)
					}
					else {
						var column2 = document.createElement('td')
						column2.className = "column2History";
						let addressFrom = resultArray[key].from;
						column2.innerHTML = _users[addressFrom].name;
						row.appendChild(column2)

						var column3 = document.createElement('td');
						column3.className = "column3History";
						column3.innerHTML = "+" + Math.round(resultArray[key].value*Math.pow(10,-18));
						row.appendChild(column3)
					}

					var column4 = document.createElement('td');
					column4.className = "column4History";
					column4.innerHTML = web3.toAscii(_listPersoWording[3][key]);
					row.appendChild(column4);
				}
				i++
			}
		}
		fillHistory(resultArray, curAddress, users, listPersoWording);
	});
};
getHistory();