import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { SAPPHIRE_TESTNET_CHAIN_ID, SAPPHIRE_NETWORK_DETAILS } from '../constants/contract';
import '../styles/WalletConnection.css';

const WalletConnection = ({ signer, setSigner }) => {
    const [loading, setLoading] = useState(false);
    const [address, setAddress] = useState(null);

    useEffect(() => {
        const updateAddress = async () => {
            if (signer) {
                const connectedAddress = await signer.getAddress();
                setAddress(connectedAddress);
            } else {
                setAddress(null);
            }
        };
        updateAddress();
    }, [signer]);

    const connectWallet = async () => {
        if (!window.ethereum) {
            alert("Please install MetaMask!");
            return;
        }

        setLoading(true);
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();

            const network = await provider.getNetwork();
            const chainId = '0x' + network.chainId.toString(16);

            if (chainId.toLowerCase() !== SAPPHIRE_TESTNET_CHAIN_ID.toLowerCase()) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: SAPPHIRE_TESTNET_CHAIN_ID }],
                    });
                } catch (switchError) {
                    if (switchError.code === 4902) {
                        try {
                            await window.ethereum.request({
                                method: 'wallet_addEthereumChain',
                                params: [SAPPHIRE_NETWORK_DETAILS],
                            });
                        } catch (addError) {
                            console.error(addError);
                            alert("Failed to add the Sapphire Testnet to MetaMask. Please add it manually.");
                        }
                    } else {
                        console.error(switchError);
                        alert("Failed to switch to the Sapphire Testnet. Please switch manually.");
                    }
                }
            }
            const newProvider = new ethers.BrowserProvider(window.ethereum);
            const newSigner = await newProvider.getSigner();
            setSigner(newSigner);

        } catch (error) {
            console.error("Connection failed:", error);
            alert("Failed to connect wallet. Check console.");
        } finally {
            setLoading(false);
        }
    };

    const disconnectWallet = () => {
        setSigner(null);
        setAddress(null);
        alert("Wallet disconnected.");
    };

    const formatAddress = (addr) => {
        if (!addr) return '';
        return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
    };

    return (
        <div className="wallet-connection-container">
            {address ? (
                <>
                    <button onClick={disconnectWallet} className="disconnect-button">
                        Disconnect
                    </button>
                    <span className="wallet-address">{formatAddress(address)}</span>
                </>
            ) : (
                <button onClick={connectWallet} disabled={loading} className="connect-button">
                    {loading ? 'Connecting...' : 'Connect Wallet'}
                </button>
            )}
        </div>
    );
};

export default WalletConnection;