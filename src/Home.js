import React, {Component} from 'react';
import { Offline, Online } from "react-detect-offline";

class Home extends Component{

    render(){
        return (
            <div>
                <div className="container-fluid">
                    <div className="row main">
                        <div className="col-lg-6 login-logo">
                            <Online>
                                <div className="login-logo">
                                    <img id="AST" className="center-block" src="img/finlab blanc.png" alt="Aurexia Finlab"/>
                                </div>
                            </Online>
                        </div>
                        <div className="col-lg-6">
                            <div className="card card-signin">
                                <div className="card-body text-center">
                                    <div>
                                        Welcome {this.props.isAuthenticated && <strong>{this.props.user.displayName},</strong>}
                                    </div>
                                    <Online>
                                        { !this.props.isAuthenticated &&
                                        <div>
                                            Please, sign in with your microsoft account to access your AST wallet
                                        </div>}
                                    </Online>
                                    <Offline>You need to have an internet connection to see the website</Offline>
                                    <div>
                                        To get more information about AST, contact <a href="mailto:ast@aurexia.com">AST</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
                   
        );
    }
}

export default Home;