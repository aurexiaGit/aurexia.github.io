import React, {Component} from 'react';
import ReactTable from 'react-table';
import abi from './abi';
import 'react-table/react-table.css';

const Web3 = require('web3');
const infura = `https://ropsten.infura.io/v3/cc89e42528e441afb25d84e1499632ba`;
const web3 = new Web3(new Web3.providers.HttpProvider(infura));
web3.eth.defaultAccount = "0xc4d446c6B924c431f89214319D5A3e6bb67e7627";
var contract_address = "0xaD57d1eD8A07Dcd5657eb7A1880C2Cc0C71257aE"; //Contract Address
const contract = new web3.eth.Contract(abi, contract_address, {
    from: web3.eth.defaultAccount ,
    gas: 10000000,
});

class Users extends Component{

    constructor(){
        super();
        this.state = {
            users : []
        }
    }
    async UNSAFE_componentWillMount() {
        this.setState({users: await this.get_all_users()});
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
                            <div className="card-body">
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
        );
    }
}

export default Users;