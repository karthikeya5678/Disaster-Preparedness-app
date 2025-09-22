import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Auth.module.css'; // Use the new shared stylesheet
import { useAuth } from '../lib/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // This effect correctly waits for the user profile to load before navigating.
  useEffect(() => {
    if (currentUser) {
      navigate('/'); // Navigates to the root, which then triggers the HomeRedirect.
    }
  }, [currentUser, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // The useEffect hook above will handle navigation once currentUser is set.
    } catch (err: any) {
      setError('Failed to log in. Please check your credentials.');
      console.error(err);
    } finally {
        setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    setError('');
    setMessage('');
    if (!email) {
      setError('Please enter your email address to reset your password.');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset link sent! Please check your email inbox and spam folder.');
    } catch (err: any) {
      setError('Failed to send reset email. Please try again.');
    }
  };

  return (
    <div className={styles.container}>
      {/* --- Left Branding Panel --- */}
      <div className={styles.panel}>
        <div>
          <h1 className={styles.panelHeader}>DisasterReady</h1>
        </div>
        <img 
          src="https://img.freepik.com/free-vector/people-volunteering-donating-food-items_53876-66151.jpg?w=826" 
          alt="Community helping each other" 
          className={styles.panelIllustration} 
        />
        <div className={styles.panelQuote}>
          <p>"The best way to predict the future is to create it."</p>
          <footer>- Peter Parker</footer>
        </div>
      </div>

      {/* --- Right Form Panel --- */}
      <div className={styles.formContainer}>
        <div className={styles.card}>
          <h2 className={styles.title}>Welcome Back!</h2>
          <form onSubmit={handleLogin} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>Email Address</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.label}>Password</label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
              />
            </div>
            
            <div className={styles.forgotPasswordContainer}>
              <button type="button" onClick={handlePasswordReset} className={styles.forgotPasswordLink}>
                Forgot Password?
              </button>
            </div>

            {error && <p className={styles.error}>{error}</p>}
            {message && <p className={styles.messageSuccess}>{message}</p>}

            <div>
              <button type="submit" className={styles.button} disabled={loading}>
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </div>
          </form>
          <p className={styles.linkText}>
            Don't have an account?{' '}
            <Link to="/signup" className={styles.link}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;