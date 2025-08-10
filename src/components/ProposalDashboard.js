import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../constants/contract';
import ProposalDetails from './ProposalDetails';
import '../styles/ProposalDashboard.css';

const ProposalDashboard = ({ signer, setCurrentPage }) => {
    const [proposals, setProposals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [sort, setSort] = useState('Newest');
    const [selectedProposalId, setSelectedProposalId] = useState(null);

    const fetchProposals = async () => {
        if (!signer) {
            setLoading(false);
            setProposals([]); // Clear proposals if signer is not available
            return;
        }
        setLoading(true);

        try {
            // Use the signer directly to create the contract instance
            // This allows reading both public and confidential data
            const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

            const nextProposalId = await contract.nextProposalId();
            const proposalCount = Number(nextProposalId);

            let proposalList = [];
            for (let i = 0; i < proposalCount; i++) {
                try {
                    const proposal = await contract.getProposal(i);
                    // Process proposal data correctly
                    proposalList.push({
                        ...proposal,
                        id: i,
                        title: proposal.title,
                        description: proposal.description,
                        creator: proposal.creator,
                        votingOptions: proposal.votingOptions,
                        startTime: Number(proposal.startTime),
                        endTime: Number(proposal.endTime),
                        hasVoted: proposal.hasVoted,
                        isTallyDone: proposal.isTallyDone
                    });
                } catch (error) {
                    console.error(`Failed to fetch proposal with ID ${i}:`, error);
                }
            }
            setProposals(proposalList);
        } catch (error) {
            console.error("Failed to fetch proposals:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchProposals();
    }, [signer]);

    const getProposalStatus = (proposal) => {
        const currentTime = Math.floor(Date.now() / 1000);
        if (proposal.isTallyDone) {
            return 'Ended';
        }
        if (currentTime < proposal.startTime) {
            return 'Upcoming';
        }
        if (currentTime >= proposal.startTime && currentTime <= proposal.endTime) {
            return 'Active';
        }
        return 'Ended';
    };

    const filteredProposals = proposals.filter(proposal => {
        if (filter === 'All') return true;
        return getProposalStatus(proposal) === filter;
    });

    const sortedProposals = [...filteredProposals].sort((a, b) => {
        if (sort === 'Newest') {
            return b.id - a.id;
        }
        if (sort === 'Ending Soon') {
            return a.endTime - b.endTime;
        }
        if (sort === 'Title (A-Z)') {
            return a.title.localeCompare(b.title);
        }
        return 0;
    });

    const handleViewDetails = (id) => {
        setSelectedProposalId(id);
    };

    const handleCreateProposal = () => {
        setCurrentPage('create-proposal');
    };

    const handleBack = () => {
        setSelectedProposalId(null);
        fetchProposals();
    };

    if (selectedProposalId !== null) {
        return (
            <div className="proposal-details-view">
                <button onClick={handleBack} className="back-button">Back to Proposals</button>
                <ProposalDetails signer={signer} proposalId={selectedProposalId} />
            </div>
        );
    }

    return (
        <div className="proposal-dashboard">
            <div className="dashboard-header">
                <h2>Proposals</h2>
                <button onClick={handleCreateProposal} className="create-new-button">Create New Proposal</button>
            </div>
            <div className="dashboard-controls">
                <div className="dashboard-filters">
                    <button onClick={() => setFilter('All')} className={filter === 'All' ? 'filter-button active' : 'filter-button'}>All</button>
                    <button onClick={() => setFilter('Active')} className={filter === 'Active' ? 'filter-button active' : 'filter-button'}>Active</button>
                    <button onClick={() => setFilter('Upcoming')} className={filter === 'Upcoming' ? 'filter-button active' : 'filter-button'}>Upcoming</button>
                    <button onClick={() => setFilter('Ended')} className={filter === 'Ended' ? 'filter-button active' : 'filter-button'}>Ended</button>
                </div>
                <div className="dashboard-sorting">
                    <button onClick={() => setSort('Newest')} className={sort === 'Newest' ? 'sorting-button active' : 'sorting-button'}>Newest</button>
                    <button onClick={() => setSort('Ending Soon')} className={sort === 'Ending Soon' ? 'sorting-button active' : 'sorting-button'}>Ending Soon</button>
                    <button onClick={() => setSort('Title (A-Z)')} className={sort === 'Title (A-Z)' ? 'sorting-button active' : 'sorting-button'}>Title (A-Z)</button>
                </div>
            </div>

            {loading ? (
                <p className="loading-message">Loading proposals...</p>
            ) : sortedProposals.length === 0 ? (
                <p className="no-proposals-message">No proposals found for this filter.</p>
            ) : (
                <div className="proposal-list">
                    {sortedProposals.map((proposal) => {
                        const status = getProposalStatus(proposal);
                        return (
                            <div key={proposal.id} className="proposal-item">
                                <div className="proposal-content">
                                    <h3 className="proposal-title">{proposal.title}</h3>
                                    <p className="proposal-description">{proposal.description}</p>
                                    <div className="proposal-meta">
                                        <p className={`proposal-status-label ${status.toLowerCase()}`}>Status: {status}</p>
                                        <p className="proposal-time">Starts: {new Date(Number(proposal.startTime) * 1000).toLocaleString()}</p>
                                        <p className="proposal-time">Ends: {new Date(Number(proposal.endTime) * 1000).toLocaleString()}</p>
                                    </div>
                                    <div className="proposal-actions">
                                        {status === 'Active' && (
                                            <button onClick={() => handleViewDetails(proposal.id)} className="vote-button">Vote Now</button>
                                        )}
                                        {status === 'Ended' && (
                                            <button onClick={() => handleViewDetails(proposal.id)} className="view-results-button">View Results</button>
                                        )}
                                        {status === 'Upcoming' && (
                                            <button disabled className="upcoming-button">Vote Now</button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ProposalDashboard;