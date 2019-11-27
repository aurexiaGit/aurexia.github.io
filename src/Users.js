import React, {Component} from 'react';
import ReactTable from 'react-table';
import abi from './abi';
import 'react-table/react-table.css';
var dateFormat = require('dateformat');

const Web3 = require('web3');
const infura = `https://ropsten.infura.io/v3/cc89e42528e441afb25d84e1499632ba`;
const web3 = new Web3(new Web3.providers.HttpProvider(infura));
web3.eth.defaultAccount = "0xc4d446c6B924c431f89214319D5A3e6bb67e7627";
var contract_address = "0xaD57d1eD8A07Dcd5657eb7A1880C2Cc0C71257aE"; //Contract Address
const contract = new web3.eth.Contract(abi, contract_address, {
    from: web3.eth.defaultAccount ,
    gas: 10000000,
});

var get_All_wordings = async() =>{
    return await new Promise(function(resolve, reject){
          contract.methods.getAllWordings().call((err,res) =>{
                if(err) return reject(err);
                for(var i = 0; i< res[3].length; i++){
                      res[3][i] = web3.utils.toAscii(res[3][i]).split("\u0000")[0];
                }
                resolve(res);
          })
    })
};

var compare_address = (address1, address2)=>{
    return address1.toUpperCase() === address2.toUpperCase();
}

class Users extends Component{

    constructor(){
        super();
        this.state = {
            users : [],
            transactions : []
        }
    }

    async UNSAFE_componentWillMount() {
        this.setState({users: await this.get_all_users()});
        this.setState({transactions: await this.get_all_history()});
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

    get_name = async (address)=>{
        return (this.state.users.find(user => compare_address(user.address, address)))? this.state.users.find(user => compare_address(user.address, address)).name : await this.get_user_name(address);
    }

    get_all_history = async() =>{
        return new Promise((resolve, reject)=> {
            fetch('https://api-ropsten.etherscan.io/api?module=account&action=tokentx&contractaddress=0xaD57d1eD8A07Dcd5657eb7A1880C2Cc0C71257aE&startblock=0&endblock=999999999&sort=asc&apikey=NSAMUW521D6CQ63KHUPRQEERSW8FVRAF9B')
                .then(res =>{
                    res.json().then((data)=>{
                        get_All_wordings().then(async(messages)=>{
                            var res = data.result;
                            var history = [];
                            for(var i = res.length-1, j = 0; i>=0; i--, j++){
                                var temp = res[i];
                                history[j] = {};
                                history[j].date = dateFormat(parseInt(temp.timeStamp)*1000, "mmmm dd yyyy");; //convert timestamp to date (*1000 below is to get it in ms)
                                history[j].from = await this.get_name(temp.from);
                                history[j].to = await this.get_name(temp.to);
                                history[j].amount = Math.round(res[i].value * Math.pow(10,-18));
                                history[j].message = messages[3][i];
                            }
                            resolve(history);
                        })
                    })
                })
        });
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

    render(){
        return (
            <div>
                <div className="d-sm-flex align-items-center justify-content-between mb-4">
                    <h1 className="h3 mb-0 text-gray-800">Aurexia Social Token Users</h1>
                </div>
                <div className="row">
                    <div className="col-lg-12">
                        <div className="card shadow mb-4">
                            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                <h6 className="m-0 font-weight-bold text-primary">User Management</h6>
                            </div>
                            <div className="card-body">
                                {false && <div><span className="table-add float-right" style={{marginBottom : '5px'}} >
                                    <a className="form-control" href="?action=AddUser">
                                        <i className="fas fa-plus" aria-hidden="true"></i>
                                        Add User
                                    </a>
                                </span>
                                <span className="table-add float-right" style={{marginBottom : '5px', marginRight:'5px'}} >
                                    <a className="form-control" href="?action=AddUser">
                                        <i className="fas fa-plus" aria-hidden="true"></i>
                                        Add Users
                                    </a>
                                </span></div>}
                                <div className="table-responsive table-editable">
                                    <ReactTable data={this.state.users} columns={[{
                                        Header: "Name",
                                        accessor: "name"
                                    },{
                                        Header: "Address",
                                        accessor: "address"
                                    },{
                                        Header: "Balance",
                                        accessor: "balance"
                                    }]}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12">
                        <div className="card shadow mb-4">
                            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                <h6 className="m-0 font-weight-bold text-primary">Users Transactions</h6>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive table-editable">
                                    <ReactTable data={this.state.transactions} columns={[{
                                        Header : "Date",
                                        accessor: 'date'
                                    },{
                                        Header: "From",
                                        accessor: "from"
                                    },{
                                        Header: "To",
                                        accessor: "to"
                                    },{
                                        Header: "Amount",
                                        accessor: "amount"
                                    },{
                                        Header: "Description",
                                        accessor: 'message'
                                    }]}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Users;