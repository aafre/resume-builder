import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Lock } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { FaLinkedin } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { toast } from 'react-hot-toast';

interface SignInRequiredGateProps {
  heading?: string;
  message?: string;
  showLocalNote?: boolean;
}

export default function SignInRequiredGate({
  heading = "Sign In to Access Your Resumes",
  message = "Keep your resumes safe in the cloud and access them anywhere",
  showLocalNote = true
}: SignInRequiredGateProps) {
  const { signInWithGoogle, signInWithLinkedIn, signInWithEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  const handleLinkedInSignIn = async () => {
    try {
      setLoading(true);
      await signInWithLinkedIn();
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in with LinkedIn');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);
      await signInWithEmail(email);
      setEmailSent(true);
      toast.success('Magic link sent! Check your email to continue.');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send magic link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        {!emailSent ? (
          <>
            {/* Lock Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                <Lock className="w-10 h-10 text-blue-600" />
              </div>
            </div>

            {/* Heading */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-3">
              {heading}
            </h1>

            {/* Message */}
            <p className="text-gray-600 text-center mb-8">
              {message}
            </p>

            {/* Social Sign-In Buttons */}
            <div className="space-y-3 mb-6">
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px]"
              >
                <FcGoogle size={24} />
                <span className="font-semibold text-gray-700">Continue with Google</span>
              </button>

              <button
                onClick={handleLinkedInSignIn}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px]"
              >
                <FaLinkedin size={24} className="text-[#0077B5]" />
                <span className="font-semibold text-gray-700">Continue with LinkedIn</span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or use email</span>
              </div>
            </div>

            {/* Email Sign-In Form */}
            <form onSubmit={handleEmailSignIn} className="space-y-4 mb-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <MdEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={loading}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white font-semibold py-3 rounded-lg hover:from-blue-700 hover:via-purple-700 hover:to-indigo-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px]"
              >
                {loading ? 'Sending...' : 'Send Magic Link'}
              </button>
            </form>

            {/* Footer Note */}
            {showLocalNote && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                <p className="text-xs text-blue-800 text-center">
                  <strong>Note:</strong> Your current resume is saved locally on this device
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8">
            {/* Success Icon */}
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MdEmail className="text-green-600" size={32} />
            </div>

            {/* Success Message */}
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Check Your Email</h3>
            <p className="text-gray-600 mb-6">
              We've sent a magic link to <strong>{email}</strong>.
              <br />
              Click the link in the email to sign in.
            </p>

            {/* Info Note */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                You'll be signed in automatically when you click the link, and your resumes will be available here.
              </p>
            </div>

            <button
              onClick={() => setEmailSent(false)}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Try a different method
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
