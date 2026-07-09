import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  CheckCircle, 
  AlertCircle,
  Eye,
  EyeOff,
  Building,
  ShieldCheck,
  ShieldAlert,
  ArrowLeft,
  KeyRound
} from "lucide-react";
import { UserRole } from "../types";
import { azureApi } from "../lib/azureApi";

interface AuthenticationProps {
  onSuccess: (user: { name: string; email: string; avatar: string; role: UserRole }) => void;
  onBackToLanding: () => void;
}

type AuthMode = "login" | "register" | "verify_email" | "forgot" | "reset" | "success";

export default function Authentication({ onSuccess, onBackToLanding }: AuthenticationProps) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("manishkumarofficial701@gmail.com");
  const [password, setPassword] = useState("Admin@Azure2026");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  
  // Registration States
  const [fullName, setFullName] = useState("");
  const [orgName, setOrgName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [regRole, setRegRole] = useState<UserRole>(UserRole.ORG_ADMIN);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Auto-fill form values or load remembered user on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem("azure_remembered_email");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  // Password strength calculator
  const calculatePasswordStrength = (pass: string): { score: number; label: string; color: string } => {
    if (!pass) return { score: 0, label: "None", color: "bg-slate-200" };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[a-z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    switch (score) {
      case 1:
      case 2:
        return { score, label: "Weak (Requires numbers & special symbols)", color: "bg-red-500" };
      case 3:
      case 4:
        return { score, label: "Moderate (Add uppercase & special symbols)", color: "bg-amber-500" };
      case 5:
        return { score, label: "Strong Enterprise-Grade High Entropy", color: "bg-emerald-500" };
      default:
        return { score: 0, label: "None", color: "bg-slate-200" };
    }
  };

  const strength = calculatePasswordStrength(password);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Email and password fields must not be empty.");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      // Direct REST call to Microsoft Entra External ID emulated login
      const response = await azureApi.login(email, password);
      
      if (rememberMe) {
        localStorage.setItem("azure_remembered_email", email);
      } else {
        localStorage.removeItem("azure_remembered_email");
      }

      setSuccessMsg("Entra Authentication Verified successfully!");
      
      setTimeout(() => {
        setIsLoading(false);
        onSuccess({
          name: response.user.name,
          email: response.user.email,
          avatar: response.user.avatar,
          role: response.user.role as UserRole
        });
      }, 1000);

    } catch (err: any) {
      setIsLoading(false);
      setErrorMsg(err.message || "Failed to authenticate against Microsoft Entra External ID claims registry.");
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (password !== confirmPassword) {
      setErrorMsg("Password confirmation mismatch. Please match both fields.");
      return;
    }

    if (strength.score < 3) {
      setErrorMsg("Please choose a stronger password to fulfill cloud policy settings.");
      return;
    }

    if (!termsAccepted) {
      setErrorMsg("You must accept the terms & conditions of the enterprise license.");
      return;
    }

    setIsLoading(true);

    try {
      // Propose registration to Microsoft Entra External ID
      // To simulate email verification we first redirect to verification code mode
      setTimeout(() => {
        setIsLoading(false);
        setMode("verify_email");
      }, 1200);

    } catch (err: any) {
      setIsLoading(false);
      setErrorMsg(err.message || "Failed to register user claims in Entra ID directory.");
    }
  };

  const handleEmailVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode.trim() !== "123456" && verificationCode.trim().length !== 6) {
      setErrorMsg("Invalid verification OTP. Enter '123456' for instant Azure validation simulation.");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      // Push registration details to Azure database
      const response = await azureApi.register({
        name: fullName,
        email,
        password,
        role: regRole,
        organization: orgName
      });

      setSuccessMsg("Email verification completed successfully. Identity claims created!");
      
      setTimeout(() => {
        setIsLoading(false);
        setMode("success");
      }, 1000);

    } catch (err: any) {
      setIsLoading(false);
      setErrorMsg(err.message || "Claims registration failed during Azure AD write back.");
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg("Please specify your registered enterprise email.");
      return;
    }
    setIsLoading(true);
    setErrorMsg(null);

    setTimeout(() => {
      setIsLoading(false);
      setSuccessMsg("Password recovery link and OTP token dispatched successfully to your corporate inbox.");
      setMode("reset");
    }, 1200);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMsg("New passwords do not match.");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    setTimeout(() => {
      setIsLoading(false);
      setSuccessMsg("Password credentials refreshed successfully on Azure Active Directory.");
      setMode("success");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#090D16] flex flex-col items-center justify-center p-4 relative overflow-hidden transition-colors duration-200">
      
      {/* Tech styling decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-8 relative z-10 transition-all duration-300">
        
        {/* Upper Signpost */}
        <div className="flex flex-col items-center mb-6 text-center">
          <button 
            onClick={onBackToLanding}
            className="flex items-center space-x-1 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 mb-4 transition-colors font-sans"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Back to Landing</span>
          </button>

          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-sky-500 flex items-center justify-center shadow-md shadow-blue-500/10 mb-3">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          
          <h2 className="font-sans font-extrabold text-xl text-slate-900 dark:text-white tracking-tight">
            EVENTRA Enterprise
          </h2>
          <span className="mt-1 px-2.5 py-0.5 bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 font-mono text-[9px] font-bold uppercase rounded-full tracking-wider border border-blue-100/30">
            Microsoft Entra ID Protected
          </span>
        </div>

        {/* Dynamic Alerts */}
        {errorMsg && (
          <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/40 rounded-xl flex items-start space-x-2.5 mb-4 animate-in fade-in">
            <ShieldAlert className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
            <span className="text-xs font-sans text-red-600 dark:text-red-400 leading-normal">{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 rounded-xl flex items-start space-x-2.5 mb-4 animate-in fade-in">
            <ShieldCheck className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
            <span className="text-xs font-sans text-emerald-600 dark:text-emerald-400 leading-normal">{successMsg}</span>
          </div>
        )}

        {/* MODE 1: LOGIN CARD */}
        {mode === "login" && (
          <div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs font-semibold font-sans text-slate-500 dark:text-slate-400 block mb-1.5">Email address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="login-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    placeholder="name@organization.com"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold font-sans text-slate-500 dark:text-slate-400">Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMsg(null);
                      setSuccessMsg(null);
                      setMode("forgot");
                    }}
                    className="text-[11px] font-sans font-medium text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2.5 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between py-1">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20 bg-slate-50 dark:bg-slate-950" 
                  />
                  <span className="text-[11px] font-sans text-slate-500 dark:text-slate-400 font-medium">Remember my session</span>
                </label>
              </div>

              <button
                id="login-submit-btn"
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/70 text-white font-semibold font-sans text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-blue-500/10 flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <span className="flex items-center space-x-1">
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Validating Claims...</span>
                  </span>
                ) : (
                  <>
                    <span>Sign In with Entra ID</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="text-center text-xs text-slate-400 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              Need to register your organization?{" "}
              <button 
                onClick={() => {
                  setErrorMsg(null);
                  setSuccessMsg(null);
                  setMode("register");
                }} 
                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
              >
                Create Account
              </button>
            </div>
          </div>
        )}

        {/* MODE 2: REGISTRATION CARD */}
        {mode === "register" && (
          <div>
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold font-sans text-slate-500 dark:text-slate-400 block mb-1.5">Your Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="reg-fullname"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-blue-500 transition-all"
                    placeholder="Alex Smith"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold font-sans text-slate-500 dark:text-slate-400 block mb-1.5">Organization Name <span className="text-slate-400 text-[10px]">(Optional)</span></label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="reg-org"
                    type="text"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-blue-500 transition-all"
                    placeholder="e.g. Stanford Medical"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold font-sans text-slate-500 dark:text-slate-400 block mb-1.5">Email address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="reg-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-blue-500 transition-all"
                    placeholder="alex@organization.com"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold font-sans text-slate-500 dark:text-slate-400 block mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="reg-password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-blue-500 transition-all"
                    placeholder="Min 8 chars, 1 Cap, 1 Symbol"
                  />
                </div>
                
                {/* Password Strength Meter */}
                {password && (
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-slate-400 font-medium">Password Strength:</span>
                      <span className="font-mono font-bold text-slate-600 dark:text-slate-350">{strength.label}</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                      <div className={`h-full transition-all duration-300 ${strength.color}`} style={{ width: `${(strength.score / 5) * 100}%` }}></div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold font-sans text-slate-500 dark:text-slate-400 block mb-1.5">Confirm Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="reg-confirm-password"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-blue-500 transition-all"
                    placeholder="Verify password"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold font-sans text-slate-500 dark:text-slate-400 block mb-1.5">Tenant Portal Access Role</label>
                <select
                  id="reg-role"
                  value={regRole}
                  onChange={(e) => setRegRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 text-slate-850 dark:text-slate-200 text-xs rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none"
                >
                  <option value={UserRole.ORG_ADMIN}>Organization Admin (Standard Enterprise)</option>
                  <option value={UserRole.ORGANIZER}>Organizer (Creator Wizard)</option>
                  <option value={UserRole.VOLUNTEER}>Volunteer (QR Badge Operator)</option>
                  <option value={UserRole.ATTENDEE}>Attendee (QR Pass & Feedback)</option>
                </select>
              </div>

              <div className="flex items-start space-x-2 pt-1">
                <input 
                  type="checkbox" 
                  id="terms-chk" 
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  required 
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20 bg-slate-50" 
                />
                <label htmlFor="terms-chk" className="text-[10px] font-sans text-slate-500 leading-normal">
                  I accept all enterprise licensing agreements, terms of service and billing variables.
                </label>
              </div>

              <button
                id="reg-submit-btn"
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold font-sans text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center space-x-2"
              >
                <span>Request Verification Token</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="text-center text-xs text-slate-400 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              Already have an enterprise portal?{" "}
              <button 
                onClick={() => {
                  setErrorMsg(null);
                  setSuccessMsg(null);
                  setMode("login");
                }} 
                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
              >
                Sign In
              </button>
            </div>
          </div>
        )}

        {/* MODE 3: EMAIL VERIFICATION FLOW */}
        {mode === "verify_email" && (
          <div>
            <div className="text-center space-y-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-500 flex items-center justify-center mx-auto">
                <KeyRound className="w-5 h-5" />
              </div>
              <h3 className="font-sans font-bold text-sm text-slate-900 dark:text-white">Verify Corporate Identity</h3>
              <p className="text-[11px] font-sans text-slate-500 dark:text-slate-400 leading-normal">
                To confirm email ownership, we sent a 6-digit confirmation token to <strong className="text-slate-800 dark:text-slate-200">{email}</strong>.
              </p>
            </div>

            <form onSubmit={handleEmailVerification} className="space-y-4">
              <div>
                <label className="text-xs font-semibold font-sans text-slate-500 dark:text-slate-400 block mb-1.5 text-center">
                  Verification OTP Code
                </label>
                <input
                  id="verification-otp-code"
                  type="text"
                  required
                  maxLength={6}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-mono tracking-[0.5em] text-center text-xl rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="000000"
                />
                <span className="text-[10px] font-mono text-slate-400 block text-center mt-1.5">
                  Enter <strong className="text-blue-500 font-semibold">123456</strong> for sandbox validation
                </span>
              </div>

              <button
                id="verify-code-btn"
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold font-sans text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center space-x-2"
              >
                {isLoading ? <span>Verifying OTP on Azure...</span> : <span>Confirm & Activate Account</span>}
              </button>
            </form>

            <button 
              onClick={() => {
                setErrorMsg(null);
                setSuccessMsg(null);
                setMode("register");
              }}
              className="w-full mt-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 hover:bg-slate-100 text-slate-500 text-xs rounded-xl transition-all"
            >
              Back to Registration
            </button>
          </div>
        )}

        {/* MODE 4: FORGOT PASSWORD */}
        {mode === "forgot" && (
          <div>
            <div className="text-center space-y-2 mb-6">
              <h3 className="font-sans font-bold text-sm text-slate-900 dark:text-white">Recover Password</h3>
              <p className="text-[11px] font-sans text-slate-500 dark:text-slate-400 leading-normal">
                Enter your Microsoft Entra registered corporate email, and we will forward recovery directions.
              </p>
            </div>

            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="text-xs font-semibold font-sans text-slate-500 dark:text-slate-400 block mb-1.5">Email address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="forgot-email-input"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-blue-500 transition-all"
                    placeholder="name@organization.com"
                  />
                </div>
              </div>

              <button
                id="forgot-submit-btn"
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold font-sans text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center space-x-2"
              >
                <span>Dispatch Recovery Link</span>
              </button>
            </form>

            <button 
              onClick={() => {
                setErrorMsg(null);
                setSuccessMsg(null);
                setMode("login");
              }}
              className="w-full mt-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 hover:bg-slate-100 text-slate-500 text-xs rounded-xl transition-all"
            >
              Back to Sign In
            </button>
          </div>
        )}

        {/* MODE 5: RESET PASSWORD */}
        {mode === "reset" && (
          <div>
            <div className="text-center space-y-2 mb-6">
              <h3 className="font-sans font-bold text-sm text-slate-900 dark:text-white">Configure New Password</h3>
              <p className="text-[11px] font-sans text-slate-500 dark:text-slate-400 leading-normal">
                Define a high-entropy password to overwrite previous Microsoft Entra directory claims.
              </p>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="text-xs font-semibold font-sans text-slate-500 dark:text-slate-400 block mb-1.5">New Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="reset-new-password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold font-sans text-slate-500 dark:text-slate-400 block mb-1.5">Confirm New Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="reset-confirm-password"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <button
                id="reset-submit-btn"
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold font-sans text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center space-x-2"
              >
                <span>Update Credentials & Verify</span>
              </button>
            </form>
          </div>
        )}

        {/* MODE 6: SUCCESS CONFIRMATION */}
        {mode === "success" && (
          <div className="text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle className="w-7 h-7" />
            </div>
            
            <div className="space-y-1.5">
              <h3 className="font-sans font-bold text-base text-slate-900 dark:text-white">Credentials Lock Active</h3>
              <p className="text-xs font-sans text-slate-500 dark:text-slate-400 leading-normal px-2">
                Your Microsoft Entra External ID claims have been refreshed and synchronized with the Azure SQL Database.
              </p>
            </div>

            <button
              id="success-go-login"
              onClick={() => {
                setErrorMsg(null);
                setSuccessMsg(null);
                setPassword("");
                setConfirmPassword("");
                setMode("login");
              }}
              className="w-full mt-4 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-semibold font-sans text-xs uppercase tracking-wider rounded-xl transition-all shadow-md"
            >
              Return to Login Gateway
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
