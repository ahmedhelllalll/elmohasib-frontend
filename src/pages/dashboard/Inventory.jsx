import React, { useContext, useState, useRef, useEffect } from 'react';
import { InventoryContext } from '../../context/InventoryContext';
import ProductDrawer from '../../components/inventory/ProductDrawer';
import PageLoader from '../../components/ui/PageLoader';
import { Plus, Search, Edit2, Trash2, PackageSearch, PackageOpen } from 'lucide-react';
import gsap from 'gsap';
import { toast } from 'sonner';

const Inventory = () => {
    const { products, categories, isLoading, deleteProduct } = useContext(InventoryContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    
    const listRef = useRef(null);

    // Animate list items when they load
    useEffect(() => {
        if (!isLoading && products.length > 0 && listRef.current) {
            gsap.fromTo(listRef.current.children,
                { opacity: 0, y: 15 },
                { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: "power2.out", clearProps: "all" }
            );
        }
    }, [isLoading, products.length]);

    const handleAdd = () => {
        setEditingProduct(null);
        setIsDrawerOpen(true);
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setIsDrawerOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('هل أنت متأكد من حذف هذا المنتج؟ لا يمكن التراجع عن هذه الخطوة.')) {
            try {
                await deleteProduct(id);
                toast.success('تم حذف المنتج بنجاح');
            } catch (err) {
                toast.error('حدث خطأ أثناء الحذف.');
            }
        }
    };

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              (p.barcode && p.barcode.includes(searchTerm));
        const matchesCategory = selectedCategory ? p.category_id === selectedCategory : true;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
                        <PackageSearch className="w-6 h-6 text-emerald-500" />
                        إدارة المخزون
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">أضف، عدل، وراقب منتجاتك وتنبيهات النقصان.</p>
                </div>
                
                {/* Desktop Add Button */}
                <button 
                    onClick={handleAdd}
                    className="hidden md:flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:bg-slate-800 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    إضافة منتج
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-slate-100 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 start-0 flex items-center pe-3 ps-3 pointer-events-none">
                        <Search className="w-4 h-4 text-slate-400" />
                    </div>
                    <input 
                        type="text" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-slate-50 border border-slate-100 text-slate-900 text-sm rounded-xl focus:ring-emerald-500 focus:border-emerald-500 block w-full ps-10 p-2.5 transition-colors placeholder-slate-400" 
                        placeholder="ابحث بالاسم أو الباركود..." 
                    />
                </div>
                <div className="w-full md:w-64">
                    <select 
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="bg-slate-50 border border-slate-100 text-slate-900 text-sm rounded-xl focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5 transition-colors"
                    >
                        <option value="">جميع الأقسام</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Empty State */}
            {!isLoading && filteredProducts.length === 0 && (
                <div className="bg-white rounded-3xl border border-slate-100 border-dashed py-16 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                        <PackageOpen className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">لا توجد منتجات</h3>
                    <p className="text-slate-500 text-sm mt-1 mb-6 max-w-sm">
                        لم تقم بإضافة أي منتجات بعد، أو أن بحثك لم يطابق أي نتائج.
                    </p>
                    <button 
                        onClick={handleAdd}
                        className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-100 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        إضافة أول منتج
                    </button>
                </div>
            )}

            {/* Desktop Table View */}
            <div className="flex-1 overflow-hidden flex flex-col bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100/60 relative">
                {isLoading ? (
                    <PageLoader message="جاري تحميل المخزون..." />
                ) : filteredProducts.length > 0 && (
                    <table className="w-full text-sm text-right text-slate-500">
                        <thead className="text-xs text-slate-700 bg-slate-50/50 uppercase">
                            <tr>
                                <th className="px-6 py-4 rounded-ts-2xl">المنتج</th>
                                <th className="px-6 py-4">القسم</th>
                                <th className="px-6 py-4">سعر البيع</th>
                                <th className="px-6 py-4">الكمية المتوفرة</th>
                                <th className="px-6 py-4 rounded-te-2xl">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody ref={listRef} className="divide-y divide-slate-100">
                            {filteredProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="font-bold text-slate-800">{product.name}</div>
                                        <div className="text-xs text-slate-400 mt-0.5">{product.barcode || 'بدون باركود'}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg text-xs font-medium">
                                            {product.category?.name || 'بدون قسم'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-emerald-600">
                                        {product.retail_price} د.ك
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                                            product.initial_quantity <= product.alert_quantity 
                                            ? 'bg-rose-50 text-rose-600' 
                                            : 'bg-emerald-50 text-emerald-600'
                                        }`}>
                                            {product.initial_quantity} وحدة
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleEdit(product)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDelete(product.id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Mobile Cards View */}
            <div className="md:hidden space-y-3 pb-20">
                {filteredProducts.map((product) => (
                    <div key={product.id} className="bg-white p-4 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-slate-100">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3 className="font-bold text-slate-800 text-base leading-tight">{product.name}</h3>
                                <p className="text-xs text-slate-400 mt-1">{product.category?.name || 'بدون قسم'}</p>
                            </div>
                            <span className="font-bold text-emerald-600 text-sm bg-emerald-50 px-2 py-1 rounded-lg">
                                {product.retail_price} د.ك
                            </span>
                        </div>
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-50">
                            <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                                product.initial_quantity <= product.alert_quantity 
                                ? 'bg-rose-50 text-rose-600' 
                                : 'bg-slate-100 text-slate-600'
                            }`}>
                                المخزون: {product.initial_quantity}
                            </span>
                            <div className="flex items-center gap-1">
                                <button onClick={() => handleEdit(product)} className="p-2 text-blue-600 bg-blue-50 rounded-lg">
                                    <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button onClick={() => handleDelete(product.id)} className="p-2 text-rose-600 bg-rose-50 rounded-lg">
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Mobile Floating Action Button */}
            <button 
                onClick={handleAdd}
                className="md:hidden fixed bottom-20 left-6 z-40 w-14 h-14 bg-emerald-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-emerald-600 active:scale-95 transition-all"
            >
                <Plus className="w-6 h-6" />
            </button>

            {/* Product Drawer */}
            <ProductDrawer 
                isOpen={isDrawerOpen} 
                onClose={() => setIsDrawerOpen(false)} 
                editingProduct={editingProduct} 
            />

        </div>
    );
};

export default Inventory;
