import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import Input from 'shared/Input/Input';
import ButtonPrimary from 'shared/Button/ButtonPrimary';
import { Link } from 'react-router-dom';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from '../core/firebase';
import { post } from 'superagent';
import { API } from 'core/constants';
import Textarea from 'shared/Textarea/Textarea';

const SignupScreen = () => {
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [language, setLanguage] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const validatePassword = () => {
    let isValid = true;

    if (password !== '' && confirmPassword !== '') {
      if (password !== confirmPassword) {
        isValid = false;
        setError('Passwords does not match');
      }
    }

    return isValid;
  };

  const saveFirestoreUser = async (payload: any) => {
    try {
      await post(`${API}/signup`).send({
        displayName,
        bio,
        email,
        location,
        language,
        uid: payload.user.uid,
        photoURL: payload.user.photoURL
      });
    } catch (error) {
      console.log(error);
      setError('Could not create user. Please try again later.');
    }
  };

  const handleRegister = async (event: any) => {
    event.preventDefault();
    setError('');

    if (validatePassword()) {
      try {
        const newUser = await createUserWithEmailAndPassword(auth, email, password);
        await saveFirestoreUser({ ...newUser, displayName, bio, email, location, language });
        await sendEmailVerification(auth.currentUser!);

        window.location.href = '/';
      } catch (error) {
        console.log(error);
        setError('Could not complete registration. Please try again later.');
      }
    }
  };

  return (
    <div>
      <Helmet>
        <title>Sign up || Booking React Template</title>
      </Helmet>
      <div className="container mb-24 lg:mb-32">
        <h2 className="mb-20 pt-10 flex items-center text-3xl leading-[115%] md:text-5xl md:leading-[115%] font-semibold text-neutral-900 dark:text-neutral-100 justify-center">
          Signup
        </h2>
        <div className="max-w-md mx-auto space-y-6 ">
          <form className="grid grid-cols-1 gap-6" action="#" method="post" onSubmit={handleRegister}>
            <label className="block">
              <span className="flex justify-between items-center text-neutral-800 dark:text-neutral-200">Display name</span>
              <Input type="text" className="mt-1" value={displayName} onChange={(e: any) => setDisplayName(e.target.value)} />
            </label>

            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200 required">Email address</span>
              <Input required type="email" placeholder="example@example.com" className={"mt-1 " + (error && !email ? '!border-red-400' : '')} value={email} onChange={(e: any) => setEmail(e.target.value)} />
            </label>

            <label className="block">
              <span className="flex justify-between items-center text-neutral-800 dark:text-neutral-200">Bio</span>
              <Textarea className="mt-1" value={bio} onChange={(e: any) => setBio(e.target.value)} />
            </label>

            <label className="block">
              <span className="flex justify-between items-center text-neutral-800 dark:text-neutral-200">Location</span>
              <Input type="text" className="mt-1" value={location} onChange={(e: any) => setLocation(e.target.value)} />
            </label>

            <label className="block">
              <span className="flex justify-between items-center text-neutral-800 dark:text-neutral-200">Language</span>
              <Input type="text" className="mt-1" value={language} onChange={(e: any) => setLanguage(e.target.value)} />
            </label>

            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200 required">Password</span>
              <Input required type="password" className={"mt-1 " + (error && !password ? '!border-red-400' : '')} value={password} onChange={(e: any) => setPassword(e.target.value)} />
            </label>

            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200 required">Confirm Password</span>
              <Input required type="password" className={"mt-1 " + (error && password !== confirmPassword ? '!border-red-400' : '')} value={confirmPassword} onChange={(e: any) => setConfirmPassword(e.target.value)} />
            </label>

            <ButtonPrimary type="submit">Sign up</ButtonPrimary>
          </form>

          <span className="block text-center text-neutral-700 dark:text-neutral-300">
            Already have an account? {` `}
            <Link to="/login">Sign in</Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default SignupScreen;
