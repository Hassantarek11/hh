import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, ArrowRight, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const endpoint = isLogin ? '/api/login' : '/api/register';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      
      let data;
      try {
        const text = await res.text();
        data = text ? JSON.parse(text) : {};
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError);
        throw new Error("Invalid server response");
      }

      if (res.ok && data.success) {
        if (isLogin) {
          if (data.isAdmin) {
            localStorage.setItem('isAdmin', 'true');
            localStorage.setItem('userRole', data.role);
            localStorage.setItem('username', data.username);
            window.dispatchEvent(new Event('auth-change'));
            navigate('/dashboard');
          } else {
            localStorage.removeItem('isAdmin');
            localStorage.setItem('userRole', 'user');
            localStorage.setItem('username', data.username || username);
            window.dispatchEvent(new Event('auth-change'));
            navigate('/');
          }
        } else {
          setSuccess('تم إنشاء الحساب بنجاح! يمكنك تسجيل الدخول الآن.');
          setIsLogin(true);
          setPassword('');
        }
      } else {
        setError(data.error || 'حدث خطأ ما');
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      setError('حدث خطأ في الاتصال: ' + (err.message || 'غير معروف'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] relative overflow-hidden px-4">
      {/* Background Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] -z-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] -z-10 animate-pulse delay-1000"></div>

      <motion.div 
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl relative z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center mb-4 shadow-lg shadow-purple-500/30"
          >
            {isLogin ? <Lock className="w-8 h-8 text-white" /> : <UserPlus className="w-8 h-8 text-white" />}
          </motion.div>
          <h2 className="text-3xl font-bold text-white text-center">
            {isLogin ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
          </h2>
          <p className="text-gray-400 text-sm mt-2">
            {isLogin ? 'مرحباً بك مجدداً في تيك نوفا' : 'انضم إلينا واستمتع بتجربة تسوق فريدة'}
          </p>
        </div>
        
        <AnimatePresence mode='wait'>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 text-sm text-center flex items-center justify-center gap-2"
            >
              <span>⚠️</span>
              {error}
            </motion.div>
          )}
          {success && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-xl mb-6 text-sm text-center flex items-center justify-center gap-2"
            >
              <span>✅</span>
              {success}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="relative group">
              <User className="absolute right-4 top-3.5 w-5 h-5 text-gray-500 group-focus-within:text-purple-500 transition-colors" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3.5 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:bg-black/40 transition-all"
                placeholder="اسم المستخدم"
                required
              />
            </div>
            <div className="relative group">
              <Lock className="absolute right-4 top-3.5 w-5 h-5 text-gray-500 group-focus-within:text-purple-500 transition-colors" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3.5 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:bg-black/40 transition-all"
                placeholder="كلمة المرور"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
          >
            {loading ? (
              'جاري المعالجة...'
            ) : (
              <>
                {isLogin ? 'دخول' : 'إنشاء حساب'}
                <ArrowRight className="w-5 h-5 group-hover:-translate-x-1 transition-transform rotate-180" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-white/10 pt-6">
          <p className="text-gray-400 text-sm mb-2">
            {isLogin ? 'ليس لديك حساب؟' : 'لديك حساب بالفعل؟'}
          </p>
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setSuccess('');
            }}
            className="text-purple-400 hover:text-purple-300 font-bold transition-colors"
          >
            {isLogin ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
