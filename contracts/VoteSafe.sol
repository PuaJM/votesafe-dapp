// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@oasisprotocol/sapphire-contracts/contracts/Sapphire.sol";

contract VoteSafe {
    struct Proposal {
        uint256 id;
        string title;
        string description;
        address creator;
        string[] votingOptions;
        uint256 startTime;
        uint256 endTime;
        mapping(address => bool) hasVoted;
        mapping(address => uint256) voterChoice;
        uint256[] voteCounts;
        bool isTallyDone;
        bytes32 tallyTxHash;
    }

    mapping(uint256 => Proposal) public proposals;
    uint256 public nextProposalId = 0;

    event ProposalCreated(uint256 proposalId, address creator, string title);

    function createProposal(
        string memory _title, 
        string memory _description, 
        string[] memory _options, 
        uint256 _startTime, 
        uint256 _endTime
    ) external {
        require(bytes(_title).length > 0 && bytes(_description).length > 0, "Title and description cannot be empty");
        require(_options.length >= 2, "Must have at least two voting options");
        require(_startTime < _endTime, "End time must be after start time");
        require(_startTime >= block.timestamp, "Start time must be in the future");

        Proposal storage newProposal = proposals[nextProposalId];

        newProposal.id = nextProposalId;
        newProposal.title = _title;
        newProposal.description = _description;
        newProposal.creator = msg.sender;
        newProposal.startTime = _startTime;
        newProposal.endTime = _endTime;
        newProposal.isTallyDone = false;

        for (uint256 i = 0; i < _options.length; i++) {
            newProposal.votingOptions.push(_options[i]);
            newProposal.voteCounts.push(0);
        }

        nextProposalId++;
        emit ProposalCreated(newProposal.id, msg.sender, _title);
    }

    function castVote(uint256 _proposalId, uint256 _voteChoice) external {
        Proposal storage proposal = proposals[_proposalId];
        require(block.timestamp >= proposal.startTime, "Voting period has not started");
        require(block.timestamp <= proposal.endTime, "Voting period has ended");
        require(!proposal.hasVoted[msg.sender], "You have already voted on this proposal");
        require(_voteChoice < proposal.votingOptions.length, "Invalid vote choice");

        proposal.hasVoted[msg.sender] = true;
        proposal.voterChoice[msg.sender] = _voteChoice;
        proposal.voteCounts[_voteChoice]++;
    }

    function tallyVotes(uint256 _proposalId) external {
        Proposal storage proposal = proposals[_proposalId];
        require(!proposal.isTallyDone, "Tally has already been completed");
        require(block.timestamp > proposal.endTime, "Voting period is not over yet");

        proposal.isTallyDone = true;
        proposal.tallyTxHash = blockhash(block.number - 1);
    }
    
    function getResults(uint256 _proposalId) external view returns (uint256[] memory counts) {
        Proposal storage proposal = proposals[_proposalId];
        require(proposal.isTallyDone, "Tally is not yet completed");
        
        return proposal.voteCounts;
    }

    function getProposal(uint256 _proposalId) external view returns (
        uint256 id, 
        string memory title, 
        string memory description, 
        address creator, 
        string[] memory votingOptions, 
        uint256 startTime, 
        uint256 endTime, 
        bool hasVoted, 
        bool isTallyDone
    ) {
        Proposal storage proposal = proposals[_proposalId];
        return (
            proposal.id,
            proposal.title,
            proposal.description,
            proposal.creator,
            proposal.votingOptions,
            proposal.startTime,
            proposal.endTime,
            proposal.hasVoted[msg.sender],
            proposal.isTallyDone
        );
    }
}