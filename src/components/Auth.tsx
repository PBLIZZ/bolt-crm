import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Heart, Mail, Lock, User, Building } from 'lucide-react';

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password);
        if (error) throw error;

        // Additional profile setup would happen here
        alert('Check your email for the confirmation link!');
      } else {
        const { error } = await signIn(email, password);
        if (error) throw error;
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center p-4'>
      <div className='max-w-md w-full'>
        {/* Logo and Header */}
        <div className='text-center mb-8'>
          <div className='inline-flex items-center justify-center w-16 h-16 bg-teal-600 rounded-full mb-4'>
            <Heart size={32} className='text-white' />
          </div>
          <h1 className='text-3xl font-bold text-gray-900'>WellnessCRM</h1>
          <p className='text-gray-600 mt-2'>
            {isSignUp
              ? 'Create your wellness practice account'
              : 'Sign in to your wellness practice'}
          </p>
        </div>

        {/* Auth Form */}
        <div className='bg-white rounded-xl shadow-lg p-8'>
          <form onSubmit={handleSubmit} className='space-y-6'>
            {isSignUp && (
              <>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      First Name
                    </label>
                    <div className='relative'>
                      <User size={20} className='absolute left-3 top-3 text-gray-400' />
                      <input
                        type='text'
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className='w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
                        placeholder='John'
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Last Name
                    </label>
                    <div className='relative'>
                      <User size={20} className='absolute left-3 top-3 text-gray-400' />
                      <input
                        type='text'
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className='w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
                        placeholder='Doe'
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Business Name
                  </label>
                  <div className='relative'>
                    <Building size={20} className='absolute left-3 top-3 text-gray-400' />
                    <input
                      type='text'
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className='w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
                      placeholder='Wellness Studio'
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Email Address</label>
              <div className='relative'>
                <Mail size={20} className='absolute left-3 top-3 text-gray-400' />
                <input
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
                  placeholder='you@example.com'
                  required
                />
              </div>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Password</label>
              <div className='relative'>
                <Lock size={20} className='absolute left-3 top-3 text-gray-400' />
                <input
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
                  placeholder='••••••••'
                  required
                  minLength={6}
                />
              </div>
            </div>

            {error && (
              <div className='p-3 bg-red-50 border border-red-200 rounded-lg'>
                <p className='text-sm text-red-600'>{error}</p>
              </div>
            )}

            <button
              type='submit'
              disabled={loading}
              className='w-full bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {loading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <div className='mt-6 text-center'>
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className='text-teal-600 hover:text-teal-700 text-sm font-medium'
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>

        {/* Features */}
        <div className='mt-8 text-center'>
          <p className='text-sm text-gray-600 mb-4'>Trusted by wellness professionals</p>
          <div className='flex justify-center space-x-6 text-xs text-gray-500'>
            <span>✓ Client Management</span>
            <span>✓ Appointment Scheduling</span>
            <span>✓ Session Tracking</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
