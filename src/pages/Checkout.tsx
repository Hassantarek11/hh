import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, CheckCircle, ArrowRight, MapPin, User, Mail, Phone } from 'lucide-react';
import { motion } from 'motion/react';

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Success
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zip: '',
    cardName: '',
    cardNumber: '',
    expDate: '',
    cvv: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitShipping = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
    window.scrollTo(0, 0);
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: formData.fullName,
          customer_email: formData.email,
          address: `${formData.address}, ${formData.city}, ${formData.zip}`,
          total: total,
          items: items
        })
      });

      if (res.ok) {
        clearCart();
        setStep(3);
      } else {
        alert('حدث خطأ أثناء إتمام الطلب');
      }
    } catch (error) {
      console.error('Order error', error);
      alert('حدث خطأ في الاتصال');
    } finally {
      setLoading(false);
      window.scrollTo(0, 0);
    }
  };

  if (items.length === 0 && step !== 3) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white p-4">
        <h2 className="text-2xl font-bold mb-4">سلة التسوق فارغة</h2>
        <button 
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-purple-600 rounded-xl hover:bg-purple-700 transition-colors"
        >
          العودة للمتجر
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Progress Steps */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center w-full max-w-2xl">
            <div className={`flex flex-col items-center ${step >= 1 ? 'text-purple-500' : 'text-gray-500'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step >= 1 ? 'border-purple-500 bg-purple-500/20' : 'border-gray-600 bg-gray-800'} mb-2`}>
                <Truck className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium">الشحن</span>
            </div>
            <div className={`flex-1 h-1 mx-4 ${step >= 2 ? 'bg-purple-500' : 'bg-gray-700'}`} />
            <div className={`flex flex-col items-center ${step >= 2 ? 'text-purple-500' : 'text-gray-500'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step >= 2 ? 'border-purple-500 bg-purple-500/20' : 'border-gray-600 bg-gray-800'} mb-2`}>
                <CreditCard className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium">الدفع</span>
            </div>
            <div className={`flex-1 h-1 mx-4 ${step >= 3 ? 'bg-purple-500' : 'bg-gray-700'}`} />
            <div className={`flex flex-col items-center ${step >= 3 ? 'text-purple-500' : 'text-gray-500'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step >= 3 ? 'border-purple-500 bg-purple-500/20' : 'border-gray-600 bg-gray-800'} mb-2`}>
                <CheckCircle className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium">تم بنجاح</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form Area */}
          <div className="lg:col-span-2">
            {step === 1 && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8"
              >
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <MapPin className="text-purple-500" />
                  عنوان الشحن
                </h2>
                <form onSubmit={handleSubmitShipping} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">الاسم الكامل</label>
                      <div className="relative">
                        <User className="absolute right-3 top-3 w-5 h-5 text-gray-500" />
                        <input
                          required
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          type="text"
                          className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 pr-10 focus:border-purple-500 focus:outline-none transition-colors"
                          placeholder="الاسم الثلاثي"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">رقم الهاتف</label>
                      <div className="relative">
                        <Phone className="absolute right-3 top-3 w-5 h-5 text-gray-500" />
                        <input
                          required
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          type="tel"
                          className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 pr-10 focus:border-purple-500 focus:outline-none transition-colors"
                          placeholder="05xxxxxxxx"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">البريد الإلكتروني</label>
                    <div className="relative">
                      <Mail className="absolute right-3 top-3 w-5 h-5 text-gray-500" />
                      <input
                        required
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        type="email"
                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 pr-10 focus:border-purple-500 focus:outline-none transition-colors"
                        placeholder="example@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">العنوان</label>
                    <input
                      required
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      type="text"
                      className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:border-purple-500 focus:outline-none transition-colors"
                      placeholder="اسم الشارع، رقم المبنى"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">المدينة</label>
                      <input
                        required
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        type="text"
                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:border-purple-500 focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">الرمز البريدي</label>
                      <input
                        required
                        name="zip"
                        value={formData.zip}
                        onChange={handleInputChange}
                        type="text"
                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:border-purple-500 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 mt-8"
                  >
                    متابعة للدفع
                    <ArrowRight className="w-5 h-5 rotate-180" />
                  </button>
                </form>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8"
              >
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <CreditCard className="text-purple-500" />
                  بيانات الدفع
                </h2>
                <form onSubmit={handlePayment} className="space-y-6">
                  <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-purple-300">بطاقة ائتمان</span>
                      <div className="flex gap-2">
                        <div className="w-8 h-5 bg-white/10 rounded"></div>
                        <div className="w-8 h-5 bg-white/10 rounded"></div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <input
                        required
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        type="text"
                        maxLength={19}
                        placeholder="0000 0000 0000 0000"
                        className="w-full bg-transparent border-b border-purple-500/30 py-2 text-xl font-mono focus:outline-none focus:border-purple-500 placeholder-purple-500/30"
                      />
                      <div className="flex gap-4">
                        <input
                          required
                          name="expDate"
                          value={formData.expDate}
                          onChange={handleInputChange}
                          type="text"
                          placeholder="MM/YY"
                          maxLength={5}
                          className="w-1/2 bg-transparent border-b border-purple-500/30 py-2 font-mono focus:outline-none focus:border-purple-500 placeholder-purple-500/30"
                        />
                        <input
                          required
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          type="text"
                          placeholder="CVV"
                          maxLength={3}
                          className="w-1/2 bg-transparent border-b border-purple-500/30 py-2 font-mono focus:outline-none focus:border-purple-500 placeholder-purple-500/30"
                        />
                      </div>
                      <input
                        required
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleInputChange}
                        type="text"
                        placeholder="الاسم على البطاقة"
                        className="w-full bg-transparent border-b border-purple-500/30 py-2 focus:outline-none focus:border-purple-500 placeholder-purple-500/30"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="w-1/3 bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-xl transition-colors"
                    >
                      رجوع
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-2/3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      {loading ? 'جاري المعالجة...' : `دفع $${total.toFixed(2)}`}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center py-16"
              >
                <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">تم الطلب بنجاح!</h2>
                <p className="text-gray-400 mb-8 max-w-md mx-auto">
                  شكراً لطلبك. تم استلام طلبك بنجاح وسيتم شحنه قريباً.
                  تم إرسال تفاصيل الطلب إلى بريدك الإلكتروني.
                </p>
                <button
                  onClick={() => navigate('/')}
                  className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-colors"
                >
                  العودة للمتجر
                </button>
              </motion.div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          {step !== 3 && (
            <div className="lg:col-span-1">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sticky top-24">
                <h3 className="text-xl font-bold text-white mb-6">ملخص الطلب</h3>
                <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-16 h-16 rounded-lg bg-white/5 overflow-hidden flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-white line-clamp-2">{item.name}</h4>
                        <div className="flex justify-between mt-1">
                          <span className="text-xs text-gray-400">الكمية: {item.quantity}</span>
                          <span className="text-sm font-bold text-purple-400">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-white/10 pt-4 space-y-2">
                  <div className="flex justify-between text-gray-400">
                    <span>المجموع الفرعي</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>الشحن</span>
                    <span className="text-green-400">مجاني</span>
                  </div>
                  <div className="flex justify-between text-white font-bold text-xl pt-4 border-t border-white/10 mt-4">
                    <span>الإجمالي</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
