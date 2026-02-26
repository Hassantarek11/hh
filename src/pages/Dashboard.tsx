import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Image as ImageIcon, LogOut, Users, Shield, UserPlus, ShoppingBag, CheckCircle, XCircle, Store } from 'lucide-react';
import { Product } from '../data/mock';

interface User {
  id: number;
  username: string;
  role: 'super_admin' | 'admin' | 'store_manager' | 'user';
}

interface Order {
  id: number;
  customer_name: string;
  customer_email: string;
  address: string;
  total: number;
  status: string;
  created_at: string;
  items: any[];
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('list'); // 'list', 'add', 'users', 'orders'
  const [currentUser, setCurrentUser] = useState<{ username: string, role: string } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'هواتف ذكية',
    price: '',
    description: '',
    imageUrl: '',
    specs: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  // New Admin Form State
  const [newAdmin, setNewAdmin] = useState({ username: '', password: '' });

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    const role = localStorage.getItem('userRole');
    const username = localStorage.getItem('username');

    if (!isAdmin) {
      navigate('/login');
      return;
    }

    setCurrentUser({ username: username || '', role: role || 'user' });
    fetchProducts();
    
    if (role === 'super_admin') {
      fetchUsers();
      fetchOrders();
    } else if (role === 'admin') {
      fetchOrders();
    }
  }, [navigate]);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error('Server error');
      const text = await res.text();
      const data = text ? JSON.parse(text) : [];
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch products', error);
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      if (!res.ok) throw new Error('Server error');
      const text = await res.text();
      const data = text ? JSON.parse(text) : [];
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      if (!res.ok) throw new Error('Server error');
      const text = await res.text();
      const data = text ? JSON.parse(text) : [];
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders', error);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/users/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAdmin)
      });
      if (res.ok) {
        alert('تم إضافة المشرف بنجاح');
        setNewAdmin({ username: '', password: '' });
        fetchUsers();
      } else {
        const data = await res.json();
        alert(data.error || 'فشل إضافة المشرف');
      }
    } catch (error) {
      console.error('Error adding admin', error);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا المستخدم؟')) return;
    try {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
      if (res.ok) fetchUsers();
      else alert('لا يمكن حذف هذا المستخدم');
    } catch (error) {
      console.error('Failed to delete user', error);
    }
  };

  const handleUpdateRole = async (id: number, role: string) => {
    try {
      const res = await fetch(`/api/users/${id}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role })
      });
      if (res.ok) fetchUsers();
    } catch (error) {
      console.error('Failed to update role', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      fetchProducts();
    } catch (error) {
      console.error('Failed to delete', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('category', formData.category);
    data.append('price', formData.price);
    data.append('description', formData.description);
    data.append('imageUrl', formData.imageUrl);
    
    // Default specs if empty
    const specsJson = formData.specs || JSON.stringify({ "مواصفات": "غير محددة" });
    data.append('specs', specsJson);

    if (imageFile) {
      data.append('image', imageFile);
    }

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        body: data
      });
      if (res.ok) {
        alert('تم إضافة المنتج بنجاح');
        setFormData({ name: '', category: 'هواتف ذكية', price: '', description: '', imageUrl: '', specs: '' });
        setImageFile(null);
        setActiveTab('list');
        fetchProducts();
      } else {
        alert('حدث خطأ أثناء الإضافة');
      }
    } catch (error) {
      console.error('Error adding product', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    navigate('/login');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-white">جاري التحميل...</div>;

  const isSuperAdmin = currentUser?.role === 'super_admin';
  const isStoreManager = currentUser?.role === 'store_manager';
  const canViewOrders = isSuperAdmin || currentUser?.role === 'admin';
  const canDeleteProducts = isSuperAdmin || currentUser?.role === 'admin';

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">لوحة التحكم</h1>
            <p className="text-gray-400 text-sm mt-1">
              مرحباً، {currentUser?.username} 
              <span className="mr-2 px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 text-xs">
                {isSuperAdmin ? 'مشرف رئيسي' : isStoreManager ? 'مدير متجر' : 'مشرف'}
              </span>
            </p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-red-400 hover:text-red-300">
            <LogOut className="w-5 h-5" />
            تسجيل خروج
          </button>
        </div>

        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('list')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${activeTab === 'list' ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
          >
            المنتجات
          </button>
          <button
            onClick={() => setActiveTab('add')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${activeTab === 'add' ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
          >
            إضافة منتج جديد
          </button>
          {canViewOrders && (
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'orders' ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
            >
              <ShoppingBag className="w-4 h-4" />
              الطلبات
            </button>
          )}
          {isSuperAdmin && (
            <button
              onClick={() => setActiveTab('users')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'users' ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
            >
              <Users className="w-4 h-4" />
              إدارة المستخدمين
            </button>
          )}
        </div>

        {activeTab === 'list' && (
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <table className="w-full text-right">
              <thead className="bg-white/5 text-gray-400">
                <tr>
                  <th className="p-4">الصورة</th>
                  <th className="p-4">الاسم</th>
                  <th className="p-4">السعر</th>
                  <th className="p-4">التصنيف</th>
                  {canDeleteProducts && <th className="p-4">إجراءات</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
                    </td>
                    <td className="p-4 font-medium">{product.name}</td>
                    <td className="p-4 text-purple-400">${product.price}</td>
                    <td className="p-4 text-sm text-gray-400">{product.category}</td>
                    {canDeleteProducts && (
                      <td className="p-4">
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'add' && (
          <div className="max-w-2xl bg-white/5 border border-white/10 rounded-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">اسم المنتج</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">السعر ($)</label>
                  <input
                    required
                    type="number"
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: e.target.value})}
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">التصنيف</label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 focus:border-purple-500 focus:outline-none text-white"
                >
                  <option value="هواتف ذكية">هواتف ذكية</option>
                  <option value="لابتوبات">لابتوبات</option>
                  <option value="صوتيات">صوتيات</option>
                  <option value="أجهزة لوحية">أجهزة لوحية</option>
                  <option value="أجهزة قابلة للارتداء">أجهزة قابلة للارتداء</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">الوصف</label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">الصورة</label>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="رابط الصورة (URL)"
                    value={formData.imageUrl}
                    onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 focus:border-purple-500 focus:outline-none"
                  />
                  <div className="text-center text-sm text-gray-500">أو</div>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => setImageFile(e.target.files?.[0] || null)}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="flex items-center justify-center gap-2 w-full bg-white/5 border border-dashed border-white/20 rounded-lg px-4 py-8 cursor-pointer hover:bg-white/10 transition-colors"
                    >
                      <ImageIcon className="w-6 h-6 text-gray-400" />
                      <span className="text-gray-400">{imageFile ? imageFile.name : 'اختر صورة من جهازك'}</span>
                    </label>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl transition-colors"
              >
                إضافة المنتج
              </button>
            </form>
          </div>
        )}

        {activeTab === 'orders' && canViewOrders && (
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-green-400" />
                طلبات الشراء
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead className="bg-white/5 text-gray-400">
                  <tr>
                    <th className="p-4">رقم الطلب</th>
                    <th className="p-4">العميل</th>
                    <th className="p-4">العنوان</th>
                    <th className="p-4">المنتجات</th>
                    <th className="p-4">الإجمالي</th>
                    <th className="p-4">الحالة</th>
                    <th className="p-4">التاريخ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 text-gray-500">#{order.id}</td>
                      <td className="p-4">
                        <div className="font-medium">{order.customer_name}</div>
                        <div className="text-xs text-gray-500">{order.customer_email}</div>
                      </td>
                      <td className="p-4 text-sm text-gray-400 max-w-xs truncate">{order.address}</td>
                      <td className="p-4 text-sm">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="text-gray-300">
                            {item.quantity}x {item.name}
                          </div>
                        ))}
                      </td>
                      <td className="p-4 text-purple-400 font-bold">${order.total}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          order.status === 'completed' ? 'bg-green-500/10 text-green-400' :
                          order.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' :
                          'bg-gray-500/10 text-gray-400'
                        }`}>
                          {order.status === 'pending' ? 'قيد الانتظار' : order.status}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString('ar-EG')}
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-gray-500">
                        لا توجد طلبات حتى الآن
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'users' && isSuperAdmin && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Add Admin Form */}
            <div className="lg:col-span-1">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-purple-400" />
                  إضافة مشرف جديد
                </h3>
                <form onSubmit={handleAddAdmin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">اسم المستخدم</label>
                    <input
                      type="text"
                      required
                      value={newAdmin.username}
                      onChange={e => setNewAdmin({...newAdmin, username: e.target.value})}
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">كلمة المرور</label>
                    <input
                      type="password"
                      required
                      value={newAdmin.password}
                      onChange={e => setNewAdmin({...newAdmin, password: e.target.value})}
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition-colors"
                  >
                    إضافة المشرف
                  </button>
                </form>
              </div>
            </div>

            {/* Users List */}
            <div className="lg:col-span-2">
              <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-white/10">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-400" />
                    المستخدمين المسجلين
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-right">
                    <thead className="bg-white/5 text-gray-400">
                      <tr>
                        <th className="p-4">المعرف</th>
                        <th className="p-4">اسم المستخدم</th>
                        <th className="p-4">الدور</th>
                        <th className="p-4">إجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-4 text-gray-500">#{user.id}</td>
                          <td className="p-4 font-medium">{user.username}</td>
                          <td className="p-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              user.role === 'super_admin' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                              user.role === 'admin' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                              user.role === 'store_manager' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                              'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                            }`}>
                              {user.role === 'super_admin' ? 'مشرف رئيسي' :
                               user.role === 'admin' ? 'مشرف' : 
                               user.role === 'store_manager' ? 'مدير متجر' : 'مستخدم'}
                            </span>
                          </td>
                          <td className="p-4 flex gap-2">
                            {user.role !== 'super_admin' && (
                              <>
                                <select 
                                  value={user.role}
                                  onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                                  className="bg-black/30 border border-white/10 rounded text-xs p-1 text-gray-300 focus:outline-none focus:border-purple-500"
                                >
                                  <option value="user">مستخدم</option>
                                  <option value="store_manager">مدير متجر</option>
                                  <option value="admin">مشرف</option>
                                </select>
                                <button 
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="p-1 text-red-400 hover:bg-red-500/10 rounded transition-colors"
                                  title="حذف المستخدم"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
