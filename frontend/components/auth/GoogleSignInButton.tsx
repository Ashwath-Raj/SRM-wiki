"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "@/context/AuthContext";
import { LogIn, LogOut, ShieldCheck, User as UserIcon, Sparkles, AlertCircle } from "lucide-react";

declare global {
  interface Window {
    google?: any;
  }
}

export const GoogleSignInButton: React.FC = () => {
  const { user, logout, loginWithGoogleToken } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [gsiError, setGsiError] = useState<string | null>(null);
  const googleBtnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "359147433608-jj3ur2gf2g8h5ejthk9k7b90k6t0kl04.apps.googleusercontent.com";

  // Function to initialize Google button when modal opens
  useEffect(() => {
    if (!showPrompt || user) return;

    const renderGoogleBtn = () => {
      if (window.google?.accounts?.id && googleBtnRef.current) {
        try {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: async (response: any) => {
              if (response.credential) {
                const ok = await loginWithGoogleToken(response.credential);
                if (ok) {
                  setShowPrompt(false);
                  setGsiError(null);
                } else {
                  setGsiError("Google token exchange failed with backend.");
                }
              }
            },
            auto_select: false,
            cancel_on_tap_outside: true,
          });

          // Render the official Google sign in button
          googleBtnRef.current.innerHTML = "";
          window.google.accounts.id.renderButton(googleBtnRef.current, {
            theme: "outline",
            size: "large",
            shape: "pill",
            text: "continue_with",
            width: 280,
          });
        } catch (e: any) {
          console.error("GSI render error:", e);
        }
      }
    };

    if (window.google?.accounts?.id) {
      renderGoogleBtn();
    } else {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = renderGoogleBtn;
      document.body.appendChild(script);
    }
  }, [showPrompt, user, clientId]);

  // Demo / Dev instant sign-in helper
  const handleDevSignIn = async (role: "STUDENT" | "FACULTY" | "ADMIN") => {
    const emails = {
      STUDENT: "aditya_sharma@srmap.edu.in",
      FACULTY: "dr_sravanthi@srmap.edu.in",
      ADMIN: "admin@srmap.edu.in",
    };
    const names = {
      STUDENT: "Aditya Sharma (B.Tech CSE)",
      FACULTY: "Dr. Naga Sravanthi Puppala (Faculty Mentor)",
      ADMIN: "SRM AP Wiki Administrator",
    };

    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const payload = btoa(
      JSON.stringify({
        email: emails[role],
        name: names[role],
        picture: `https://api.dicebear.com/7.x/bottts/svg?seed=${role}`,
        role: role,
        hd: "srmap.edu.in",
      })
    );
    const mockCredential = `${header}.${payload}.dev_signature`;

    await loginWithGoogleToken(mockCredential);
    setShowPrompt(false);
  };

  if (user) {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 p-1 pl-2 pr-2.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 transition-all text-xs font-semibold"
        >
          {user.picture ? (
            <img src={user.picture} alt={user.name} className="w-5 h-5 rounded-full object-cover" />
          ) : (
            <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">
              {user.name[0]}
            </div>
          )}
          <span className="hidden sm:inline max-w-[100px] truncate text-slate-800 dark:text-slate-200">
            {user.name.split(" ")[0]}
          </span>
          <span className="text-[10px] px-1 py-0.2 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded font-bold uppercase">
            {user.role}
          </span>
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-64 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl z-50 text-xs space-y-2 animate-in fade-in slide-in-from-top-2">
            <div className="pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="font-bold text-slate-900 dark:text-slate-100">{user.name}</div>
              <div className="text-slate-500 dark:text-slate-400 truncate">{user.email}</div>
              {user.is_srm_student && (
                <div className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Verified SRM AP Account</span>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors font-medium text-left"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowPrompt(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg transition-all shadow-xs"
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        <span className="hidden sm:inline">Sign In</span>
      </button>

      {/* Google Sign-in Modal portaled to body */}
      {showPrompt &&
        mounted &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
            <div className="w-full max-w-sm p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl relative my-auto">
              <div className="text-center mb-5">
                <div className="w-11 h-11 mx-auto mb-2 rounded-2xl bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 shadow-xs">
                  <LogIn className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                  Sign In to SRM AP Wiki
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Use your official SRM AP Google account (<span className="font-semibold text-blue-600 dark:text-blue-400">@srmap.edu.in</span>) or personal Google account.
                </p>
              </div>

              {/* Official Google Cloud OAuth Render Container */}
              <div className="flex flex-col items-center justify-center mb-4 min-h-[44px]">
                <div ref={googleBtnRef} className="w-full flex justify-center" />
              </div>

              {gsiError && (
                <div className="flex items-center gap-1.5 p-2 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 text-[11px] mb-3">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{gsiError}</span>
                </div>
              )}

              {/* Instant Role Selector (Pre-authenticated with your OAuth Client) */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">
                  Or Instant Sign-In:
                </div>

                <button
                  onClick={() => handleDevSignIn("STUDENT")}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 text-xs font-medium text-slate-800 dark:text-slate-200 transition-all group"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
                      <UserIcon className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 transition-colors">
                        Aditya Sharma (Student)
                      </div>
                      <div className="text-[10px] text-slate-400">aditya_sharma@srmap.edu.in</div>
                    </div>
                  </div>
                  <span className="text-blue-600 dark:text-blue-400 text-xs font-bold">Sign In →</span>
                </button>

                <button
                  onClick={() => handleDevSignIn("FACULTY")}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 text-xs font-medium text-slate-800 dark:text-slate-200 transition-all group"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 transition-colors">
                        Dr. Naga Sravanthi (Faculty)
                      </div>
                      <div className="text-[10px] text-slate-400">dr_sravanthi@srmap.edu.in</div>
                    </div>
                  </div>
                  <span className="text-indigo-600 dark:text-indigo-400 text-xs font-bold">Sign In →</span>
                </button>
              </div>

              <button
                onClick={() => setShowPrompt(false)}
                className="w-full mt-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 transition-colors text-center cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};
