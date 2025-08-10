import React, { useState } from 'react';
import WalletConnection from './components/WalletConnection';
import ProposalDashboard from './components/ProposalDashboard';
import Navbar from './components/Navbar';
import About from './components/About';
import CreateProposal from './components/CreateProposal'; // Import the new component
import Contact from './components/Contact'; // Import the new Contact component
import './styles/index.css';

const App = () => {
    const [signer, setSigner] = useState(null);
    const [currentPage, setCurrentPage] = useState('home');

    const renderPage = () => {
        switch (currentPage) {
            case 'home':
            case 'proposals':
                return signer ? (
                    <ProposalDashboard signer={signer} setCurrentPage={setCurrentPage} />
                ) : (
                    <div className="landing-page">
                        <h1>Confidential DAO Voting</h1>
                        <p>Secure your voice. Our system ensures private, verifiable, and coercion-free governance using the Oasis Network.</p>
                        <WalletConnection setSigner={setSigner} />
                    </div>
                );
            case 'createproposal':
                if (signer) {
                    return <CreateProposal signer={signer} setCurrentPage={setCurrentPage} />;
                } else {
                    setCurrentPage('home');
                    return null;
                }
            case 'about':
                return <About />;
            case 'contact': // New case for the Contact page
                return <Contact />;
            default:
                return null;
        }
    };

    return (
        <div className="app-container">
            <Navbar signer={signer} setSigner={setSigner} setCurrentPage={setCurrentPage} />
            <div className="content-container">
                {renderPage()}
            </div>
        </div>
    );
};

export default App;