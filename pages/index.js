import Head from 'next/head'
import PrimaryStatComponent from './components/PrimaryStatComponent'
import TabComponent from './components/TabComponent'
import PWAInstallPrompt from './components/PWAInstallPrompt'
import { useState, useEffect } from 'react'
import { firebaseService } from '../lib/firebaseService'
import { AuthProvider, useAuth } from '../contexts/AuthContext'
import { logoutUser } from '../lib/authService'
import AuthModal from './components/AuthModal'
import { useToast } from '../contexts/ToastContext'


function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [utangs, setUtangs] = useState([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { currentUser: authUser } = useAuth();
  const { showToast } = useToast();

  // Set current user based on auth state - use display name as login name
  useEffect(() => {
    if (authUser) {
      setCurrentUser(authUser.displayName || authUser.email.split('@')[0]);
    } else {
      setCurrentUser(null);
      setShowAuthModal(true);
    }
  }, [authUser]);

  // Load utangs from Firebase Realtime Database (global)
  useEffect(() => {
    const unsubscribe = firebaseService.subscribeToUtangs(
      (data) => {
        setUtangs(data);
      },
      (error) => {
        console.error('Failed to load utangs:', error);
        showToast('Failed to load utangs', 'error');
      }
    );

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [showToast]);

  const handleLogout = async () => {
    const result = await logoutUser();
    if (result.success) {
      showToast('Logged out successfully', 'success');
    } else {
      showToast(result.error, 'error');
    }
  };

  // Calculate utangNaMo (sum of amounts where currentUser is the debtor)
  const utangNaMo = utangs && utangs
    .filter(utang => utang.name === currentUser)
    .reduce((sum, utang) => sum + utang.details.amount, 0);

  // Calculate personalLuwal (sum of amounts where currentUser is the recipient and not paid)
  const personalLuwal = utangs && utangs
    .filter(utang => utang.details.to === currentUser && !utang.details.paid)
    .reduce((sum, utang) => sum + utang.details.amount, 0);

  if (!authUser) {
    return (
      <>
        <Head>
          <title>Bardaguloan App</title>
          <meta name="description" content="Track utangs and payments" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className="w-full min-h-screen flex flex-col items-center justify-center p-4 bg-base-200">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">Bar<span className='text-purple-400 font-black italic text-5xl'>dagul</span>oan</h1>
            <p className="text-lg opacity-70">utang with ease 💅🏼</p>
          </div>
          <AuthModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
          />
          <p className="text-sm tracking-wide font-thin mt-10 opacity-50">powered by RTSSC ✨</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Bardaguloan App</title>
        <meta name="description" content="Track utangs and payments" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="w-full min-h-screen flex flex-col items-center justify-start p-2 gap-2 bg-base-200">
        <div className="navbar bg-base-100 w-full max-w-md rounded-box shadow mb-2">
          <div className="flex-1">
            <a className="btn btn-ghost normal-case text-xl">Bardaguloan</a>
          </div>
          <div className="flex-none gap-2">
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  {currentUser ? (
                    <img 
                      src={`/${currentUser.toLowerCase()}.png`} 
                      alt={currentUser}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    className="bg-primary text-white flex items-center justify-center h-full w-full" 
                    style={{display: currentUser ? 'none' : 'flex'}}
                  >
                    {currentUser?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                </div>
              </label>
              <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                <li>
                  <span className="font-bold">{currentUser}</span>
                </li>
                <li><button onClick={handleLogout}>Logout</button></li>
              </ul>
            </div>
          </div>
        </div>

        <PrimaryStatComponent utangNaMo={utangNaMo} personalLuwal={personalLuwal} />
        <TabComponent
          currentUser={currentUser}
          utangs={utangs}
          setUtangs={setUtangs}
        />
        <PWAInstallPrompt />
      </main>
    </>
  )
}

export default function Home() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}
