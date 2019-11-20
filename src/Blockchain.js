import React, {Component} from 'react';
import abi from './abi';
import { Line, Doughnut } from 'react-chartjs-2';
import Select from 'react-select';

const Web3 = require('web3');
const infura = `https://ropsten.infura.io/v3/cc89e42528e441afb25d84e1499632ba`;
const web3 = new Web3(new Web3.providers.HttpProvider(infura));
web3.eth.defaultAccount = "0xc4d446c6B924c431f89214319D5A3e6bb67e7627";
var contract_address = "0xaD57d1eD8A07Dcd5657eb7A1880C2Cc0C71257aE"; //Contract Address

class Blockchain extends Component{
    constructor(){
        super();
        this.state = {
            users: [],
            balance : 0,
            history : {},
            chart: {}
        };
    }

    async componentDidMount() {
        web3.eth.defaultAccount = await this.get_user_adress();
        this.setState({balance: await this.get_user_balance(web3.eth.defaultAccount)});
        this.setState({users: await this.get_users()});
        this.setState({history: await this.get_line_history()});
        this.setState({chart: await this.get_chart_history()});
    }

    get_user_balance = async(address) =>{
        if(address){
            return await new Promise(function(resolve, reject){
                contract.methods.balanceOf(address).call((err,res) =>{
                        if(err) return reject(err);
                        resolve(Math.round(res*Math.pow(10,-18)));
                })
            })
        }
    };

    get_user_adress = async() =>{
        return new Promise((resolve, reject) =>{
            this.get_all_users().then((value)=>{
                var name = (this.props.admin)? "Administrator":this.props.user.displayName;
                value.forEach(person => {
                    if(person.name === name){
                        resolve(person.address);
                    }
                });
            });
        })
    }

    get_all_users = async() =>{
        return await new Promise(function(resolve, reject){
            contract.methods.getMembersAndNameAndBalance().call((err, res) =>{
                    if(err) return reject(err);

                    var users = [];
                    for(var i = 0; i < res[0].length; i++){
                        users[i] = {};
                        users[i].address = res[0][i];
                        users[i].name = (web3.utils.toAscii(res[1][i])).split("\u0000")[0];
                        users[i].balance = (res[2][i])*Math.pow(10,-18);
                    }
                    resolve(users);
            })
        })
    }

    get_users = async() =>{
        return new Promise((resolve, reject) =>{
            this.get_all_users().then((value)=>{
                var options = [];
                for(var i = 0; i < value.length-1; i++){
                    if(value[i].name !== "Administrator"){
                        options.push({value: value[i].address, label: value[i].name})
                    }
                }
                resolve(options);
            });
        })
    }

    get_history= async() =>{
        return await new Promise(function(resolve, reject){
              etherscan.account.tokentx(web3.eth.defaultAccount,contract_address,1, 'latest', 'asc').then(function(data){
                    get_user_wordings(web3.eth.defaultAccount).then(function(messages){
                          var res = data.result;
                          var history = [];
                          for(var i = res.length-1, j = 0; i>=0; i--, j++){
                                history[j] = {};
                                history[j].date = new Date(parseInt(res[i].timeStamp)*1000); //convert timestamp to date (*1000 below is to get it in ms)
                                history[j].from = res[i].from;
                                history[j].to = res[i].to;
                                history[j].amount = Math.round(res[i].value*Math.pow(10,-18));
                                history[j].message = messages[3][j];
                          }
                          resolve(history);
                    })
              })
              .catch(e=>{
                  reject(e)
              })
        })
    }

    get_user_name = async (address) =>{
        var name = new Promise(function(resolve, reject){
            try{
                    contract.methods.getName(address).call((err, res) => {
                        let name = web3.utils.toAscii(res).split("\u0000")[0];
                        if (err) return reject(err);
                        resolve(name);
                    })
            } catch(e){}
        })
        return await name;
    }

    get_line_history = async() =>{
        return new Promise((resolve, reject) =>{
            this.get_history().then((value)=>{
                var history = {
                    labels : [],
                    datasets : [
                        {
                            fill: false,
                            label: "Sent",
                            data: [],
                            borderColor: "#EE6765"
                        },
                        {
                            fill: false,
                            label: "Received",
                            data: [],
                            borderColor: "#053C5A"
                        }
                    ]
                };
                const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                var address = web3.eth.defaultAccount;
                for(var i = value.length-1, j = 0; i>=0; i--, j++){
                    if(value[i].to.toUpperCase() !== "0x0000000000000000000000000000000000000000".toUpperCase()&&
                        value[i].from.toUpperCase() !== "0x0000000000000000000000000000000000000000".toUpperCase()){
                        if( !history.labels.includes(monthNames[new Date(value[i].date).getMonth()])){
                            history.labels.push(monthNames[new Date(value[i].date).getMonth()])
                            history.datasets[0].data.push(0);
                            history.datasets[1].data.push(0);
                        }
                        history.datasets[((value[i].from).toUpperCase() === address.toUpperCase() ) ?0: 1].data[history.labels.length-1]+= value[i].amount;
                    }
                }
                resolve(history)
            })
            .catch(e =>{
                console.log(e);
            })
        })
    }

    get_colors(size){
        var tab = [];
        var colors = ["#EE6765","#053C5A", "#F4F6F7"];
        for(var i = 0; i < size-1; i++){
            tab[i] = colors[i%colors.length]
        }
        return(tab);
    }

    get_chart_history = async() =>{
        return new Promise((resolve, reject) =>{
            this.get_history().then( async (value)=>{
                var colors = [];
                var chart = {
                    labels : [],
                    datasets : [{
                        backgroundColor: colors,
                        data : []
                    }]
                };
                for(var i = value.length-1, j = 0; i>=0; i--, j++){
                    if(value[i].to.toUpperCase() !== "0x0000000000000000000000000000000000000000".toUpperCase() && 
                        value[i].from.toUpperCase() !== "0x0000000000000000000000000000000000000000".toUpperCase()&&
                        value[i].amount!== 0){
                        var user_name = await this.get_user_name(value[i].to);
                        if(!chart.labels.includes(user_name)){
                            chart.labels.push(user_name);
                            chart.datasets[0].data.push(value[i].amount);
                        }else{
                            chart.datasets[0].data[chart.labels.indexOf(user_name)] += value[i].amount;
                        }
                    }
                }
                chart.datasets[0].backgroundColor = await this.get_colors(chart.labels.length);
                resolve(chart)
            })
            .catch(e =>{
                console.log(e);
            })
        })
    }
    
    transfer_tokens= async(to_address, amount, message = null, from_address = null) =>{
        return await new Promise(function(resolve, reject){
            amount = amount*Math.pow(10,18);
            message = web3.fromAscii(message);
            if(from_address != null){
                    contract.methods.transferFrom(from_address, to_address, amount, message).call((err,res)=>{
                        if(err) return reject(err);
                        resolve(res);
                    })
            }
            else {
                    if (message != null){
                        contract.methods.transfer(to_address, amount, message).call((err,res) =>{
                                if(err) return reject(err);
                                resolve(res);
                        })
                    }
                    else{
                        contract.methods.tranferToAssociation(to_address, amount).call((err,res) =>{
                                if(err) return reject(err);
                                resolve(res);
                        })
                    }
            }
        })
    }

    sendTokens = async(event) =>{
        event.preventDefault();
        const {amount, address, message} = this.form;
        await this.transfer_tokens( address.value, amount, message)
    }

    render(){
        return (
            <div>
                <div className="d-sm-flex align-items-center justify-content-between mb-4">
                    <h1 className="h3 mb-0 text-gray-800">Aurexia Social Token</h1>
                </div>
                <div className="row">
                    <div className="col-xl-3 col-md-6 mb-4">
                        <div className="card border-left-primary shadow h-100 py-2">
                            <div className="card-body">
                                <div className="row no-gutters align-items-center">
                                    <div className="col mr-2">
                                        <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">Earnings (Annual)</div>
                                        <div className="h5 mb-0 font-weight-bold text-gray-800">{this.state.balance} AST</div>
                                    </div>
                                    <div className="col-auto">
                                        <i className="fas fa-calendar fa-2x text-gray-300"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xl-8 col-lg-7">
                        <div className="card shadow mb-4">
                            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                <h6 className="m-0 font-weight-bold text-primary">History</h6>
                                { false &&
                                <div className="dropdown no-arrow">
                                    <div className="dropdown-toggle" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <i className="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"></i>
                                    </div>
                                    <div className="dropdown-menu dropdown-menu-right shadow animated--fade-in" aria-labelledby="dropdownMenuLink">
                                        <div className="dropdown-header">History:</div>
                                        <div className="dropdown-item" href="">Details</div>
                                    </div>
                                </div>}
                            </div>
                            <div className="card-body">
                                <Line data={this.state.history} options={{legend: {display: false}}}/>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-4 col-lg-5">
                        <div className="card shadow mb-4">
                            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                <h6 className="m-0 font-weight-bold text-primary">Revenue</h6>
                            </div>
                            <div className="card-body">
                                <div className="chart-pie pt-4 pb-2">
                                    <div className="chart-js-size-monitor"></div>
                                    <Doughnut classNam="center-block" data={this.state.chart} options={{legend: {display: false}}}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xl-6 col-lg-6">
                        <div className="card shadow mb-4">
                            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                <h6 className="m-0 font-weight-bold text-primary">Send AST</h6>
                            </div>
                            <div className="card-body">
                                <form className="user" onSubmit={this.sendTokens} ref={form => this.form = form}>
                                    <div className="form-group">
                                        <input type="number" max={this.state.balance} className="form-control form-control-user" name="amount"></input>
                                    </div>
                                    <div className="form-group">
                                        <Select name="address" options={this.state.users}/>
                                    </div>
                                    <div className="form-group">
                                        <input type="text" className="form-control form-control-user" name="message"></input>
                                    </div>
                                    <button className="btn btn-primary btn-user btn-block">Send</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Blockchain;

const contract = new web3.eth.Contract(abi, contract_address, {
      from: web3.eth.defaultAccount ,
      gas: 10000000,
});

var etherscan = require('etherscan-api').init('NSAMUW521D6CQ63KHUPRQEERSW8FVRAF9B', 'ropsten');
var get_user_wordings = async(address) =>{
      return await new Promise(function(resolve, reject){
            contract.methods.getPersonalWordings(address).call((err,res) =>{
                  if(err) return reject(err);
                  for(var i = 0; i< res[3].length; i++){
                        res[3][i] = web3.utils.toAscii(res[3][i]).split("\u0000")[0];
                  }
                  resolve(res);
            })
      })
};