import React, { useContext, useState, useEffect } from 'react';
import { InventoryContext } from '../../context/InventoryContext';
import { POSContext } from '../../context/POSContext';
import { Search, ShoppingBag, Plus, Minus, Trash2, X, Receipt } from 'lucide-react';
import PageLoader from '../../components/ui/PageLoader';
import gsap from 'gsap';

const POS = () => {
    const { products, categories, isLoading: isInventoryLoading } = useContext(InventoryContext);
    const { 
        cart, addToCart, updateQuantity, removeFromCart, clearCart,
        subtotal, taxRate, taxAmount, total, checkout, isCheckoutLoading
    } = useContext(POSContext);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);

    // Filter products
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              (product.barcode && product.barcode.includes(searchTerm));
        const matchesCategory = selectedCategory === '' || product.category_id === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // Animations for product grid
    useEffect(() => {
        if (!isInventoryLoading && filteredProducts.length > 0) {
            gsap.fromTo('.pos-product-card',
                { opacity: 0, scale: 0.95 },
                { opacity: 1, scale: 1, duration: 0.3, stagger: 0.02, ease: "power2.out", clearProps: "all" }
            );
        }
    }, [isInventoryLoading, filteredProducts.length, selectedCategory]);

    const handleCheckout = async (method) => {
        const success = await checkout(method);
        if (success) {
            setIsMobileCartOpen(false);
        }
    };

    // --- Components ---

    const CartContent = () => (
        <div className="flex flex-col h-full bg-white relative">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <Receipt className="w-5 h-5 text-emerald-600" />
                    الفاتورة الحالية
                </h2>
                {cart.length > 0 && (
                    <button onClick={clearCart} className="text-xs font-bold text-rose-500 hover:text-rose-600 px-3 py-1.5 rounded-lg hover:bg-rose-50 transition-colors">
                        إفراغ السلة
                    </button>
                )}
            </div>

            <div className="flex-1 overflow-y-auto p-2">
                {cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
                            <ShoppingBag className="w-8 h-8 text-slate-300" />
                        </div>
                        <p className="font-medium text-sm">السلة فارغة، ابدأ بإضافة المنتجات.</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {cart.map(item => (
                            <div key={item.product_id} className="flex flex-col p-3 bg-white border border-slate-100 rounded-xl shadow-sm">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-slate-800 text-sm line-clamp-2">{item.product_name}</h4>
                                    <button onClick={() => removeFromCart(item.product_id)} className="text-slate-300 hover:text-rose-500 p-1 rounded-md transition-colors">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="flex justify-between items-end mt-1">
                                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-1">
                                        <button onClick={() => updateQuantity(item.product_id, item.quantity - 1)} className="w-6 h-6 flex items-center justify-center bg-white border border-slate-200 rounded text-slate-600 hover:bg-slate-100">
                                            <Minus className="w-3 h-3" />
                                        </button>
                                        <span className="w-8 text-center font-bold text-sm text-slate-800">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.product_id, item.quantity + 1)} className="w-6 h-6 flex items-center justify-center bg-emerald-500 rounded text-white hover:bg-emerald-600 shadow-sm">
                                            <Plus className="w-3 h-3" />
                                        </button>
                                    </div>
                                    <div className="text-left">
                                        <div className="text-xs text-slate-500 mb-0.5">{parseFloat(item.unit_price).toFixed(2)} × {item.quantity}</div>
                                        <div className="font-bold text-emerald-600" dir="ltr">{parseFloat(item.subtotal).toFixed(2)}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50/50 pb-[env(safe-area-inset-bottom)]">
                <div className="space-y-2 mb-4 text-sm">
                    <div className="flex justify-between text-slate-500">
                        <span>المجموع الفرعي</span>
                        <span dir="ltr" className="font-medium text-slate-700">{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                        <span>الضريبة ({(taxRate * 100).toFixed(0)}%)</span>
                        <span dir="ltr" className="font-medium text-slate-700">{taxAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-slate-200/60">
                        <span className="font-extrabold text-slate-800 text-lg">الإجمالي</span>
                        <span dir="ltr" className="font-black text-emerald-600 text-2xl">{total.toFixed(2)} <span className="text-xs text-slate-500 font-normal">ر.س</span></span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <button 
                        onClick={() => handleCheckout('card')}
                        disabled={cart.length === 0 || isCheckoutLoading}
                        className="w-full py-3.5 px-4 rounded-xl font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 border border-emerald-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        دفع شبكة
                    </button>
                    <button 
                        onClick={() => handleCheckout('cash')}
                        disabled={cart.length === 0 || isCheckoutLoading}
                        className="w-full py-3.5 px-4 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {isCheckoutLoading ? 'جاري الدفع...' : 'دفع نقدي'}
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-slate-50">
            {/* Left Side: Products Grid (60% Desktop, 100% Mobile) */}
            <div className="flex-1 flex flex-col w-full md:w-3/5 lg:w-2/3 border-l border-slate-200 relative">
                {/* POS Header / Search */}
                <div className="bg-white p-4 border-b border-slate-200 z-10 flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="ابحث عن منتج أو باركود..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm transition-all"
                        />
                    </div>
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-medium text-slate-700 outline-none"
                    >
                        <option value="">جميع الأقسام</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>

                {/* Products Grid */}
                <div className="flex-1 overflow-y-auto p-4 pb-24 md:pb-4">
                    {isInventoryLoading ? (
                        <PageLoader message="جاري تحميل المنتجات..." />
                    ) : filteredProducts.length === 0 ? (
                        <div className="text-center text-slate-500 mt-12 font-medium">لا توجد منتجات مطابقة.</div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                            {filteredProducts.map(product => {
                                const inStock = product.initial_quantity > 0;
                                return (
                                    <div 
                                        key={product.id}
                                        onClick={() => inStock ? addToCart(product) : null}
                                        className={`pos-product-card relative flex flex-col bg-white rounded-2xl border p-3 cursor-pointer transition-all ${inStock ? 'border-slate-200 hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-500/10 active:scale-95' : 'border-slate-100 opacity-60 cursor-not-allowed'}`}
                                    >
                                        <div className="aspect-square bg-slate-50 rounded-xl mb-3 flex items-center justify-center border border-slate-100/50">
                                            <ShoppingBag className="w-8 h-8 text-slate-300" />
                                            {!inStock && <span className="absolute top-2 right-2 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">نفذت الكمية</span>}
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between">
                                            <h3 className="text-sm font-bold text-slate-800 line-clamp-2 leading-tight mb-1">{product.name}</h3>
                                            <div className="flex justify-between items-center mt-2">
                                                <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">متوفر: {product.initial_quantity}</span>
                                                <span className="font-extrabold text-emerald-600" dir="ltr">{parseFloat(product.retail_price).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Mobile Floating Cart Button */}
                <div className="md:hidden fixed bottom-[calc(env(safe-area-inset-bottom)+64px)] left-0 right-0 p-4 pointer-events-none z-20">
                    <button 
                        onClick={() => setIsMobileCartOpen(true)}
                        className="pointer-events-auto w-full bg-slate-900 text-white rounded-2xl p-4 shadow-2xl shadow-slate-900/20 flex justify-between items-center active:scale-95 transition-transform"
                    >
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <ShoppingBag className="w-6 h-6" />
                                {cart.length > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-slate-900">
                                        {cart.length}
                                    </span>
                                )}
                            </div>
                            <span className="font-bold">عرض الفاتورة</span>
                        </div>
                        <span className="font-black text-xl" dir="ltr">{total.toFixed(2)} <span className="text-sm font-normal text-slate-300">ر.س</span></span>
                    </button>
                </div>
            </div>

            {/* Right Side: Cart (40% Desktop, Hidden on Mobile unless Drawer Open) */}
            <div className="hidden md:block w-[350px] lg:w-[400px] h-full shadow-[-4px_0_24px_rgb(0,0,0,0.02)] z-20 relative">
                <CartContent />
            </div>

            {/* Mobile Cart Drawer */}
            {isMobileCartOpen && (
                <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsMobileCartOpen(false)}></div>
                    <div className="relative bg-white w-full h-[85vh] rounded-t-3xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-full duration-300 ease-out">
                        <div className="w-full flex justify-center py-3 bg-white" onClick={() => setIsMobileCartOpen(false)}>
                            <div className="w-12 h-1.5 bg-slate-200 rounded-full"></div>
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <CartContent />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default POS;
