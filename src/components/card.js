import React, { memo } from 'react';
import Button from './button';
import formatNumber from '../ultils/formatMoney';
import { cacheData } from '../service-worker';

const Card = ({ product, selectedCard, setSelectedProducts, setDialogOpen }) => {
    return (
        <div key={product.product_id} className='w-full bg-white rounded border border-neutral-2-300 p-2 flex flex-col justify-between h-full'>
            <div>
                <div className='w-full aspect-square flex items-center justify-center'>
                    <img src={product.image} className='w-full h-full object-contain' alt={product.name} />
                </div>
                <div className='line-clamp-2 font-bold text-neutral-1-900 text-body-2 xl:text-body-1'>{product.name}</div>
                <div className='flex items-center justify-between font-medium mt-2 mb-0 text-body-2 xl:text-body-1'>
                    {product.discount_price === product.price
                        ? <div></div>
                        : <div className='line-through text-neutral-1-500'>{formatNumber(product.price)}</div>
                    }
                    <div className='text-primary-1'>{formatNumber(product.discount_price)}</div>
                </div>
                <div className='text-neutral-1-500 font-semibold text-caption-1 xl:text-body-2'>{product.description}</div>
            </div>
            <div className='w-full flex items-center gap-1 mt-4'>
                <Button
                    width={'w-1/2'}
                    height={'h-8'}
                    text={'Xem chi tiết'}
                    textSize={'text-body-2'}
                    textColor={'text-secondary-2'}
                    bgColor={'bg-white'}
                    onClick={() => { window.open(`https://gearvn.com/products/${product.haravan_handle}`, '_blank'); }}
                />
                <Button
                    width={'w-1/2'}
                    height={'h-8'}
                    text={'Chọn'}
                    textSize={'text-body-2'}
                    textColor={'text-white'}
                    bgColor={'bg-primary-1'}
                    onClick={() => {
                        const newItem = {
                            ...product,
                            type: selectedCard.value,
                            quantity: 1
                        };

                        setSelectedProducts((prevItems) => {
                            const existingItemIndex = prevItems.findIndex(item => item.type === newItem.type);

                            if (existingItemIndex !== -1) { // Nếu linh kiện đã có sản phẩm
                                const updatedItems = [...prevItems];
                                updatedItems[existingItemIndex] = newItem;
                                return updatedItems;
                            } else {
                                return [...prevItems, newItem];
                            }
                        });

                        cacheData(selectedCard.value, newItem);
                        setDialogOpen(false)
                    }}
                />
            </div>
        </div>
    )
}

export default memo(Card)
