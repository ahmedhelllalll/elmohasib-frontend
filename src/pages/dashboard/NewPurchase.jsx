import React, { useContext, useState, useEffect, useMemo } from 'react';
import { PurchaseContext } from '../../context/PurchaseContext';
import { SupplierContext } from '../../context/SupplierContext';
import { InventoryContext } from '../../context/InventoryContext';
import { SettingsContext } from '../../context/SettingsContext';
import SupplierDrawer from '../../components/suppliers/SupplierDrawer';
import ProductDrawer from '../../components/inventory/ProductDrawer';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Minus, Trash2, ArrowRight, Save, Truck, Package, ChevronDown, Check } from 'lucide-react';
import { toast } from 'sonner';

const NewPurchase = () => {
    const navigate = useNavigate();
    const { submitPurchase } = useContext(PurchaseContext);
    const { suppliers, addSupplier } = useContext(SupplierContext);
    const { products, addProduct } = useContext(InventoryContext);
    const { settings } = useContext(SettingsContext);

    const [selectedSupplierId, setSelectedSupplierId] = useState('');
    const [referenceNumber, setReferenceNumber] = useState(`REF-${Math.floor(100000 + Math.random() * 900000)}`);
    const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);
    const [searchTerm, setSearchTerm] = useState('');
    const [cart, setCart] = useState([]);
    
    // Financials
    const [discountAmount, setDiscountAmount] = useState(0);
    const [taxAmount, setTaxAmount] = useState(0);
    const [paidAmount, setPaidAmount] = useState(0);
    
    // Modals & Dropdowns
    const [isSupplierDrawerOpen, setIsSupplierDrawerOpen] = useState(false);
    const [isProductDrawerOpen, setIsProductDrawerOpen] = useState(false);
    const [isSavingSupplier, setIsSavingSupplier] = useState(false);
    const [isSavingProduct, setIsSavingProduct] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Custom Select State
    const [isSupplierSelectOpen, setIsSupplierSelectOpen] = useState(false);
    const [supplierSearch, setSupplierSearch] = useState('');

    // Filter products for quick add to cart
    const filteredProducts = useMemo(() => {
        if (!searchTerm) return [];
        return products.filter(p => 
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            (p.barcode && p.barcode.includes(searchTerm))
        ).slice(0, 5);
    }, [searchTerm, products]);

    const filteredSuppliers = useMemo(() => {
        if (!supplierSearch) return suppliers;
        return suppliers.filter(s => s.name.toLowerCase().includes(supplierSearch.toLowerCase()) || (s.company_name && s.company_name.toLowerCase().includes(supplierSearch.toLowerCase())));
    }, [supplierSearch, suppliers]);

    const addToCart = (product) => {
        const existing = cart.find(item => item.product_id === product.id);
        if (existing) {
            setCart(cart.map(item => item.product_id === product.id 
                ? { ...item, quantity: item.quantity + 1 } 
                : item
            ));
        } else {
            setCart([...cart, {
                product_id: product.id,
                name: product.name,
                quantity: 1,
                unit_cost: parseFloat(product.cost_price) || 0
            }]);
        }
        setSearchTerm(''); // Clear search after adding
    };

    const updateCartItem = (productId, field, value) => {
        setCart(cart.map(item => item.product_id === productId 
            ? { ...item, [field]: value } 
            : item
        ));
    };

    const removeFromCart = (productId) => {
        setCart(cart.filter(item => item.product_id !== productId));
    };

    // Calculations
    const subtotal = cart.reduce((acc, item) => acc + (item.quantity * item.unit_cost), 0);
    const total = (subtotal - discountAmount) + taxAmount;
    const paidAmountSafe = Math.min(paidAmount, total); // cap paid amount
    const remainingBalance = Math.max(0, total - paidAmountSafe);

    const handleSavePurchase = async () => {
        if (!selectedSupplierId) {
            toast.error("يرجى اختيار المورد");
            return;
        }
        if (cart.length === 0) {
            toast.error("يرجى إضافة منتجات للفاتورة");
            return;
        }

        setIsSubmitting(true);
        try {
            await submitPurchase({
                supplier_id: selectedSupplierId,
                reference_number: referenceNumber,
                purchase_date: purchaseDate,
                discount_amount: discountAmount,
                tax_amount: taxAmount,
                paid_amount: paidAmountSafe,
                items: cart.map(item => ({
                    product_id: item.product_id,
                    quantity: item.quantity,
                    unit_cost: item.unit_cost
                }))
            });
            navigate('/dashboard/purchases');
        } catch (error) {
            // Error handled by context
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSupplierSave = async (formData) => {
        setIsSavingSupplier(true);
        const success = await addSupplier(formData);
        setIsSavingSupplier(false);
        if (success) {
            setIsSupplierDrawerOpen(false);
        }
    };

    const handleProductSave = async (formData) => {
        setIsSavingProduct(true);
        const success = await addProduct(formData);
        setIsSavingProduct(false);
        if (success) {
            setIsProductDrawerOpen(false);
        }
    };

    return (
        <div className="h-full flex flex-col space-y-4 md:space-y-6 pb-40 md:pb-0">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => navigate(-1)}
                        className="p-2 bg-white rounded-full shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors"
                    >
                        <ArrowRight className="w-5 h-5 text-slate-600" />
                    </button>
                    <div>
                        <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">مشتريات جديدة</h2>
                        <p className="hidden md:block text-sm text-slate-500">قم بتسجيل البضائع الواردة وتحديث المخزون</p>
                    </div>
                </div>
                <button 
                    onClick={handleSavePurchase}
                    disabled={isSubmitting || cart.length === 0 || !selectedSupplierId}
                    className="hidden md:flex items-center gap-2 bg-emerald-500 text-white px-6 py-2.5 rounded-2xl font-bold text-sm shadow-sm hover:bg-emerald-600 disabled:opacity-50 transition-all"
                >
                    <Save className="w-4 h-4" />
                    {isSubmitting ? 'جاري الحفظ...' : 'حفظ الفاتورة'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 items-start">
                
                {/* Main Content: Products Search & Cart */}
                <div className="lg:col-span-2 flex flex-col space-y-4 order-2 lg:order-1">
                    {/* Search & Add Product */}
                    <div className="bg-white p-3 md:p-4 rounded-3xl shadow-sm border border-slate-100 flex gap-2 relative">
                        <div className="relative flex-1">
                            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                            <input
                                type="text"
                                placeholder="ابحث عن منتج (اسم، باركود)..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-4 pr-11 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/10 text-sm transition-all"
                            />
                            {/* Search Results Dropdown */}
                            {searchTerm && filteredProducts.length > 0 && (
                                <div className="absolute top-[calc(100%+0.5rem)] mt-2 w-full bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden py-2">
                                    {filteredProducts.map(p => (
                                        <button 
                                            key={p.id}
                                            onClick={() => addToCart(p)}
                                            className="w-full text-right px-5 py-3 hover:bg-slate-50 border-b border-slate-50/50 flex justify-between items-center group transition-colors"
                                        >
                                            <span className="font-bold text-slate-700 group-hover:text-emerald-600 transition-colors">{p.name}</span>
                                            <span className="text-emerald-500 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg text-xs" dir="ltr">{p.cost_price}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <button 
                            onClick={() => setIsProductDrawerOpen(true)}
                            className="flex items-center justify-center gap-2 bg-emerald-50 text-emerald-600 px-4 rounded-2xl font-bold text-sm hover:bg-emerald-100 transition-colors shrink-0"
                        >
                            <Package className="w-5 h-5" /> 
                            <span className="hidden sm:inline">جديد</span>
                        </button>
                    </div>

                    {/* Desktop Invoice Items Table */}
                    <div className="hidden md:block bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden min-h-[300px]">
                        <table className="w-full text-sm text-right">
                            <thead className="bg-slate-50/50 text-slate-500 border-b border-slate-100">
                                <tr>
                                    <th className="px-5 py-4">المنتج</th>
                                    <th className="px-5 py-4 w-32">الكمية</th>
                                    <th className="px-5 py-4 w-32">التكلفة</th>
                                    <th className="px-5 py-4 w-28">الإجمالي</th>
                                    <th className="px-5 py-4 w-12"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {cart.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-5 py-12 text-center text-slate-400 font-medium">
                                            لم يتم إضافة أي منتجات للفاتورة
                                        </td>
                                    </tr>
                                ) : (
                                    cart.map(item => (
                                        <tr key={item.product_id} className="hover:bg-slate-50/30 transition-colors">
                                            <td className="px-5 py-4 font-bold text-slate-800">{item.name}</td>
                                            <td className="px-5 py-4">
                                                <input 
                                                    type="number" 
                                                    min="1"
                                                    value={item.quantity}
                                                    onChange={(e) => updateCartItem(item.product_id, 'quantity', parseInt(e.target.value) || 0)}
                                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-center focus:ring-2 focus:ring-emerald-500/20"
                                                />
                                            </td>
                                            <td className="px-5 py-4">
                                                <input 
                                                    type="number" 
                                                    min="0"
                                                    step="0.01"
                                                    value={item.unit_cost}
                                                    onChange={(e) => updateCartItem(item.product_id, 'unit_cost', parseFloat(e.target.value) || 0)}
                                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-center focus:ring-2 focus:ring-emerald-500/20"
                                                />
                                            </td>
                                            <td className="px-5 py-4 font-black text-emerald-600" dir="ltr">
                                                {(item.quantity * item.unit_cost).toFixed(2)}
                                            </td>
                                            <td className="px-5 py-4">
                                                <button onClick={() => removeFromCart(item.product_id)} className="text-slate-300 hover:text-rose-500 p-2 hover:bg-rose-50 rounded-xl transition-all">
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Cart Cards */}
                    <div className="md:hidden space-y-3">
                        {cart.length === 0 ? (
                            <div className="bg-white p-8 rounded-3xl text-center border border-dashed border-slate-200">
                                <Package className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                                <span className="text-slate-400 font-medium">عربة المشتريات فارغة</span>
                            </div>
                        ) : (
                            cart.map(item => (
                                <div key={item.product_id} className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex flex-col gap-3">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-black text-slate-800 text-lg leading-tight">{item.name}</h4>
                                        <button onClick={() => removeFromCart(item.product_id)} className="text-slate-300 hover:text-rose-500 bg-slate-50 p-1.5 rounded-full">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="flex items-end gap-3">
                                        <div className="flex-1">
                                            <label className="text-[11px] text-slate-400 font-bold mb-1 block">سعر الوحدة</label>
                                            <input 
                                                type="number" 
                                                min="0"
                                                step="0.01"
                                                value={item.unit_cost}
                                                onChange={(e) => updateCartItem(item.product_id, 'unit_cost', parseFloat(e.target.value) || 0)}
                                                className="w-full bg-slate-50 border-none rounded-xl p-2.5 font-bold text-slate-700 text-center focus:ring-2 focus:ring-emerald-500/20" 
                                            />
                                        </div>
                                        <div className="flex-[1.2]">
                                            <label className="text-[11px] text-slate-400 font-bold mb-1 block">الكمية</label>
                                            <div className="flex items-center justify-between bg-slate-50 border-none rounded-xl p-1.5">
                                                <button onClick={() => updateCartItem(item.product_id, 'quantity', Math.max(1, item.quantity - 1))} className="p-1.5 bg-white text-rose-500 rounded-lg shadow-sm active:scale-95 transition-transform"><Minus className="w-4 h-4"/></button>
                                                <span className="font-black text-slate-800 text-base w-10 text-center">{item.quantity}</span>
                                                <button onClick={() => updateCartItem(item.product_id, 'quantity', item.quantity + 1)} className="p-1.5 bg-emerald-500 text-white rounded-lg shadow-sm active:scale-95 transition-transform"><Plus className="w-4 h-4"/></button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pt-3 mt-1 border-t border-slate-50 flex justify-between items-center">
                                        <span className="text-xs text-slate-500 font-bold">إجمالي المنتج</span>
                                        <span className="font-black text-emerald-600 text-lg">{(item.quantity * item.unit_cost).toFixed(2)}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Sidebar Content: Details & Financials */}
                <div className="flex flex-col space-y-4 order-1 lg:order-2">
                    
                    {/* Supplier & Date Metadata */}
                    <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 space-y-4">
                        
                        {/* Custom Supplier Dropdown */}
                        <div className="relative">
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">المورد <span className="text-rose-500">*</span></label>
                            <div className="flex gap-2 relative">
                                <div className="flex-1">
                                    <button 
                                        type="button"
                                        onClick={() => setIsSupplierSelectOpen(!isSupplierSelectOpen)}
                                        className="w-full flex items-center justify-between px-4 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-800 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                                    >
                                        <span className="truncate">
                                            {selectedSupplierId 
                                                ? suppliers.find(s => s.id === selectedSupplierId)?.name 
                                                : 'اختر المورد...'}
                                        </span>
                                        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                                    </button>
                                    
                                    {/* Dropdown Menu */}
                                    {isSupplierSelectOpen && (
                                        <>
                                            {/* Mobile Overlay */}
                                            <div className="fixed inset-0 z-40 md:hidden" onClick={() => setIsSupplierSelectOpen(false)}></div>
                                            
                                            <div className="absolute top-[calc(100%+0.5rem)] right-0 left-0 bg-white rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100 z-50 overflow-hidden flex flex-col max-h-[300px]">
                                                <div className="p-3 border-b border-slate-50 bg-slate-50/50">
                                                    <input 
                                                        type="text" 
                                                        placeholder="بحث عن مورد..."
                                                        value={supplierSearch}
                                                        onChange={(e) => setSupplierSearch(e.target.value)}
                                                        className="w-full bg-white border border-slate-100 rounded-xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-emerald-500/20"
                                                    />
                                                </div>
                                                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                                                    {filteredSuppliers.length === 0 ? (
                                                        <div className="text-center p-4 text-sm text-slate-400">لا يوجد موردين</div>
                                                    ) : (
                                                        filteredSuppliers.map(s => (
                                                            <button 
                                                                key={s.id}
                                                                onClick={() => { setSelectedSupplierId(s.id); setIsSupplierSelectOpen(false); }}
                                                                className={`w-full text-right px-4 py-3 rounded-xl text-sm font-bold flex justify-between items-center transition-colors ${selectedSupplierId === s.id ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700 hover:bg-slate-50'}`}
                                                            >
                                                                <span>{s.name} {s.company_name ? <span className="text-xs text-slate-400 font-normal mr-1">({s.company_name})</span> : ''}</span>
                                                                {selectedSupplierId === s.id && <Check className="w-4 h-4 text-emerald-500" />}
                                                            </button>
                                                        ))
                                                    )}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                                <button 
                                    onClick={() => setIsSupplierDrawerOpen(true)}
                                    className="p-3.5 bg-slate-50 text-emerald-600 rounded-2xl hover:bg-emerald-50 transition-colors shrink-0"
                                >
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">التاريخ</label>
                            <input 
                                type="date" 
                                value={purchaseDate}
                                onChange={(e) => setPurchaseDate(e.target.value)}
                                className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/10 text-sm font-bold text-slate-700 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">رقم المرجع (فاتورة المورد)</label>
                            <input 
                                type="text" 
                                value={referenceNumber}
                                onChange={(e) => setReferenceNumber(e.target.value)}
                                className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/10 text-sm font-bold text-slate-700 transition-all"
                                placeholder="مثال: INV-1002"
                            />
                        </div>
                    </div>

                    {/* Financial Summary */}
                    <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 space-y-4">
                        <h3 className="font-black text-slate-800 border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                            ملخص الفاتورة
                        </h3>
                        
                        <div className="flex justify-between items-center text-sm font-bold text-slate-500">
                            <span>المجموع الفرعي</span>
                            <span dir="ltr" className="text-slate-700">{subtotal.toFixed(2)}</span>
                        </div>
                        
                        <div className="flex items-center justify-between gap-4">
                            <span className="text-sm font-bold text-slate-500">الخصم</span>
                            <input 
                                type="number" 
                                min="0"
                                value={discountAmount}
                                onChange={(e) => setDiscountAmount(parseFloat(e.target.value) || 0)}
                                className="w-24 px-3 py-2 bg-slate-50 border-none rounded-xl text-sm font-bold text-center focus:ring-2 focus:ring-emerald-500/20 text-slate-700"
                            />
                        </div>

                        <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
                            <span className="text-sm font-bold text-slate-500">الضريبة</span>
                            <input 
                                type="number" 
                                min="0"
                                value={taxAmount}
                                onChange={(e) => setTaxAmount(parseFloat(e.target.value) || 0)}
                                className="w-24 px-3 py-2 bg-slate-50 border-none rounded-xl text-sm font-bold text-center focus:ring-2 focus:ring-emerald-500/20 text-slate-700"
                            />
                        </div>

                        <div className="flex justify-between items-end py-2">
                            <span className="font-black text-slate-800 text-lg">الإجمالي</span>
                            <span dir="ltr" className="font-black text-emerald-600 text-3xl">{total.toFixed(2)} <span className="text-sm text-emerald-600/60">{settings?.currency || 'ر.س'}</span></span>
                        </div>

                        {/* Payment Split */}
                        <div className="bg-slate-900 p-5 rounded-2xl space-y-4 mt-2 shadow-lg shadow-slate-900/10">
                            <div className="flex items-center justify-between gap-4">
                                <span className="font-bold text-sm text-slate-300">المدفوع نقداً</span>
                                <input 
                                    type="number" 
                                    min="0"
                                    max={total}
                                    value={paidAmount}
                                    onChange={(e) => setPaidAmount(parseFloat(e.target.value) || 0)}
                                    className="w-28 px-3 py-2 bg-slate-800 border-none rounded-xl font-bold text-emerald-400 text-center focus:ring-2 focus:ring-emerald-500/30"
                                />
                            </div>
                            <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-700/50">
                                <span className="font-bold text-sm text-slate-400">الآجل (المتبقي)</span>
                                <span className="font-black text-rose-400 text-xl" dir="ltr">{remainingBalance.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Actions Bottom Bar */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 shadow-[0_-10px_40px_rgb(0,0,0,0.08)] z-30 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4 px-5 rounded-t-3xl">
                <div className="flex items-center justify-between mb-4 px-1">
                    <span className="text-sm font-black text-slate-800">الإجمالي النهائي</span>
                    <span className="text-2xl font-black text-emerald-600">{total.toFixed(2)} <span className="text-xs text-slate-400 font-bold">{settings?.currency || 'ر.س'}</span></span>
                </div>
                <button 
                    onClick={handleSavePurchase}
                    disabled={isSubmitting || cart.length === 0 || !selectedSupplierId}
                    className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-4 rounded-2xl font-black text-base shadow-xl shadow-slate-900/20 disabled:opacity-50 active:scale-[0.98] transition-all"
                >
                    <Save className="w-5 h-5 text-emerald-400" />
                    {isSubmitting ? 'جاري الحفظ...' : 'تأكيد وحفظ الفاتورة'}
                </button>
            </div>

            <SupplierDrawer 
                isOpen={isSupplierDrawerOpen}
                onClose={() => setIsSupplierDrawerOpen(false)}
                onSave={handleSupplierSave}
                isLoading={isSavingSupplier}
            />
            
            <ProductDrawer 
                isOpen={isProductDrawerOpen}
                onClose={() => setIsProductDrawerOpen(false)}
                onSave={handleProductSave}
                isLoading={isSavingProduct}
            />
        </div>
    );
};

export default NewPurchase;
