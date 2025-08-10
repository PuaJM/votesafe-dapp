import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../constants/contract';
import '../styles/ProposalDetails.css';

const ProposalDetails = ({ signer, proposalId }) => {
    const [proposal, setProposal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [results, setResults] = useState([]);
    const [totalVotes, setTotalVotes] = useState(0);

    const getProposalState = async () => {
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
            const fetchedProposal = await contract.getProposal(proposalId);
            setProposal(fetchedProposal);

            if (fetchedProposal.isTallyDone) {
                const fetchedResults = await contract.getResults(proposalId);
                const resultsArray = fetchedResults.map(count => Number(count));
                const sumOfVotes = resultsArray.reduce((sum, count) => sum + count, 0);
                setResults(resultsArray);
                setTotalVotes(sumOfVotes);
            }
        } catch (error) {
            console.error("Failed to fetch proposal details:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (signer && proposalId !== undefined) {
            getProposalState();
        }
    }, [signer, proposalId]);

    const handleVote = async (voteChoice) => {
        try {
            const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
            const tx = await contract.castVote(proposalId, voteChoice);
            await tx.wait();
            alert("Vote cast successfully!");
            getProposalState();
        } catch (error) {
            console.error("Voting failed:", error);
            alert("Voting failed. Check console.");
        }
    };

    const handleTally = async () => {
        try {
            const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
            const tx = await contract.tallyVotes(proposalId);
            await tx.wait();
            alert("Tally completed!");
            getProposalState();
        } catch (error) {
            console.error("Tally failed:", error);
            alert("Tally failed. Check console.");
        }
    };

    if (loading) {
        return <div>Loading proposal details...</div>;
    }

    if (!proposal) {
        return <div>Proposal not found.</div>;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    const votingPeriodEnded = currentTime > Number(proposal.endTime);
    const canTally = votingPeriodEnded && !proposal.isTallyDone;
    const canVote = currentTime >= Number(proposal.startTime) && currentTime <= Number(proposal.endTime);
    const hasVoted = proposal.hasVoted;

    const formatPercentage = (count) => {
        if (totalVotes === 0) return '0%';
        const percentage = (count / totalVotes) * 100;
        return `${percentage.toFixed(0)}%`;
    };

    const getExplorerUrl = (txHash) => {
        return `https://testnet.explorer.sapphire.oasis.dev/tx/${txHash}`;
    };

    return (
        <div className="proposal-details-container">
            <div className="proposal-header">
                <div className="proposal-info">
                    <h3>{proposal.title}</h3>
                    <p>{proposal.description}</p>
                    <p>Voting starts: {new Date(Number(proposal.startTime) * 1000).toLocaleString()}</p>
                    <p>Voting ends: {new Date(Number(proposal.endTime) * 1000).toLocaleString()}</p>
                </div>
            </div>

            {canVote && !hasVoted && (
                <div className="voting-section">
                    <p>Vote on this proposal:</p>
                    {proposal.votingOptions.map((option, index) => (
                        <button key={index} onClick={() => handleVote(index)}>{option}</button>
                    ))}
                </div>
            )}
            
            {hasVoted && canVote && (
                <div className="voting-section">
                    <p>You have already voted on this proposal.</p>
                </div>
            )}

            {proposal.isTallyDone && (
                <div className="results-container">
                    <h4>Final Results</h4>
                    <p>Voting Concluded</p>
                    <h5>Vote Distribution</h5>
                    <p>Total: {totalVotes} votes</p>
                    <div className="vote-distribution-chart">
                        {results.map((count, index) => (
                            <div key={index} className="vote-bar-container">
                                <div
                                    className="vote-bar"
                                    style={{
                                        height: `${(count / totalVotes) * 100}px`,
                                        backgroundColor: '#4a90e2'
                                    }}
                                />
                                <p className="vote-option-label">{proposal.votingOptions[index]}</p>
                            </div>
                        ))}
                    </div>

                    <h5>Detailed Breakdown</h5>
                    {results.map((count, index) => (
                        <div key={index} className="breakdown-item">
                            <p>{proposal.votingOptions[index]}</p>
                            <p>{count} votes ({formatPercentage(count)})</p>
                        </div>
                    ))}
                    
                    <h5>Verify On-Chain</h5>
                    <a href={getExplorerUrl(proposal.tallyTxHash)} target="_blank" rel="noopener noreferrer">
                        <button>View Transaction on Oasis Explorer</button>
                    </a>
                </div>
            )}

            {votingPeriodEnded && !proposal.isTallyDone && (
                <p>Voting has ended. Tally is required to view results.</p>
            )}

            {canTally && (
                <button onClick={handleTally}>Tally Votes</button>
            )}
        </div>
    );
};

export default ProposalDetails;