import React from 'react';
import '@fortawesome/fontawesome-free/css/all.css';
import {isMobile} from 'react-device-detect';

function AdminPart(props){
    if(props.admin){
        return(
            <div>
                <li className="nav-item">
                    <div className="nav-link collapsed" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">
                        <i className="fas fa-fw fa-cog"></i>
                        <span>Admin</span>
                    </div>
                    <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo" data-parent="#accordionSidebar">
                        <div className="bg-white py-2 collapse-inner rounded">
                            <h6 className="collapse-header">Admin Panel:</h6>
                            <a className="collapse-item" href="/new/astAdmin">Account</a>
                            <a className="collapse-item" href="/new/astUsersAdmin">Users Management</a>
                        </div>
                    </div>
                </li>
            </div>
        )
    }
    return(
        <div></div>
    )
}

export default class NavBar extends React.Component {

  render() {
    return (
        <ul className={(this.props.isOpen)?"navbar-nav bg-gradient-primary sidebar sidebar-dark accordion":"navbar-nav bg-gradient-primary sidebar sidebar-dark accordion toggled"} id="accordionSidebar">
            <a className="sidebar-brand d-flex align-items-center justify-content-center" href="/new/">
                <div className="sidebar-brand-icon">
                    <img src="img/Aurexia logo white.png" width="100%" alt="Aurexia Logo"/>
                </div>
            </a>
            <hr className="sidebar-divider"/>
            {(!isMobile  && this.props.isOpen) && 
            <div className="sidebar-heading">
                 Aurexia Social Token
            </div>
            }
            {(isMobile || !this.props.isOpen) && 
            <div className="sidebar-heading">
                 AST
            </div>
            }
            <li className="nav-item">
                <a className="nav-link" href="/new/ast">
                    <i className="fas fa-fw fa-tachometer-alt"/>
                    <span> My Account</span>
                </a>
            </li>
            <AdminPart admin = {this.props.admin}/>
            <div className="text-center d-none d-md-inline">
                <button className="rounded-circle border-0" id="sidebarToggle" onClick={this.props.toggle}></button>
            </div>
        </ul>
    );
  }
}