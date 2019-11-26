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
                                        Welcome {this.props.isAuthenticated && <strong>{this.props.user.displayName},</strong>} to the Aurexia Finlab's Application
                                    </div>
                                    <Online>
                                        { !this.props.isAuthenticated &&
                                        <div>
                                            Please, sign in with your microsoft account to see the Finlab's functionalities
                                        </div>}
                                    </Online>
                                    <Offline>You need to have an internet connection to see the website</Offline>
                                    <div>
                                        To get more information about the Finlab, contact <a href="mailto:soilhat.mohamed@aurexia.com">Soilhat MOHAMED</a>
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