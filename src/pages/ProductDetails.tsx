import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Product } from '../data/mock';
import { Star, ShoppingCart, ArrowLeft, Truck, Shield, RefreshCw } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { motion } from 'motion/react';

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch current product
    fetch(`/api/products/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(data => {
        setProduct(data);
        // Fetch related products (all products for now, filtered client side or we could add an API for it)
        return fetch('/api/products');
      })
      .then(res => res.json())
      .then(allProducts => {
        setRelatedProducts(allProducts);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-white">جاري التحميل...</div>;
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        المنتج غير موجود
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
        العودة للمتجر
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Section */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative aspect-square rounded-3xl overflow-hidden bg-white/5 border border-white/10"
        >
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
        </motion.div>

        {/* Details Section */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-bold uppercase tracking-wider border border-purple-500/20">
                {product.category}
              </span>
              <div className="flex items-center gap-1 text-yellow-400">
                <Star className="w-4 h-4 fill-yellow-400" />
                <span className="text-sm font-bold">{product.rating}</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{product.name}</h1>
            <p className="text-gray-400 text-lg leading-relaxed">{product.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {product.specs && Object.entries(product.specs).map(([key, value]) => (
              <div key={key} className="p-4 rounded-xl bg-white/5 border border-white/5">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{key}</p>
                <p className="text-white font-medium">{value}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/10">
            <div>
              <p className="text-sm text-gray-400 mb-1">السعر الإجمالي</p>
              <p className="text-3xl font-bold text-white">${product.price}</p>
            </div>
            <button
              onClick={() => addToCart(product)}
              className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-purple-600/20 hover:shadow-purple-600/40 transform hover:-translate-y-1"
            >
              <ShoppingCart className="w-5 h-5" />
              إضافة للسلة
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/10">
            <div className="text-center">
              <div className="w-10 h-10 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-2 text-purple-400">
                <Truck className="w-5 h-5" />
              </div>
              <p className="text-xs text-gray-400">شحن مجاني</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-2 text-purple-400">
                <Shield className="w-5 h-5" />
              </div>
              <p className="text-xs text-gray-400">ضمان سنتين</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-2 text-purple-400">
                <RefreshCw className="w-5 h-5" />
              </div>
              <p className="text-xs text-gray-400">استرجاع 30 يوم</p>
            </div>
          </div>
        </motion.div>
      </div>
      <div className="mt-24 border-t border-white/10 pt-12">
        <h2 className="text-2xl font-bold text-white mb-8">قد يعجبك أيضاً</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts
            .filter(p => p.category === product.category && p.id !== product.id)
            .slice(0, 4)
            .map(relatedProduct => (
              <div key={relatedProduct.id} className="group relative bg-white/5 border border-white/5 rounded-2xl overflow-hidden hover:border-purple-500/30 transition-colors duration-300">
                <Link to={`/product/${relatedProduct.id}`} className="block">
                  <div className="relative aspect-square overflow-hidden bg-black/20">
                    <img
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-bold text-white mb-1 line-clamp-1">{relatedProduct.name}</h3>
                    <p className="text-purple-400 font-bold">${relatedProduct.price}</p>
                  </div>
                </Link>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
