'use client';
import { useState, ChangeEvent, FormEvent, ReactNode } from 'react';

import {
  Ripple,
  AuthTabs,
  TechOrbitDisplay,
  BoxReveal,
} from '@/components/ui/modern-animated-sign-in';
import {
  FileCode2,
  PaintBucket,
  FileJson,
  Terminal,
  Monitor,
  Layout,
  Layers,
  PenTool,
  GitBranch,
  Wallet,
  Shield,
  User,
  Activity,
  LogOut,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Lock,
  ChevronRight
} from 'lucide-react';

type FormData = {
  email: string;
  password: string;
};

interface OrbitIcon {
  component: () => ReactNode;
  className: string;
  duration?: number;
  delay?: number;
  radius?: number;
  path?: boolean;
  reverse?: boolean;
}

const iconsArray: OrbitIcon[] = [
  {
    component: () => <FileCode2 size={30} className="text-orange-500" />,
    className: 'size-[30px] border-none bg-transparent',
    duration: 20,
    delay: 20,
    radius: 100,
    path: false,
    reverse: false,
  },
  {
    component: () => <PaintBucket size={30} className="text-blue-500" />,
    className: 'size-[30px] border-none bg-transparent',
    duration: 20,
    delay: 10,
    radius: 100,
    path: false,
    reverse: false,
  },
  {
    component: () => <FileJson size={50} className="text-blue-600" />,
    className: 'size-[50px] border-none bg-transparent',
    radius: 210,
    duration: 20,
    path: false,
    reverse: false,
  },
  {
    component: () => <Terminal size={50} className="text-yellow-500" />,
    className: 'size-[50px] border-none bg-transparent',
    radius: 210,
    duration: 20,
    delay: 20,
    path: false,
    reverse: false,
  },
  {
    component: () => <Monitor size={30} className="text-teal-400" />,
    className: 'size-[30px] border-none bg-transparent',
    duration: 20,
    delay: 20,
    radius: 150,
    path: false,
    reverse: true,
  },
  {
    component: () => <Layout size={30} className="text-gray-800 dark:text-white" />,
    className: 'size-[30px] border-none bg-transparent',
    duration: 20,
    delay: 10,
    radius: 150,
    path: false,
    reverse: true,
  },
  {
    component: () => <Layers size={50} className="text-blue-400" />,
    className: 'size-[50px] border-none bg-transparent',
    radius: 270,
    duration: 20,
    path: false,
    reverse: true,
  },
  {
    component: () => <PenTool size={50} className="text-purple-500" />,
    className: 'size-[50px] border-none bg-transparent',
    radius: 270,
    duration: 20,
    delay: 60,
    path: false,
    reverse: true,
  },
  {
    component: () => <GitBranch size={50} className="text-orange-600" />,
    className: 'size-[50px] border-none bg-transparent',
    radius: 320,
    duration: 20,
    delay: 20,
    path: false,
    reverse: false,
  },
];

export function Demo({ isSecure }: { isSecure: boolean }) {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginFeedback, setLoginFeedback] = useState('');
  const [userId, setUserId] = useState<number>(2);
  const [profileData, setProfileData] = useState('');

  const goToForgotPassword = (
    event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => {
    event.preventDefault();
  };

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement>,
    name: keyof FormData
  ) => {
    const value = event.target.value;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId: userId, isSecure })
      });
      const data = await response.json();
      if (response.ok) {
        setProfileData(JSON.stringify(data.profile, null, 2));
      } else {
        setProfileData(`Error: ${data.error}`);
      }
    } catch (e) {
      setProfileData('Network Error');
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoginError('');
    setLoginFeedback('');
    setProfileData('');
    
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, isSecure })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setIsLoggedIn(true);
        setLoginFeedback(data.message);
        if (data.userId) setUserId(data.userId);
      } else {
        if (response.status === 429 || response.status === 403 || response.status === 500) {
          setLoginError(data.error); 
        } else {
          setLoginError(data.error || 'Invalid email or password');
        }
      }
    } catch (error) {
      setLoginError('An error occurred during login.');
    }
  };

  const formFields = {
    header: 'Login Page',
    subHeader: 'Welcome back',
    errorField: loginError,
    fields: [
      {
        label: 'Email',
        required: true,
        type: 'text' as any,
        placeholder: 'Enter your email address',
        onChange: (event: ChangeEvent<HTMLInputElement>) =>
          handleInputChange(event, 'email'),
      },
      {
        label: 'Password',
        required: true,
        type: 'password' as any,
        placeholder: 'Enter your password',
        onChange: (event: ChangeEvent<HTMLInputElement>) =>
          handleInputChange(event, 'password'),
      },
    ],
    submitButton: 'Sign in',
  };

  if (isLoggedIn) {
    let parsedProfile: any = null;
    if (profileData) {
      try {
        parsedProfile = JSON.parse(profileData);
      } catch(e) {}
    }

    return (
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900 via-black to-black w-full text-white font-sans flex flex-col absolute top-0 left-0 z-50">
        {/* Top Navbar */}
        <nav className="border-b border-white/10 p-4 flex justify-between items-center backdrop-blur-md bg-black/40 sticky top-0 z-10 px-8">
           <div className="flex items-center gap-2">
             <div className="bg-blue-600 p-2 rounded-lg"><Layers size={20} className="text-white" /></div>
             <div className="font-bold text-2xl tracking-tighter">Enterprise<span className="text-blue-500 font-light">App</span></div>
           </div>
           
           <div className="flex items-center gap-6">
               <div className="hidden md:flex items-center gap-2 text-sm text-neutral-400 bg-neutral-900/50 px-4 py-1.5 rounded-full border border-white/5">
                 <Shield size={14} className={parsedProfile?.isAdmin ? "text-green-500" : "text-yellow-500"} />
                 {parsedProfile?.isAdmin ? "Admin Access" : "Standard Access"}
               </div>
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-sm font-bold border border-white/20">
                   {formData.email.charAt(0).toUpperCase()}
                 </div>
                 <button 
                   onClick={() => { setIsLoggedIn(false); setProfileData(''); }} 
                   className="text-sm flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
                 >
                   <LogOut size={16} />
                 </button>
               </div>
           </div>
        </nav>

        {/* Main Content Area */}
        <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full mt-4 flex flex-col gap-8">
           <div className="flex justify-between items-end">
             <div>
               <h1 className="text-4xl font-semibold tracking-tight mb-2">Dashboard Overview</h1>
               <div dangerouslySetInnerHTML={{ __html: loginFeedback }} className="text-neutral-400 text-sm" />
             </div>
             <button 
                onClick={fetchProfile} 
                className="group flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-lg text-sm transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] font-medium border border-blue-400/20"
              >
                <RefreshCw size={16} className="group-hover:rotate-180 transition-transform duration-500" />
                Fetch Live Data
              </button>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {/* Left Column: Quick Stats */}
             <div className="col-span-1 flex flex-col gap-6">
                
                {/* Balance Card */}
                <div className="bg-neutral-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-blue-500/30 transition-colors">
                   <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                     <Wallet size={80} />
                   </div>
                   <div className="flex items-center gap-2 mb-4">
                     <Wallet size={18} className="text-blue-400" />
                     <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Account Balance</h3>
                   </div>
                   <p className="text-5xl font-light tracking-tighter text-white">
                     ${parsedProfile?.balance !== undefined ? parsedProfile.balance.toFixed(2) : '---'}
                   </p>
                   {parsedProfile?.balance > 50 && (
                     <p className="text-xs text-green-400 mt-2 flex items-center gap-1"><CheckCircle size={12}/> Balance increased!</p>
                   )}
                </div>

                {/* Premium Status Card */}
                <div className="bg-neutral-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-purple-500/30 transition-colors">
                   <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                     <Shield size={80} />
                   </div>
                   <div className="flex items-center gap-2 mb-4">
                     <Shield size={18} className="text-purple-400" />
                     <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Premium Status</h3>
                   </div>
                   {parsedProfile?.premiumStatus ? (
                     <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full text-sm font-medium">
                       <CheckCircle size={14} /> Active
                     </div>
                   ) : (
                     <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-full text-sm font-medium">
                       <AlertTriangle size={14} /> Inactive
                     </div>
                   )}
                </div>
             </div>

             {/* Right Column: Profile Panel */}
             <div className="col-span-1 md:col-span-2">
                <div className="bg-neutral-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-2xl h-full flex flex-col">
                    <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-6">
                        <div className="bg-white/10 p-2 rounded-lg"><User size={20} className="text-white" /></div>
                        <div>
                          <h2 className="text-xl font-semibold tracking-tight">Security & Profile Details</h2>
                          <p className="text-sm text-neutral-500 mt-1">Manage your identity and bio information</p>
                        </div>
                    </div>

                    {!profileData ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-neutral-500 py-12">
                           <Activity size={48} className="mb-4 opacity-20" />
                           <p className="text-lg font-medium text-neutral-400">Data completely isolated.</p>
                           <p className="text-sm mt-2">Click "Fetch Live Data" to securely retrieve your profile.</p>
                        </div>
                    ) : (
                        <div className="w-full text-left flex-1 flex flex-col">
                            
                            {/* Profile Header */}
                            <div className="flex items-center gap-5 mb-8">
                               <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-2xl font-bold border border-white/20 shadow-[0_0_15px_rgba(37,99,235,0.3)]">
                                 {parsedProfile?.email?.charAt(0).toUpperCase() || '?'}
                               </div>
                               <div>
                                 <h3 className="text-2xl font-bold tracking-tight text-white">{parsedProfile?.email || 'Unknown User'}</h3>
                                 <p className="text-sm text-neutral-400 font-medium">System ID: <span className="text-blue-400">#{parsedProfile?.id || '---'}</span></p>
                               </div>
                            </div>

                            {/* Info Grid */}
                            <div className="grid grid-cols-2 gap-4 mb-8">
                               <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl hover:bg-white/[0.04] transition-colors">
                                  <p className="text-[10px] text-neutral-500 uppercase font-bold tracking-widest mb-1">Account Role</p>
                                  <p className="text-sm font-medium text-neutral-200">
                                    {parsedProfile?.isAdmin ? (
                                      <span className="text-green-400 flex items-center gap-1"><Shield size={14}/> Administrator</span>
                                    ) : (
                                      <span className="text-neutral-300 flex items-center gap-1"><User size={14}/> Standard User</span>
                                    )}
                                  </p>
                               </div>
                               <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl hover:bg-white/[0.04] transition-colors">
                                  <p className="text-[10px] text-neutral-500 uppercase font-bold tracking-widest mb-1">Account Status</p>
                                  <p className="text-sm font-medium text-green-400 flex items-center gap-1"><CheckCircle size={14}/> Active & Verified</p>
                               </div>
                            </div>

                            {/* Bio / Secret Data (Vulnerable to XSS) */}
                            <div className="space-y-3 flex-1">
                                <div className="flex items-center gap-2">
                                  <Lock size={14} className="text-neutral-500" />
                                  <p className="text-xs text-neutral-500 uppercase tracking-widest font-bold">About Me (Bio)</p>
                                </div>
                                <div className="bg-[#0D0D0D] border border-white/10 p-6 rounded-xl text-sm text-neutral-300 min-h-[120px] leading-relaxed relative shadow-inner">
                                   <div dangerouslySetInnerHTML={{ __html: parsedProfile?.secretData || '' }} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
             </div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <section className='flex max-lg:justify-center relative'>
      {/* Left Side */}
      <span className='flex flex-col justify-center w-1/2 max-lg:hidden'>
        <Ripple mainCircleSize={100} />
        <TechOrbitDisplay iconsArray={iconsArray} text="Ali Abbas" />
      </span>

      {/* Right Side */}
      <span className='w-1/2 h-[100dvh] flex flex-col justify-center items-center max-lg:w-full max-lg:px-[10%]'>
        <AuthTabs
          formFields={formFields}
          goTo={goToForgotPassword}
          handleSubmit={handleSubmit}
        />
      </span>
    </section>
  );
}
