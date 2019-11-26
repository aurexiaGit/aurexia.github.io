import React, {Component} from 'react';
import abi from './abi';
import { Line, Doughnut } from 'react-chartjs-2';
import Select from 'react-select';
import ReactTable from 'react-table';


import 'react-table/react-table.css';
var dateFormat = require('dateformat');

const Web3 = require('web3');
const infura = `https://ropsten.infura.io/v3/cc89e42528e441afb25d84e1499632ba`;
const web3 = new Web3(new Web3.providers.HttpProvider(infura));
web3.eth.defaultAccount = "0xc4d446c6B924c431f89214319D5A3e6bb67e7627";
var contract_address = "0xaD57d1eD8A07Dcd5657eb7A1880C2Cc0C71257aE"; //Contract Address

class Blockchain extends Component{
    constructor(){
        super();
        this.state = {
            details: false,
            users: [],
            balance : 0,
            chart: {},
            history : {},
            history_tab : [],
            rank : {
                type : {value:"Balance", label : "Balance"},
                me : 0,
                first : "",
                second : "",
                third : ""
            }
        };
    }

    async UNSAFE_componentWillMount() {
        this.setState({users: await this.get_users()});
        var rank = await this.rank();
        this.setState({rank : {
            first : rank[1].name + " : " + rank[1].balance + " AST",
            second : rank[2].name + " : " + rank[2].balance + " AST",
            third : rank[3].name + " : " + rank[3].balance + " AST"
        }})
        web3.eth.defaultAccount = await this.get_user_adress();
        this.setState({balance: await this.get_user_balance(web3.eth.defaultAccount)});
        this.setState({history: await this.get_line_history()});
        this.setState({chart: await this.get_chart_history()});
        this.setState({history_tab: await this.get_history_tab()})
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
                    users[i].balance = Math.round((res[2][i])*Math.pow(10,-18));
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
                                history[j].message = messages[3][i];
                          }
                          resolve(history);
                    })
              })
              .catch(e=>{
                  reject(e)
              })
        })
    }

    get_history_tab = async()=>{
        return new Promise((resolve, reject)=>{
            this.get_history().then(async (value)=>{
                var hist =[];
                for(var i = value.length-1, j = 0; i>=0; i--, j++){
                    hist[j] = {};
                    hist[j].date = dateFormat(value[j].date, "mmmm dd yyyy");
                    hist[j].amount = value[j].amount;
                    hist[j].message = value[j].message;
                    hist[j].to =  (value[j].to.toUpperCase() === web3.eth.defaultAccount.toUpperCase()) ? await this.get_user_name(value[j].from) : await this.get_user_name(value[j].to);
                }
                resolve(hist)
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
                            borderColor: "#FF5C5F"
                        },
                        {
                            fill: false,
                            label: "Received",
                            data: [],
                            borderColor: "#023B59"
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
        var colors = ["#023B59","#035883", "#FF5C5F", "#FD8B7F", "#908476", "#EAE8DA"];
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
                        var user_name = await this.get_user_name(value[i].from);
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

    changeRanking = selected =>{
        this.setState({rank: { type: selected}})
        this.rank();
    }
    
    get_all_transactions = async() =>{
        return await new Promise(function(resolve, reject){
            contract.methods.getAllInfoTransaction().call((err, res) =>{
                if(err) return reject(err);
                var trans = [];
                for(var i = 0; i < res[0].length; i++){
                        trans[i] = {};
                        trans[i].nbrTransactions = res[1][i];
                        trans[i].received = Math.round((res[2][i])*Math.pow(10,-18));
                        trans[i].sent = Math.round((res[3][i])*Math.pow(10,-18));
                        trans[i].name = (web3.utils.toAscii(res[5][i])).split("\u0000")[0];
                }
                resolve(trans);
            })
        })
    }

    dynamicSort(property) {
        var sortOrder = -1;
        if(property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }
        return function (a,b) {
            /* next line works with strings and numbers, 
             * and you may want to customize it to your needs
             */
            var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            return result * sortOrder;
        }
    }

    async rank(){
        var users = await this.get_all_users();
        var resultAll = await this.get_all_transactions();
        switch(this.state.rank.type.value){
            case "Transactions":
                resultAll.sort(this.dynamicSort('nbrTransactions'));
                this.setState({rank : {
                    first : resultAll[1].name + " : " + resultAll[1].nbrTransactions + " transaction(s)",
                    second : resultAll[2].name + " : " + resultAll[2].nbrTransactions + " transaction(s)",
                    third : resultAll[3].name + " : " + resultAll[3].nbrTransactions + " transaction(s)"
                }})
                break;
            
            case "Sent":
                resultAll.sort(this.dynamicSort('sent'));
                this.setState({rank : {
                    first : resultAll[1].name + " : " + resultAll[1].sent + " AST sent",
                    second : resultAll[2].name + " : " + resultAll[2].sent + " AST sent",
                    third : resultAll[3].name + " : " + resultAll[3].sent + " AST sent"
                }})
                break;

            case "Received":
                resultAll.sort(this.dynamicSort('received'));
                this.setState({rank : {
                    first : resultAll[1].name + " : " + resultAll[1].received + " AST received",
                    second : resultAll[2].name + " : " + resultAll[2].received + " AST received",
                    third : resultAll[3].name + " : " + resultAll[3].received + " AST received"
                }})
                break;
            
            default:
                users.sort(this.dynamicSort('balance'));
                this.setState({rank : {
                    first : users[1].name + " : " + users[1].balance + " AST",
                    second : users[2].name + " : " + users[2].balance + " AST",
                    third : users[3].name + " : " + users[3].balance + " AST"
                }})
                break;
        }
        return users;
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
                                <div className="dropdown no-arrow">
                                    <div className="dropdown-toggle" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <i className="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"></i>
                                    </div>
                                    <div className="dropdown-menu dropdown-menu-right shadow animated--fade-in" aria-labelledby="dropdownMenuLink">
                                        <div className="dropdown-header">History:</div>
                                        <div className="dropdown-item" onClick = {() =>{this.setState({details : !this.state.details})}}>Details</div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body">
                                {!this.state.details && <Line data={this.state.history} options={{legend: {display: false}}}/>}
                                {this.state.details && 
                                    <div >
                                        {false &&<table className="table table-bordered" id="dataTable" width="100%" cellSpacing="0">
                                            <thead>
                                                <tr>
                                                    <th>Date</th>
                                                    <th>From/To</th>
                                                    <th>Amount</th>
                                                    <th>Desription</th>
                                                </tr>
                                            </thead>

                                        </table>}
                                        <ReactTable defaultPageSize={5} data={this.state.history_tab} columns={[{
                                            Header:'Date',
                                            accessor: "date"
                                        },{
                                            Header:'From/To',
                                            accessor: "to"
                                        },{
                                            Header:'Amount',
                                            accessor: 'amount'
                                        },{
                                            Header:'Description',
                                            accessor:'message'
                                        }]
                                        }/>
                                    </div>
                                }
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
                    <div className="col-xl-6 col-lg-6">
                        <div className="card shadow mb-4">
                            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                <h6 className="m-0 font-weight-bold text-primary">Ranking</h6>
                            </div>
                            <div className="card-body">
                                <div className="form-group">
                                    <Select name="ranking" value={this.state.rank.type} onChange={this.changeRanking} options={[
                                        {value:"Balance", label : "Balance"},
                                        {value:"Transactions", label : "Number of transactions"},
                                        {value:"Sent", label : "Number of tokens sent"},
                                        {value:"Received", label:"Number of tokens received"}
                                    ]}/>
                                </div>
                                <div className="form-group">
                                    <p type="text" className="form-control" name="message" style={{borderRadius : 10 + 'rem'}}>
                                        # 1 : {this.state.rank.first}
                                    </p>
                                    <p type="text" className="form-control form-control-user" name="message" style={{borderRadius : 10 + 'rem'}} >
                                        # 2 : {this.state.rank.second}
                                    </p>
                                    <p type="text" className="form-control form-control-user" name="message" style={{borderRadius : 10 + 'rem'}} >
                                        # 3 : {this.state.rank.third}
                                    </p>
                                </div>
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