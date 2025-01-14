import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import logo_gear from '../assets/logo_gear.png'
import Button from '../components/button'
import Loader from '../components/loader';

import QuotationServices from '../services/quotation.services'
import formatNumber from '../ultils/formatMoney';

const Export = () => {
    const [searchParams] = useSearchParams();

    // Access query parameters
    const id = searchParams.get('id'); // Exampl
    const [isLoading, setIsLoading] = useState(true);
    const [products, setProducts] = useState(null)
    const [date, setDate] = useState(null)

    useEffect(() => {
        loadQuotation();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadQuotation = async () => {
        setIsLoading(true);
        try {
            const response = await QuotationServices.getQuotation(id);
            setProducts(response.category)
            setDate(response.created_on)
        } catch (error) {
            console.log(`Không tải được báo giá ${id}`, error)

        } finally {
            setIsLoading(false);
        }
    }

    const calculateTotal = () => {
        return Object.values(products).reduce((sum, item) => {
            return sum + item.discount_price * item.quantity;
        }, 0);
    }

    const handlePrint = () => {
        const printContent = document.getElementById("print-content").innerHTML;
        const styles = Array.from(document.querySelectorAll("style, link[rel='stylesheet']"))
            .map(style => style.outerHTML)
            .join("");

        const printWindow = window.open("", "_blank", "fullscreen=yes");

        if (printWindow) {
            printWindow.document.write(`
                <html>
                    <head>
                        ${styles}
                    </head>
                    <body>
                        ${printContent}
                    </body>
                </html>
            `);
            printWindow.document.close();
            // printWindow.print()
            setTimeout(() => printWindow.print(), 200)
        } else {
            console.error("printWindow is null !!!");
        }

    }

    const formatDate = (dateString) => {
        const [time, date] = dateString.split(" ");
        const [hours, minutes] = time.split(":");
        const [day, month, year] = date.split("/");

        return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year} ${hours}:${minutes}`;
    }

    return (
        <div className='px-5 pb-10 overflow-x-hidden'>
            {isLoading && <Loader />}

            <div id="print-content" className='rounded-lg shadow-shad1'>
                <div className="px-2 pt-3 pb-6 xl:px-4 w-full">
                    <section className='pb-5 w-full flex items-center justify-between border-b-[6px] border-primary-1'>
                        <div className='flex flex-col gap-8'>
                            <div>
                                <div className='font-bold text-primary-1 text-header-2 xl:text-heading-4'>CÔNG TY TNHH THƯƠNG MẠI GEARVN</div>
                                <div className='text-body-2 xl:text-body-1'>
                                    <span className='font-bold text-primary-1'>Trụ sở: </span>
                                    <span className='font-semibold text-neutral-1-900'>82 Hoàng Hoa Thám, Phường 12, Quận Tân Bình, TP. HCM </span>
                                </div>
                            </div>

                            <div>
                                <div className='flex items-center gap-4 xl:gap-10'>
                                    <div className='text-body-2 xl:text-body-1'>
                                        <span className='font-bold text-primary-1'>Hotline: </span>
                                        <span className='font-semibold text-neutral-1-900'>19005301</span>
                                    </div>
                                    <div className='text-body-2 xl:text-body-1'>
                                        <span className='font-bold text-primary-1'>Email: </span>
                                        <span className='font-semibold text-neutral-1-900'>cskh@gearvn.com</span>
                                    </div>
                                </div>

                                <div className='text-body-2 xl:text-body-1'>
                                    <span className='font-bold text-primary-1'>Website: </span>
                                    <span className='font-semibold text-neutral-1-900'>www.gearvn.com</span>
                                </div>
                            </div>
                        </div>

                        <img src={logo_gear} className='w-[30%] h-auto' alt='gearvn logo' />
                    </section>

                    <section className='w-full pt-5 border-b-[6px] border-primary-1'>
                        <div className='text-center text-heading-4 font-bold text-primary-1'>BÁO GIÁ SẢN PHẨM</div>
                        <div className='py-5 flex items-center justify-between text-body-2 font-bold text-neutral-1-900 xl:text-body-1'>
                            <div>Ngày báo giá: {date && formatDate(date)}</div>
                            <div>Đơn vị tính: <span className='text-primary-1'>VNĐ</span></div>
                        </div>

                        <table className="w-full break-words table-fixed text-neutral-1-900 text-body-2 xl:text-body-1">
                            <thead>
                                <tr className='break-words bg-primary-1 text-white border-2 border-neutral-1-900 border-collapse'>
                                    <th className='w-14 whitespace-normal py-2 border-2 border-neutral-1-900'>STT</th>
                                    <th className='py-2 border-2 border-neutral-1-900'>Tên sản phẩm</th>
                                    <th className='w-[12%] py-2 border-2 border-neutral-1-900'>Bảo hành</th>
                                    <th className='w-[10%] xl:w-[7%] py-2 border-2 border-neutral-1-900'>Số lượng</th>
                                    <th className='w-[14%] py-2 border-2 border-neutral-1-900'>Đơn giá</th>
                                    <th className='w-[16%] py-2 border-2 border-neutral-1-900 text-right px-1'>Thành tiền</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products && Object.entries(products).map(([key, options], index) => (
                                    <tr key={index}>
                                        <td className='border-2 border-neutral-1-900 px-1 font-medium text-center'>{index + 1}</td>
                                        <td className='border-2 border-neutral-1-900 px-1 font-medium'>{options.name}</td>
                                        <td className='border-2 border-neutral-1-900 px-1 font-medium text-right'>{options.warranty_month} Tháng</td>
                                        <td className='border-2 border-neutral-1-900 px-1 font-medium text-center'>{options.quantity}</td>
                                        <td className='border-2 border-neutral-1-900 px-1 font-medium text-right'>{formatNumber(options.discount_price || 0, ' VNĐ')}</td>
                                        <td className='border-2 border-neutral-1-900 px-1 font-bold text-right'>{formatNumber(options.discount_price * options.quantity, ' VNĐ')}</td>
                                    </tr>
                                ))}

                                {/* <tr>
                                    <td colSpan="6" className="col-span-full font-semibold border-2 border-neutral-1-900 px-1 bg-warning-1">
                                        Khuyến mãi build PC: <span className='text-primary-1'>5.000.000 VNĐ</span>
                                    </td>
                                </tr> */}

                                <tr className=''>
                                    <td colSpan="3" className='col-span-3 border-2 border-neutral-1-900 bg-white'></td>
                                    <td colSpan="2" className='col-span-2 border-2 border-neutral-1-900 bg-warning-1 font-semibold'>
                                        Phí vận chuyển
                                    </td>
                                    <td className='text-right border-2 border-neutral-1-900 bg-warning-1 font-bold px-1'>
                                        0 VNĐ
                                    </td>
                                </tr>

                                <tr className='bg-warning-1'>
                                    <td colSpan="3" className='col-span-3 border-2 border-neutral-1-900 bg-white'></td>
                                    <td colSpan="2" className='col-span-2 border-2 border-neutral-1-900 bg-warning-1 font-semibold'>
                                        Chi phí khác
                                    </td>
                                    <td className='text-right border-2 border-neutral-1-900 bg-warning-1 font-bold px-1'>
                                        0 VNĐ
                                    </td>
                                </tr>

                                <tr className='bg-warning-1'>
                                    <td colSpan="3" className='col-span-3 border-2 border-neutral-1-900 bg-white'></td>
                                    <td colSpan="2" className='col-span-2 border-2 border-neutral-1-900 bg-warning-1 font-semibold'>
                                        Tổng tiền đơn hàng
                                    </td>
                                    <td className='text-right border-2 border-neutral-1-900 bg-warning-1 font-bold px-1'>
                                        {products && formatNumber(calculateTotal(), ' VNĐ')}
                                    </td>
                                </tr>

                                <tr className='text-primary-1 bg-warning-1'>
                                    <td colSpan="3" className='col-span-3 border-2 border-neutral-1-900 bg-white'></td>
                                    <td colSpan="2" className='col-span-2 border-2 border-neutral-1-900 bg-warning-1 font-semibold'>
                                        Chiết khấu
                                    </td>
                                    <td className='text-right border-2 border-neutral-1-900 bg-warning-1 font-bold px-1'>
                                        0 VNĐ
                                    </td>
                                </tr>

                                <tr className='text-primary-1 bg-warning-1'>
                                    <td colSpan="3" className='col-span-3 border-2 border-neutral-1-900 bg-white'></td>
                                    <td colSpan="2" className='col-span-2 border-2 border-neutral-1-900 bg-warning-1 font-semibold'>
                                        Tổng tiền thanh toán sau chiết khấu
                                    </td>
                                    <td className='text-right border-2 border-neutral-1-900 bg-warning-1 font-bold px-1'>
                                        {products && formatNumber(calculateTotal(), ' VNĐ')}
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <p className='my-5 font-medium text-neutral-1-900'>
                            <span className='text-primary-1 font-bold'>Quý khách lưu ý: </span>
                            Giá bán, khuyến mãi của sản phẩm và tình trạng còn hàng có thể
                            bị thay đổi bất cứ lúc nào mà không kịp báo trước.
                        </p>
                    </section>

                    <section className='w-full pt-5 text-neutral-1-900 font-semibold flex items-center justify-between text-body-2 xl:text-body-1'>
                        <div>
                            <div>Để biết thêm chi tiết, vui lòng liên hệ</div>
                            <div>Hotline: 1900 5301 (8h00 - 21h00 hàng ngày)</div>
                        </div>
                        <div className='font-bold text-primary-1 text-header-2 xl:text-heading-4'>GEARVN CHÂN THÀNH CẢM ƠN QUÝ KHÁCH</div>

                    </section>
                </div>
            </div>

            <div className='mt-2 flex gap-3 items-center'>
                <Button
                    width={'w-64'}
                    height={'h-12'}
                    text={'IN BÁO GIÁ'}
                    textSize={'text-body-1'}
                    textColor={'text-white'}
                    bgColor={'bg-primary-1'}
                    onClick={handlePrint}
                />
                <Button
                    width={'w-64'}
                    height={'h-12'}
                    text={'LIÊN HỆ TƯ VẤN VIÊN'}
                    textSize={'text-body-1'}
                    textColor={'text-white'}
                    bgColor={'bg-primary-1'}
                />
            </div>
        </div>
    );
}

export default Export;
