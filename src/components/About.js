import React from 'react';
import '../styles/About.css';

const About = () => {
    return (
        <div className="about-container">
            <h2>About VoteSafe</h2>
            <p>VoteSafe is a confidential DAO voting platform built on the Oasis Network.</p>
            <p>Our system ensures private, verifiable, and coercion-free governance by leveraging the unique privacy features of the Oasis Network's Sapphire ParaTime. This allows participants to cast votes without revealing their choices to the public, preventing malicious actors from influencing voting outcomes. All votes are submitted in a confidential, tamper-proof manner, with final tallies being verifiable on-chain once the voting period concludes.</p>
            <h3>Key Features:</h3>
            <ul>
                <li>Confidential Voting: Your vote is private and secure.</li>
                <li>Verifiable Results: All tally results are transparent and can be verified on the Oasis Explorer.</li>
                <li>Coercion-Free: Private voting prevents external pressure or coercion from influencing your decision.</li>
                <li>Decentralized Governance: The platform is a true DAO, allowing community members to propose and vote on initiatives.</li>
            </ul>
        </div>
    );
};

export default About;