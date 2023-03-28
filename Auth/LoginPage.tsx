import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import Input from 'shared/Input/Input';
import { Link } from 'react-router-dom';
import ButtonPrimary from 'shared/Button/ButtonPrimary';

import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../core/firebase';
import { get } from 'superagent';
import { API } from '../core/constants';

const LoginPage  = ({ className = '' }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (event: any) => {
    event.preventDefault();

    setError('');
    setLoading(true);
    try {
      const credentials = await signInWithEmailAndPassword(auth, email, password);
      console.log(credentials);

      const loggedInUser = await get(`${API}/me`).set('uid', credentials.user.uid);

      if (loggedInUser.body) {
        localStorage.setItem('user', JSON.stringify(loggedInUser.body));
      }

      window.location.href = '/';
    } catch (error) {
      console.log(error);
      setError('Could not log user in. Please try again later.')
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`nc-PageLogin ${className}`} data-nc-id="PageLogin">
      <Helmet>
        <title>Login</title>
      </Helmet>
      <div className="container pb-24 lg:pb-32">
        <h2 className="mb-20 pt-10 flex items-center text-3xl leading-[115%] md:text-5xl md:leading-[115%] font-semibold text-neutral-900 dark:text-neutral-100 justify-center">
          Login
        </h2>
        <div className="max-w-md mx-auto space-y-6">
          <form className="grid grid-cols-1 gap-6" action="#" method="post" onSubmit={handleLogin}>
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200 required">Email address</span>
              <Input type="email" placeholder="example@example.com" className={"mt-1 " + (error && !email ? '!border-red-400' : '')} value={email} onChange={(e: any) => setEmail(e.target.value)} />
            </label>
            <label className="block">
              <span className="flex justify-between items-center text-neutral-800 dark:text-neutral-200">
                <span className="required">Password</span>
                <Link to="/forgot-pass" className="text-sm">
                  Forgot password?
                </Link>
              </span>
              <Input type="password" className={"mt-1 " + (error && !password ? '!border-red-400' : '')} value={password} onChange={(e: any) => setPassword(e.target.value)} />
            </label>
            <ButtonPrimary loading={loading} type="submit">
              Log in
            </ButtonPrimary>
          </form>

          {/* ==== */}
          <span className="block text-center text-neutral-700 dark:text-neutral-300">
            New user? {` `}
            <Link to="/signup">Create an account</Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
