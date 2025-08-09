import React, { useState } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../constants/contract';
import '../styles/CreateProposal.css';

const CreateProposal = ({ signer, setCurrentPage }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [options, setOptions] = useState(['Yes', 'No', 'Abstain']);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const handleAddOption = () => {
        setOptions([...options, '']);
    };

    const handleRemoveOption = (index) => {
        if (options.length > 2) {
            const newOptions = options.filter((_, i) => i !== index);
            setOptions(newOptions);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!signer) {
                alert('Please connect your wallet first.');
                return;
            }
            
            const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
            
            const startTimestamp = Math.floor(new Date(startTime).getTime() / 1000);
            const endTimestamp = Math.floor(new Date(endTime).getTime() / 1000);
            
            if (endTimestamp <= startTimestamp) {
                alert('End time must be after start time.');
                return;
            }

            const tx = await contract.createProposal(title, description, options, startTimestamp, endTimestamp);
            
            await tx.wait();
            
            alert('Proposal submitted successfully!');
            
            setTitle('');
            setDescription('');
            setOptions(['Yes', 'No', 'Abstain']);
            setStartTime('');
            setEndTime('');

            setCurrentPage('proposals');
        } catch (error) {
            console.error('Submission failed:', error);
            alert('Submission failed. Check console for details.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="create-proposal-form">
            <h3>Create New Proposal</h3>
            <input 
                type="text" 
                placeholder="Proposal Title" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                required 
            />
            <textarea 
                placeholder="Description" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                required 
            />
            
            <div className="form-section">
                <label>Voting Options:</label>
                {options.map((option, index) => (
                    <div key={index} className="option-input-group">
                        <input 
                            type="text" 
                            placeholder={`Option ${index + 1}`}
                            value={option} 
                            onChange={(e) => handleOptionChange(index, e.target.value)} 
                            required 
                        />
                        {options.length > 2 && (
                            <button type="button" onClick={() => handleRemoveOption(index)} className="remove-option-button">
                                Remove
                            </button>
                        )}
                    </div>
                ))}
                <button type="button" onClick={handleAddOption} className="add-option-button">Add Option</button>
            </div>

            <div className="form-section">
                <label>Start Time:</label>
                <input 
                    type="datetime-local" 
                    value={startTime} 
                    onChange={(e) => setStartTime(e.target.value)} 
                    required 
                />
            </div>
            
            <div className="form-section">
                <label>End Time:</label>
                <input 
                    type="datetime-local" 
                    value={endTime} 
                    onChange={(e) => setEndTime(e.target.value)} 
                    required 
                />
            </div>

            <button type="submit" className="submit-button">Submit Proposal</button>
        </form>
    );
};

export default CreateProposal;