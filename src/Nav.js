import React from 'react';
import '@fortawesome/fontawesome-free/css/all.css';

function AdminPart(props){
    if(props.admin){
        return(
            <div>
                <div className="sidebar-heading">
                    Admin
                </div>
        
                <li className="nav-item">
                <a className="nav-link" href="/astAdmin">
                    <i className="fas fa-fw fa-users"></i>
                    <span>AST</span></a>
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
            <a className="sidebar-brand d-flex align-items-center justify-content-center" href="/">
                <div className="sidebar-brand-icon">
                    <img src="../img/Aurexia logo white.png" width="100%" alt="Aurexia Logo"/>
                </div>
            </a>
            <hr className="sidebar-divider my-0"/>
            <li className="nav-item">
                <a className="nav-link" href="/ast">
                    <i className="fas fa-fw fa-tachometer-alt"/>
                    <span>Dashboard</span>
                </a>
            </li>
            <hr className="sidebar-divider"/>
            <AdminPart admin = {this.props.admin}/>
            <div className="text-center d-none d-md-inline">
                <button className="rounded-circle border-0" id="sidebarToggle" onClick={this.props.toggle}></button>
            </div>
        </ul>
    );
  }
}