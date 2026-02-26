export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  image: string;
  description: string;
  specs: {
    [key: string]: string;
  };
}

export const products: Product[] = [
  {
    id: '1',
    name: 'آيفون 15 برو ماكس',
    category: 'هواتف ذكية',
    price: 1199,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=800',
    description: 'الآيفون الأقوى بتصميم من التيتانيوم، شريحة A17 Pro، وأقوى نظام كاميرا حتى الآن.',
    specs: {
      'الشاشة': '6.7" Super Retina XDR',
      'المعالج': 'شريحة A17 Pro',
      'الكاميرا': '48MP رئيسية | واسعة جداً | تيليفوتو',
      'البطارية': 'تصل إلى 29 ساعة تشغيل فيديو'
    }
  },
  {
    id: '2',
    name: 'سامسونج جالكسي S24 ألترا',
    category: 'هواتف ذكية',
    price: 1299,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1706606991536-e32260d85869?auto=format&fit=crop&q=80&w=800',
    description: 'جالكسي AI هنا. مرحبًا بك في عصر الذكاء الاصطناعي للهواتف. مع أقوى معالج وكاميرا.',
    specs: {
      'الشاشة': '6.8" QHD+ AMOLED',
      'المعالج': 'Snapdragon 8 Gen 3',
      'الكاميرا': '200MP رئيسية',
      'قلم S Pen': 'مرفق'
    }
  },
  {
    id: '3',
    name: 'ماك بوك برو 16 إنش',
    category: 'لابتوبات',
    price: 2499,
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?auto=format&fit=crop&q=80&w=800',
    description: 'مذهل. ملفت للنظر. أقوى ماك بوك برو على الإطلاق.',
    specs: {
      'الشريحة': 'M3 Max',
      'الذاكرة': 'تصل إلى 128GB',
      'الشاشة': 'Liquid Retina XDR',
      'البطارية': 'تصل إلى 22 ساعة'
    }
  },
  {
    id: '4',
    name: 'سوني WH-1000XM5',
    category: 'صوتيات',
    price: 349,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=800',
    description: 'إلغاء ضوضاء رائد في الصناعة، جودة صوت استثنائية، ومكالمات واضحة تمامًا.',
    specs: {
      'البطارية': '30 ساعة',
      'إلغاء الضوضاء': 'نعم',
      'الاتصال': 'بلوتوث 5.2',
      'الوزن': '250 جرام'
    }
  },
  {
    id: '5',
    name: 'آيباد برو 12.9 إنش',
    category: 'أجهزة لوحية',
    price: 1099,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1544547976-de2b31989638?auto=format&fit=crop&q=80&w=800',
    description: 'تجربة الآيباد القصوى مع شريحة M2 الثورية.',
    specs: {
      'الشاشة': 'Liquid Retina XDR',
      'الشريحة': 'M2',
      'الكاميرا': 'نظام كاميرا Pro',
      'الاتصال': '5G'
    }
  },
  {
    id: '6',
    name: 'ساعة آبل ألترا 2',
    category: 'أجهزة قابلة للارتداء',
    price: 799,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1697577418970-95d99b5a55cf?auto=format&fit=crop&q=80&w=800',
    description: 'ساعة آبل الأكثر صلابة وقدرة. مصممة للمغامرات الخارجية والتدريب على التحمل.',
    specs: {
      'الهيكل': '49mm تيتانيوم',
      'مقاومة الماء': '100 متر',
      'البطارية': 'تصل إلى 36 ساعة',
      'الشاشة': 'Retina تعمل دائمًا'
    }
  }
];

export const categories = [
  { id: 'all', name: 'كل المنتجات', icon: 'Grid' },
  { id: 'هواتف ذكية', name: 'هواتف ذكية', icon: 'Smartphone' },
  { id: 'لابتوبات', name: 'لابتوبات', icon: 'Laptop' },
  { id: 'صوتيات', name: 'صوتيات', icon: 'Headphones' },
  { id: 'أجهزة لوحية', name: 'أجهزة لوحية', icon: 'Tablet' },
  { id: 'أجهزة قابلة للارتداء', name: 'أجهزة قابلة للارتداء', icon: 'Watch' },
];
