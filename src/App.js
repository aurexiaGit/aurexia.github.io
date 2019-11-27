import React, { Component } from 'react';
import Blockchain from './Blockchain';
import Topbar from './Topbar';
import Nav from './Nav';
import Home from './Home';
import Users from './Users'
import {
  BrowserRouter as Router,
  Switch,
  Route
  //Link
} from "react-router-dom";
import config from './Config';
import { getUserDetails, getPhoto } from './GraphService';
import { UserAgentApplication } from 'msal';
import { Online } from "react-detect-offline";
import {isMobile} from 'react-device-detect';

const Administrators = ["Soilhat MOHAMED","Amine BADRY", "Samir FEDDI"];

class App extends Component {
  constructor(props) {
    super(props);
  
    if(navigator.onLine){this.userAgentApplication = new UserAgentApplication({
          auth: {
              clientId: config.appId
          },
          cache: {
              cacheLocation: "localStorage",
              storeAuthStateInCookie: true
          }
      });
  
    var user = this.userAgentApplication.getAccount();
  
    this.state = {
      isOpen : (isMobile)? false : true,
      toggle : this.toggle.bind(this),
      isAuthenticated: (user !== null),
      user: {},
      error: null
    };
    this.toggle = this.toggle.bind(this)
    if (user) {
      // Enhance user object with data from Graph
      this.getUserProfile();
    }}
  }

  async login() {
    try {
      await this.userAgentApplication.loginPopup(
          {
            scopes: config.scopes,
            prompt: "select_account"
        });
      await this.getUserProfile();
    }
    catch(err) {
      var error = {};
  
      if (typeof(err) === 'string') {
        var errParts = err.split('|');
        error = errParts.length > 1 ?
          { message: errParts[1], debug: errParts[0] } :
          { message: err };
      } else {
        error = {
          message: err.message,
          debug: JSON.stringify(err)
        };
      }
  
      this.setState({
        isAuthenticated: false,
        user: {},
        error: error
      });
    }
  }

  logout() {
    this.userAgentApplication.logout();
  }

  async getUserProfile() {
    try {
      // Get the access token silently
      // If the cache contains a non-expired token, this function
      // will just return the cached token. Otherwise, it will
      // make a request to the Azure OAuth endpoint to get a token
  
      var accessToken = await this.userAgentApplication.acquireTokenSilent({
        scopes: config.scopes
      });
      if (accessToken) {
        // Get the user's profile from Graph
        var user = await getUserDetails(accessToken);
        var avatar = await getPhoto(accessToken);
        var urlCreator = window.URL || window.webkitURL;
        this.setState({
          isAuthenticated: true,
          user: {
            name: (Administrators.includes(user.displayName))?"Administrator":"",
            displayName: user.displayName,
            email: user.mail || user.userPrincipalName,
            avatar: (avatar !== null)?urlCreator.createObjectURL(avatar):""
          },
          error: null
        });
      }
    }
    catch(err) {
      var error = {};
      if (typeof(err) === 'string') {
        var errParts = err.split('|');
        error = errParts.length > 1 ?
          { message: errParts[1], debug: errParts[0] } :
          { message: err };
      } else {
        error = {
          message: err.message,
          debug: JSON.stringify(err)
        };
      }
  
      this.setState({
        isAuthenticated: false,
        user: {},
        error: error
      });
    }
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    })
  }

  render() {
      return (
        <div id="wrapper">
          {this.state && this.state.isAuthenticated && 
          <Nav
            isOpen = {this.state.isOpen}
            toggle = {this.toggle} 
            admin = {(this.state.user.name === "Administrator")}/>
          }
          <div id="content-wrapper" className="d-flex flex-column">
            <div id="content">
              <Online>
                <Topbar
                  toggle = {this.toggle} 
                  isAuthenticated={(this.state)?this.state.isAuthenticated: false}
                  authButtonMethod={(this.state && this.state.isAuthenticated) ? this.logout.bind(this) : this.login.bind(this)}
                  user={(this.state)? this.state.user: null}>
                </Topbar>
              </Online>
              <div className="container-fluid">
                {this.state && this.state.isAuthenticated && 
                <Router>
                  <Switch>
                    <Route path="/new/ast">
                      <Blockchain 
                        isAuthenticated={this.state.isAuthenticated}
                        user={this.state.user}
                        admin={false}/>
                    </Route>
                    {this.state.user.name === "Administrator" &&
                    <Route path="/new/astAdmin">
                      <Blockchain 
                        isAuthenticated={this.state.isAuthenticated}
                        user={this.state.user}
                        admin={true}/>
                    </Route>}
                    {this.state.user.name === "Administrator" &&
                    <Route path="/new/astUsersAdmin">
                      <Users 
                        isAuthenticated={this.state.isAuthenticated}
                        user={this.state.user}
                        admin={true}/>
                    </Route>}
                    <Route path="/new/">
                      <Home
                        isAuthenticated={this.state.isAuthenticated}
                        user={this.state.user}
                      />
                    </Route>
                  </Switch>
                </Router>}
                { (!this.state || !this.state.isAuthenticated) &&
                  <Home
                    isAuthenticated={(this.state)? this.state.isAuthenticated : false}
                    user={(this.state)? this.state.user: null}
                  />
                }
              </div>
            </div>
            
            <footer className="sticky-footer bg-white">
              <div className="container my-auto">
                <div className="copyright text-center my-auto">
                  <span>Copyright &copy; Aurexia 2019</span>
                </div>
              </div>
            </footer>

          </div>
        </div>
      );
  }

  setErrorMessage(message, debug) {
    this.setState({
      error: {message: message, debug: debug}
    });
  }
}

export default App;