import React from 'react';
import WalletConnection from './WalletConnection';
import '../styles/Navbar.css';

const Navbar = ({ signer, setSigner, setCurrentPage }) => {
    return (
        <nav className="navbar">
            <div className="navbar-logo" onClick={() => setCurrentPage('proposals')}>VoteSafe</div>
            <div className="navbar-links">
                {signer ? (
                    <>
                        <a onClick={() => setCurrentPage('proposals')} className="navbar-link">Proposals</a>
                        <a onClick={() => setCurrentPage('createproposal')} className="navbar-link">Create Proposal</a>
                        <a onClick={() => setCurrentPage('about')} className="navbar-link">About</a>
                    </>
                ) : (
                    <>
                        <a onClick={() => setCurrentPage('home')} className="navbar-link">Home</a>
                        <a onClick={() => setCurrentPage('about')} className="navbar-link">About</a>
                        <a onClick={() => setCurrentPage('contact')} className="navbar-link">Contact</a>
                    </>
                )}
            </div>
            <div className="navbar-user-actions">
                <div className="navbar-bell-icon">🔔</div>
                <WalletConnection signer={signer} setSigner={setSigner} />
            </div>
        </nav>
    );
};

export default Navbar;