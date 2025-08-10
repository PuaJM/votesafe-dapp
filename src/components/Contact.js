import React from 'react';
import '../styles/Contact.css';

const Contact = () => {
    return (
        <div className="contact-container">
            <h2>Contact Us</h2>
            <p className="contact-intro">
                We're here to help! For any questions, feedback, or support related to our confidential voting platform, please reach out to us.
            </p>
            <div className="contact-details">
                <h3>General Inquiries</h3>
                <p>
                    For general questions about VoteSafe, its features, or the Oasis Network, you can contact our support team.
                </p>
                <p>Email: <a href="mailto:s73003@ocean.umt.edu.my">s73003@ocean.umt.edu.my</a></p>
            </div>
            
            <div className="contact-social">
                <h3>Follow Us</h3>
                <p>Stay up to date with our latest news and developments on social media.</p>
                {/* Add social media icons and links here */}
                <div className="social-links">
                    {/* Placeholder for social media links */}
                    <a href="#" className="social-icon">Twitter</a>
                    <a href="#" className="social-icon">LinkedIn</a>
                    <a href="#" className="social-icon">GitHub</a>
                </div>
            </div>
        </div>
    );
};

export default Contact;