import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './ConfirmEmail.css';


const ConfirmEmail = () => {

    const [email, setEmail] = useState('');
    const [resendLoading, setResendLoading] = useState(false);
    const [resendDisabled, setResendDisabled] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);
    const [message, setMessage] = useState('');
    const [isChecking, setIsChecking] = useState(false);

    const navigate = useNavigate();
    // auth check
    useEffect (() => {
        const pendingEmail = localStorage.getItem('pendingEmail');
        if (pendingEmail) {
            setEmail(pendingEmail);
        } else {
            navigate('/register', {replace: true})
        }

        //See if user is confirmed
        checkAuthStatus();

        const interval = setInterval(() => {
            checkAuthStatus();
        }, 3000);
        return () => clearInterval(interval)
    }, []);
    // resend logic
    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(()=> {
                setResendTimer(resendTimer - 1);
            }, 1000);
            return () => clearTimeout(timer);
        }
        else {
            setResendDisabled(false);
        }
    }, [resendTimer]);
    const checkAuthStatus = async () => {
        setIsChecking(true);
        
        try {
            const { data: {user} } = await supabase.auth.getUser(); 

            if (user?.email_confirmed_at) {
                await createProfileAndRedirect(user); //redirect user to home page
            }
        } catch (err) {
            console.error('Error occured', err)
        } finally {
            setIsChecking(false);
        }
    }
    const createProfileAndRedirect = async (user) => {
        try {
            const { data: existingProfile } = await supabase
                .from('users')
                .select('id')
                .eq('id', user.id)
                .single();
            if (!existingProfile) {
                //create profile
                await supabase
                .from('users')
                .insert({
                    id: user.id,
                    email: user.email,
                });
            }
            // Remove pending email from storage
            localStorage.removeitem('pendingEmail');

            setMessage('Emailed confirmed successfull! Redirecting....')

            setTimeout(() => {
                navigate('/survey', {replace: true})
            }, 1000)
        } catch (err) {
            console.error("Error in creating proifle, ", err)
        }
    };
    const handleResendEmail = async () => {
        if (resendDisabled || !email) return;
        setResendLoading(true);
        setMessage('')

        try {
            const { error } = await supabase.auth.resend({
                type: 'signup',
                email: email,
            });

            if (error) {
                setMessage('Failed to resend email. Please try again.')
            } else {
                setMessage('Confirmation email has been sent! Check your inbox or spam.')
                setResendDisabled(true);
                setResendTimer(60);
            }
            
        } catch (err) {
            setMessage('Failed to resend email', err)
        } finally {
            setResendLoading(false);
        }
    };
  const handleChangeEmail = () => {
    localStorage.removeItem('pendingEmail');
    navigate('/register', {replace: true});
  };

  return (
<div className="confirm-container">
      <div className="confirm-card">
        {/* Email Icon */}
        <div className="email-icon-wrapper">
          <div className="email-icon">
            <div className="email-icon-lid"></div>
            <div className="email-icon-letter"></div>
          </div>
          <div className="pulse-ring"></div>
        </div>

        {/* Main Content */}
        <h1 className="confirm-title">Check Your Email</h1>
        
        <p className="confirm-subtitle">
          We've sent a confirmation link to
        </p>
        
        <p className="confirm-email">{email}</p>

        <div className="confirm-info">
          <p>Click the link in the email to activate your account.</p>
          <p className="confirm-hint">It might take a few minutes to arrive.</p>
        </div>

        {/* Status Indicator */}
        {isChecking && (
          <div className="checking-status">
            <div className="checking-spinner"></div>
            <span>Checking confirmation status...</span>
          </div>
        )}

        {/* Message Display */}
        {message && (
          <div className={`confirm-message ${message.includes('success') || message.includes('confirmed') ? 'success' : ''}`}>
            {message}
          </div>
        )}

        {/* Action Buttons */}
        <div className="confirm-actions">
          <button 
            className="btn-resend"
            onClick={handleResendEmail}
            disabled={resendDisabled || resendLoading}
          >
            {resendLoading ? (
              <span>Sending...</span>
            ) : resendTimer > 0 ? (
              <span>Resend in {resendTimer}s</span>
            ) : (
              <span>Resend Email</span>
            )}
          </button>
        </div>

        {/* Secondary Actions */}
        <div className="confirm-secondary">
          <button 
            className="btn-link"
            onClick={handleChangeEmail}
          >
            Wrong email?
          </button>
          
          <span className="separator">•</span>
          
          <button 
            className="btn-link"
            onClick={() => navigate('/login', {replace: true})}
          >
            Go to Login
          </button>
        </div>

        {/* Help Text */}
        <div className="confirm-help">
          <p>Can't find the email?</p>
          <ul>
            <li>Check your spam or junk folder</li>
            <li>Make sure you entered the correct email</li>
            <li>Wait a few minutes and try resending</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ConfirmEmail