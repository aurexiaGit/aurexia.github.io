
const getData = async () =>{

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
	/*console.log("liste perso");
	console.log(listPersoWording);*/


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
  	/*console.log("users");
  	console.log(users);*/

	//use of Etherscan API to get the list of transactions for current user. Results are saved in a JSON file
	//On ajoute et retire les parametres dans l'adresse afin d'avoir ce qu'on veut  "&ce_qu'on_veut=paramtre"
	return $.getJSON('https://api-ropsten.etherscan.io/api?module=account&action=tokentx&address=' + curAddress + '&contractaddress=0xaD57d1eD8A07Dcd5657eb7A1880C2Cc0C71257aE&startblock=0&endblock=999999999&sort=asc&apikey=NSAMUW521D6CQ63KHUPRQEERSW8FVRAF9B', function(data) {
		var resultArray = data.result;

		// fill the history with data from json file. Required/relevant columns from json are:
		//1) timeStamp (nb of seconds since 01/01/1970)
		//2) from: originator of the transactions
		//3) to: receiver of the transaction
		//4) value: transaction value (to divide by 10^18)
		const fillHistory = async (resultArray, curAddress, _users, _listPersoWording) =>{
            var data = [0,0,0,0,0,0,0,0,0,0,0,0];
			var i = 1
			for (let key=tailleWording - 1; key>=0; key--){

               
				//convert timestamp to date (*1000 below is to get it in ms)
				var d = new Date(parseInt(resultArray[key].timeStamp)*1000);

				if (resultArray[key].from == curAddress) {
                    data[d.getMonth()] -= Math.round(resultArray[key].value*Math.pow(10,-18));
				}
				else {
                    data[d.getMonth()] += Math.round(resultArray[key].value*Math.pow(10,-18));
                }
            }
            
        var today = new Date();
        document.getElementById("monthEarning").innerHTML = (Math.round(data[today.getMonth()])).toString();

            // Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';

function number_format(number, decimals, dec_point, thousands_sep) {
  // *     example: number_format(1234.56, 2, ',', ' ');
  // *     return: '1 234,56'
  number = (number + '').replace(',', '').replace(' ', '');
  var n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
    dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
    s = '',
    toFixedFix = function(n, prec) {
      var k = Math.pow(10, prec);
      return '' + Math.round(n * k) / k;
    };
  // Fix for IE parseFloat(0.55).toFixed(0) = 0;
  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }
  if ((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1).join('0');
  }
  return s.join(dec);
}

// Area Chart Example
var primary = getComputedStyle(document.documentElement).getPropertyValue('--primary');

var ctx = document.getElementById("myAreaChart");
var myLineChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [{
      label: "Earnings",
      lineTension: 0.3,
      backgroundColor: "rgba(78, 115, 223, 0.05)",
      borderColor: primary,
      pointRadius: 3,
      pointBackgroundColor: primary,
      pointBorderColor: primary,
      pointHoverRadius: 3,
      pointHoverBackgroundColor: primary,
      pointHoverBorderColor: primary,
      pointHitRadius: 10,
      pointBorderWidth: 2,
      data: data,
    }],
  },
  options: {
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 10,
        right: 25,
        top: 25,
        bottom: 0
      }
    },
    scales: {
      xAxes: [{
        time: {
          unit: 'date'
        },
        gridLines: {
          display: false,
          drawBorder: false
        },
        ticks: {
          maxTicksLimit: 7
        }
      }],
      yAxes: [{
        ticks: {
          maxTicksLimit: 5,
          padding: 10,
          // Include a dollar sign in the ticks
          callback: function(value, index, values) {
            return '$' + number_format(value);
          }
        },
        gridLines: {
          color: "rgb(234, 236, 244)",
          zeroLineColor: "rgb(234, 236, 244)",
          drawBorder: false,
          borderDash: [2],
          zeroLineBorderDash: [2]
        }
      }],
    },
    legend: {
      display: false
    },
    tooltips: {
      backgroundColor: "rgb(255,255,255)",
      bodyFontColor: "#858796",
      titleMarginBottom: 10,
      titleFontColor: '#6e707e',
      titleFontSize: 14,
      borderColor: '#dddfeb',
      borderWidth: 1,
      xPadding: 15,
      yPadding: 15,
      displayColors: false,
      intersect: false,
      mode: 'index',
      caretPadding: 10,
      callbacks: {
        label: function(tooltipItem, chart) {
          var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
          return datasetLabel + ': $' + number_format(tooltipItem.yLabel);
        }
      }
    }
  }
});



		}
        fillHistory(resultArray, curAddress, users, listPersoWording);
        
    });
};

getData();