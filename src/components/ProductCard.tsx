import React from 'react';
import { motion } from 'motion/react';
import { Star, ShoppingCart } from 'lucide-react';
import { Product } from '../data/mock';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="group relative bg-[#1a1a1a] border border-white/5 rounded-3xl overflow-hidden hover:border-purple-500/50 transition-all duration-500 shadow-lg hover:shadow-purple-500/20 h-full flex flex-col"
    >
      <Link to={`/product/${product.id}`} className="block flex-1 flex flex-col">
        {/* Image Container */}
        <div className="relative aspect-[4/5] overflow-hidden bg-black/40">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
          />
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
          
          {/* Rating Badge */}
          <div className="absolute top-4 left-4 z-10">
            {product.rating >= 4.5 && (
              <div className="bg-black/60 backdrop-blur-md border border-yellow-500/30 px-2.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                <span className="text-xs font-bold text-yellow-100">{product.rating}</span>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-3 md:p-5 flex-1 flex flex-col relative bg-[#1a1a1a]">
           {/* Category */}
          <div className="mb-2 md:mb-3">
            <span className="text-[9px] md:text-[10px] font-bold tracking-widest text-purple-400 uppercase bg-purple-500/10 px-2 py-0.5 md:px-2.5 md:py-1 rounded-md border border-purple-500/20">
              {product.category}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-sm md:text-lg font-bold text-white mb-2 md:mb-3 line-clamp-2 leading-tight group-hover:text-purple-300 transition-colors min-h-[2.5rem] md:min-h-[3rem]">
            {product.name}
          </h3>

          {/* Price & Action */}
          <div className="mt-auto flex items-center justify-between pt-3 md:pt-4 border-t border-white/5">
            <div className="flex flex-col">
              <span className="text-[10px] md:text-xs text-gray-400 mb-0.5">السعر</span>
              <span className="text-base md:text-xl font-bold text-white tracking-tight">
                ${product.price}
              </span>
            </div>
            
            <button
              onClick={(e) => {
                e.preventDefault();
                addToCart(product);
              }}
              className="w-8 h-8 md:w-11 md:h-11 rounded-full bg-white text-black flex items-center justify-center hover:bg-purple-600 hover:text-white transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:shadow-[0_0_25px_rgba(147,51,234,0.6)] transform group-hover:scale-110 active:scale-95"
              title="إضافة للسلة"
            >
              <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
