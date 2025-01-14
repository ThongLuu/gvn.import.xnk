import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import Button2 from '../components/button2';
import Button from '../components/button';
import Dialog from './Dialog';
import Popup from '../components/popup';
import Loader from '../components/loader';
import Toast from '../components/Toast';

import { TbReload } from "react-icons/tb";
import { TbDownload } from "react-icons/tb";
// import { FaCartPlus } from "react-icons/fa";
import { VscCallIncoming } from "react-icons/vsc";
import { IoIosArrowForward } from "react-icons/io";

import dayjs from 'dayjs';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

import CPU_img from '../assets/CPU.png'
import Main_img from '../assets/Main.png'
import VGA_img from '../assets/VGA.png'
import RAM_img from '../assets/RAM.png'
import SSD_img from '../assets/SSD.png'
import HDD_img from '../assets/HDD.png'
import Case_img from '../assets/Case.png'
import Nguon_img from '../assets/Nguon.png'
import Cooling_img from '../assets/Cooling.png'
import Mouse_img from '../assets/Mouse.png'
import Monitor_img from '../assets/Monitor.png'
import Keyboard_img from '../assets/Keyboard.png'
import Headset_img from '../assets/Headset.png'
import Windows_img from '../assets/Windows.png'

import formatNumber from '../ultils/formatMoney';
import { getAll, deleteData, deleteAll, updateProperty } from '../service-worker';
import QuotationServices from '../services/quotation.services'
import SharePopup from './SharePopup';

const Main = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [popupOpen, setPopupOpen] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sharePopupOpen, setSharePopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [productFilters, setProductFilters] = useState({});

  useEffect(() => {
    loadProductCache();
  }, []);

  useEffect(() => {
    const products = selectedProducts.filter(
      (item) => item.type === "Bộ vi xử lý" || item.type === "Bo mạch chủ"
    );

    if (products.length === 0) {
      setProductFilters({})
    }
    else {
      if (products[0].filterAttr?.Socket) {
        const socketArray = Object.keys(products[0].filterAttr.Socket).filter(
          (key) => products[0].filterAttr.Socket[key] === true
        );

        setProductFilters({ Socket: socketArray });
      }
    }

  }, [selectedProducts]);

  const loadProductCache = async () => {
    setIsLoading(true);
    try {
      const cachedProducts = await getAll();

      setSelectedProducts(cachedProducts);

    } catch (error) {
      console.log('Không lấy được danh sách sản phẩm đã chọn từ indexedDB')

    } finally {
      setIsLoading(false);
    }
  };

  const renderCard = (index, productImg, productName, productType) => {
    const product = selectedProducts.find((item) => item.type === productType);

    return product ?
      renderSelectedCard(index, product.image, product.name, product.price, product.discount_price, productType)
      : renderUnselectedCard(productImg, productName, productType)
  };

  const handleIncrement = async (productType) => {
    const p_quantity = selectedProducts.find((item) => item.type === productType).quantity + 1

    setSelectedProducts((prevItems) =>
      prevItems.map((item) =>
        item.type === productType ?
          { ...item, quantity: p_quantity }
          : item
      )
    );

    await updateProperty(productType, 'quantity', p_quantity);
  };

  const handleDecrement = async (productType) => {
    const p_quantity = selectedProducts.find((item) => item.type === productType).quantity
    const new_quantity = p_quantity > 1 ? p_quantity - 1 : 1

    setSelectedProducts((prevItems) =>
      prevItems.map((item) =>
        item.type === productType ? { ...item, quantity: new_quantity } : item
      )
    );

    await updateProperty(productType, 'quantity', new_quantity);
  }

  const handleConfirm = async () => {
    const type = selectedCard.value
    setSelectedProducts((prevItems) => prevItems.filter((item) => item.type !== type));

    await deleteData(type);

    setSelectedCard(null)
    setPopupOpen(null);
  };

  const handleQuotation = async () => {
    if (selectedProducts.length === 0) {
      setToast({
        message: "Vui lòng chọn sản phẩm !",
        type: "error"
      })
    }
    else {
      const transformed = selectedProducts.reduce((acc, item) => {
        if (!acc.category) {
          acc.category = {};
        }

        if (!acc.category[item.category_id]) {
          acc.category[item.category_id] = { ...item }; // Copy all attributes from the item
          acc.category[item.category_id].quantity = 0;  // Initialize quantity
        }

        acc.category[item.category_id].quantity += item.quantity;

        return acc;
      }, {});

      setIsLoading(true);
      try {
        const response = await QuotationServices.createQuotation(transformed);
        window.open(`/pages/export-build-pc?id=${response.id}`, '_blank');

      } catch (error) {
        console.log(`Lỗi lưu báo giá`, error)
        
      } finally {
        setIsLoading(false);
      }
    }
  };

  const renderUnselectedCard = (img, productName, productTitle) => {
    return (
      <div className='flex items-center justify-between bg-neutral-2-50 py-3 rounded-lg px-2 xl:px-5'>
        <div className='flex items-center gap-4'>
          <img src={img} className='w-14 aspect-square' alt={productName + '_img'} />
          <div className='font-bold text-neutral-1-900 text-body-1 xl:text-header-2'>{productName}</div>
        </div>
        <Button
          width={'w-[88px]'}
          height={'h-8'}
          text={'Chọn'}
          textSize={'text-body-2'}
          textColor={'text-white'}
          bgColor={'bg-primary-1'}
          onClick={() => {
            setDialogOpen(true)
            setSelectedCard({
              value: productTitle,
              label: productName
            })
          }}
        />
      </div>
    );
  }

  const handleReset = async () => {
    setSelectedProducts([]);
    await deleteAll();
  };

  const renderSelectedCard = (index, img, text, price1, price2, productType) => {
    const discount_rate = Math.round((price1 - price2) / price1 * 100)

    return (
      <div key={'p_card ' + index} className='flex items-center justify-between bg-neutral-2-50 p-2 h-[100px] rounded-lg'>
        <div className='h-full flex-1 flex items-center gap-3'>
          <div className='overflow-hidden bg-white border border-neutral-3-100 rounded-md'>
            <div className='w-20'>
              <img src={img} className='w-full aspect-square' alt={text + '_img'} />
            </div>
          </div>

          <div className='h-full flex-1 flex flex-col justify-between'>
            <div className='font-bold text-neutral-1-700 line-clamp-2 text-body-2 xl:text-body-1'>{text}</div>
            <div className='flex items-center justify-start gap-2 xl:gap-3'>
              <div>{quantityBox(productType)}</div>
              <div onClick={() => {
                setPopupOpen(`popup ${index}`)
                setSelectedCard({
                  value: productType,
                  label: text
                })
              }}
                className='cursor-pointer underline text-secondary-3 text-body-2 xl:text-[17px]'>
                Xóa
              </div>
            </div>
          </div>

        </div>

        <div className='h-full flex flex-col justify-between items-end w-32 xl:w-44'>
          <div className='flex flex-col justify-between items-end'>
            <div className='text-primary-1 font-bold text-body-1 xl:text-[19px]'>{formatNumber(price2)}</div>

            {price1 === price2
              ? <></>
              : <div className='flex items-center gap-1'>
                <div className="font-semibold p-1 text-primary-1 bg-primary-2 rounded text-[11px] xl:text-caption-2 ">Giảm {discount_rate}%</div>
                <div className='line-through text-neutral-1-400 text-caption-1 xl:text-body-2'>{formatNumber(price1)}</div>
              </div>
            }
          </div>

          <div onClick={() => {
            setDialogOpen(true)
            setSelectedCard({
              value: productType,
              label: text
            })
          }}
            className='cursor-pointer flex items-center gap-1 text-secondary-3 font-semibold text-[13px] xl:text-[14px]'>
            <div>Thay đổi</div>
            <IoIosArrowForward />
          </div>

        </div>
      </div>
    )
  }

  const renderTotalBlockExcel = (worksheet, lineNumber, text1, text2, textStyle = null) => {

    worksheet.mergeCells(`A${lineNumber}:D${lineNumber}`);
    worksheet.getCell(`A${lineNumber}`).value = ""
    worksheet.getCell(`A${lineNumber}`).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FEE699" }, // Orange background
    };
    worksheet.getCell(`A${lineNumber}`).border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };


    worksheet.mergeCells(`E${lineNumber}:F${lineNumber}`);
    worksheet.getCell(`E${lineNumber}`).value = text1
    if (textStyle) {

      worksheet.getCell(`E${lineNumber}`).font = textStyle
    }
    worksheet.getCell(`E${lineNumber}`).alignment = { horizontal: "left", vertical: "middle" };
    worksheet.getCell(`E${lineNumber}`).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FEE699" }, // Orange background
    };
    worksheet.getCell(`E${lineNumber}`).border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };


    worksheet.getCell(`G${lineNumber}`).value = text2
    if (textStyle) {

      worksheet.getCell(`G${lineNumber}`).font = textStyle
    } else {

      worksheet.getCell(`G${lineNumber}`).font = { bold: true }
    }
    worksheet.getCell(`G${lineNumber}`).alignment = { horizontal: "right", vertical: "middle" }; // Enable wrap text
    worksheet.getCell(`G${lineNumber}`).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FEE699" }, // Orange background
    };
    worksheet.getCell(`G${lineNumber}`).border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };


  }

  const handleDownloadExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Báo Giá", {

      views: [{ showGridLines: false }], // Hides the gridlines
    });
    // const imageId = workbook.addImage({
    //   base64: logoBase64,
    //   extension: "png",
    // });
    // worksheet.addImage(imageId, "A1:D5"); // Position for the logo

    // Merge header cells for the company name and info
    worksheet.mergeCells("A2:D2");
    worksheet.getCell("A2").value = "CÔNG TY TNHH THƯƠNG MẠI GEARVN";
    worksheet.getCell("A2").alignment = { horizontal: "left", vertical: "middle" };
    worksheet.getCell("A2").font = { bold: true, size: 18, color: { argb: "FF0000" } };

    worksheet.mergeCells("A3:D3");
    worksheet.getCell("A3").value = {
      richText: [
        {
          text: "Trụ sở: ", // The part to be red
          font: { color: { argb: "FFFF0000" }, bold: true }, // Red color and bold font
        },
        {
          text: "82 Hoàng Hoa Thám, Phường 12, Quận Tân Bình, TP. HCM", // The remaining text
          font: { color: { argb: "FF000000" }, bold: true }, // Black color (default)
        },
      ],
    };
    worksheet.getCell("A3").alignment = { horizontal: "left", vertical: "middle" };
    worksheet.getCell("A3").font = { bold: true, size: 11 }

    worksheet.mergeCells("A4:D4");
    worksheet.getCell("A4").value = {
      richText: [
        {
          text: "Hotline: ", // The part to be red
          font: { color: { argb: "FFFF0000" }, bold: true }, // Red color and bold font
        },
        {
          text: "1900530", // The remaining text
          font: { color: { argb: "FF000000" }, bold: true }, // Black color (default)
        },
        {
          text: "          ", // The remaining text
          font: { color: { argb: "FF000000" } }, // Black color (default)
        },
        {
          text: "Email: ", // The part to be red
          font: { color: { argb: "FFFF0000" }, bold: true }, // Red color and bold font
        },
        {
          text: "cskh@gearvn.com", // The remaining text
          font: { color: { argb: "FF000000" }, bold: true }, // Black color (default)
        },
      ],
    };
    worksheet.getCell("A4").alignment = { horizontal: "left", vertical: "middle" };
    worksheet.getCell("A4").font = { bold: true, size: 11 }

    worksheet.mergeCells("A5:D5");
    worksheet.getCell("A5").value = {
      richText: [
        {
          text: "Website: ", // The part to be red
          font: { color: { argb: "FFFF0000" }, bold: true }, // Red color and bold font
        },
        {
          text: "www.gearvn.com", // The remaining text
          font: { color: { argb: "FF000000" }, bold: true }, // Black color (default)
        },
      ],
    };
    worksheet.getCell("A5").alignment = { horizontal: "left", vertical: "middle" };
    worksheet.getCell("A5").font = { bold: true, size: 11 }

    worksheet.mergeCells(`A6:G6`);
    worksheet.getCell(`A6`).border = {
      bottom: {
        style: "thick", // Bold/thick border
        color: { argb: "FFFF0000" }, // Red color
      },
    };

    worksheet.mergeCells("A8:H8");
    worksheet.getCell("A8").value = "BÁO GIÁ SẢN PHẨM";
    worksheet.getCell("A8").alignment = { horizontal: "center", vertical: "middle" };
    worksheet.getCell("A8").font = { bold: true, size: 23, color: { argb: "FF0000" } };

    worksheet.mergeCells("A9:D9");
    worksheet.getCell("A9").value = `Ngày báo giá: ${dayjs().format('DD/MM/YYYY HH:mm')}`;
    worksheet.getCell("A9").alignment = { horizontal: "left", vertical: "middle" };
    worksheet.getCell("A9").font = { bold: true, size: 11 };


    worksheet.mergeCells("E9:G9");
    worksheet.getCell("E9").value = {
      richText: [
        {
          text: "Đơn vị tính: ", // The remaining text
          font: { color: { argb: "FF000000" }, bold: true }, // Black color (default)
        },
        {
          text: "VND", // The part to be red
          font: { color: { argb: "FFFF0000" }, bold: true }, // Red color and bold font
        },
      ],
    };
    worksheet.getCell("E9").alignment = { horizontal: "right", vertical: "middle" };
    worksheet.getCell("E9").font = { bold: true, size: 11 };

    worksheet.addRow([]);

    // Add table headers with borders and background color
    const headers = [
      "STT",
      "Mã sản phẩm",
      "Tên sản phẩm",
      "Bảo hành",
      "Số lượng",
      "Đơn giá",
      "Thành tiền",
    ];
    const headerRow = worksheet.addRow(headers);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFF" } };
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF0000" }, // Orange background
      };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });
    worksheet.columns = [
      { width: 5 },
      { width: 30 },
      { width: 50 },
      { width: 15 },
      { width: 10 },
      { width: 20 },
      { width: 20 },
    ];
    // Add data rows
    const data = selectedProducts.map((item, index) => {
      return [index + 1, item.sku, item.name, `${item.warranty_month} Tháng`, item.quantity, formatNumber(item.discount_price || 0, " VNĐ"), formatNumber(item.discount_price * item.quantity || 0, " VNĐ")]
    })
    data.forEach((row) => {
      const dataRow = worksheet.addRow(row);
      dataRow.eachCell((cell, colNumber) => {
        if (colNumber == 3 || colNumber == 2) {
          cell.alignment = { horizontal: "left", vertical: "middle", wrapText: true }; // Enable wrap text
        }

        if (colNumber >= 5) {
          cell.alignment = { horizontal: "right", vertical: "middle", wrapText: true }; // Enable wrap text
        }
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });



    const totalProductRow = selectedProducts.length
    let lineNumber = 11 + totalProductRow + 1



    renderTotalBlockExcel(worksheet, lineNumber, "Phí vận chuyển", "0 VNĐ")
    lineNumber = lineNumber + 1
    renderTotalBlockExcel(worksheet, lineNumber, "Chi phí khác", "0 VNĐ")
    lineNumber = lineNumber + 1
    renderTotalBlockExcel(worksheet, lineNumber, "Tổng tiền đơn hàng", calculateTotal())
    lineNumber = lineNumber + 1
    renderTotalBlockExcel(worksheet, lineNumber, "Chiết khấu", 0, { color: { argb: "FFFF0000" }, bold: true })
    lineNumber = lineNumber + 1
    renderTotalBlockExcel(worksheet, lineNumber, "Tổng tiền thanh toán sau chiết khấu", calculateFinalTotal(), { color: { argb: "FFFF0000" }, bold: true })


    worksheet.addRow([])

    lineNumber = lineNumber + 2

    worksheet.mergeCells(`A${lineNumber}:G${lineNumber}`);
    worksheet.getCell(`A${lineNumber}`).value = {
      richText: [
        {
          text: "Quý khách lưu ý: ", // The part to be red
          font: { color: { argb: "FFFF0000" }, bold: true }, // Red color and bold font
        },
        {
          text: "Giá bán, khuyến mại của sản phẩm và tình trạng còn hàng có thể bị thay đổi bất cứ lúc nào mà không kịp báo trước.", // The remaining text
          font: { color: { argb: "FF000000" }, bold: true }, // Black color (default)
        },
      ],
    };
    worksheet.getCell(`A${lineNumber}`).alignment = { horizontal: "left", vertical: "middle" };
    worksheet.getCell(`A${lineNumber}`).font = { italic: false, size: 11 };

    lineNumber = lineNumber + 1


    worksheet.mergeCells(`A${lineNumber}:G${lineNumber}`);
    worksheet.getCell(`A${lineNumber}`).border = {
      bottom: {
        style: "thick", // Bold/thick border
        color: { argb: "FFFF0000" }, // Red color
      },
    };

    lineNumber = lineNumber + 2


    worksheet.mergeCells(`A${lineNumber}:C${lineNumber}`);
    worksheet.getCell(`A${lineNumber}`).value = "Để biết thêm chi tiết, vui lòng liên hệ"
    worksheet.getCell(`A${lineNumber}`).alignment = { horizontal: "left", vertical: "middle" };

    worksheet.mergeCells(`A${lineNumber + 1}:C${lineNumber + 1}`);
    worksheet.getCell(`A${lineNumber + 1}`).value = "Hotline: 1900 5301 (8h00 - 21h00 hàng ngày)"
    worksheet.getCell(`A${lineNumber + 1}`).alignment = { horizontal: "left", vertical: "middle" };


    worksheet.mergeCells(`D${lineNumber}:G${lineNumber + 1}`);

    worksheet.getCell(`D${lineNumber}`).value = "GEARVN CHÂN THÀNH CẢM ƠN QUÝ KHÁCH"
    worksheet.getCell(`D${lineNumber}`).alignment = { horizontal: "right", vertical: "middle" };
    worksheet.getCell(`D${lineNumber}`).font = { bold: true, size: 18, color: { argb: "FF0000" } };

    // Save as Excel file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    saveAs(blob, "BaoGia_Gearvn.xlsx");

  };

  const quantityBox = (productType) => {
    return (
      <div className="px-2 w-[72px] text-secondary-3 font-semibold flex items-center border border-secondary-3 rounded-md justify-between">
        <button
          onClick={() => handleDecrement(productType)}
          className='text-body-2 xl:text-body-1'
        >
          -
        </button>
        <span className='text-caption-1 xl:text-body-2'>{
          selectedProducts.find((item) => item.type === productType).quantity}</span>
        <button
          onClick={() => handleIncrement(productType)}
          className='text-body-2 xl:text-body-1'
        >
          +
        </button>
      </div>
    );
  }

  const calculateTotal = () => {
    return formatNumber(selectedProducts.reduce((sum, item) => {
      return sum + item.discount_price * item.quantity;
    }, 0), ' VNĐ');
  }

  const calculatePromotion = () => {
    return formatNumber(selectedProducts.reduce((sum, item) => {
      return sum + (item.price - item.discount_price) * item.quantity;
    }, 0), ' VNĐ');
  }

  const calculateFinalTotal = () => {
    return formatNumber(selectedProducts.reduce((sum, item) => {
      return sum + item.discount_price * item.quantity;
    }, 0), ' VNĐ');
  }

  const handleShare = () => {
    if (selectedProducts.length === 0) {
      setToast({
        message: "Vui lòng chọn sản phẩm !",
        type: "error"
      })
    }
    else {
      setSharePopupOpen(true)
    }
  }
  return (
    <div className='pb-32 relative xl:pb-20 overflow-x-hidden'>
      {isLoading && <Loader />}
      {toast &&
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      }

      <section className="pb-2 w-full mx-auto">
        <div className="lg:px-2 2xl:px-0">
          <div className='px-2 pt-3 pb-2 border border-neutral-200 shadow-shad1 rounded-lg'>
            <div className='font-bold text-neutral-1-900 text-header-2 md:text-header-1'>Build PC</div>
            <p className='font-medium text-neutral-1-500 text-body-2 md:text-body-1'>Chọn các linh kiện máy tính bạn cần để xây dựng cấu hình máy</p>
          </div>
        </div>
      </section>

      <section className="w-full mx-auto">
        <div className="lg:px-2 2xl:px-0">
          <div className='flex flex-col justify-between gap-3 xl:flex-row'>

            <div className='xl:w-[60%]'>
              <div className='pb-3 flex flex-col-reverse justify-between gap-2 md:flex-row md:items-center'>
                <Button2
                  text={'Chọn lại từ đầu'}
                  icon={<TbReload className='text-body-1 scale-x-[-1]' />}
                  bgColor={'white'}
                  onClick={handleReset}
                  hover={'hover:bg-neutral-3-50'}
                />

                <div className='flex items-center justify-between gap-5'>
                  <Button2
                    text={'Xem và in'}
                    bgColor={'bg-secondary-1'}
                    hover={'hover:bg-neutral-3-50'}
                    onClick={handleQuotation}
                  />
                  <Button2
                    text={'Chia sẻ cấu hình'}
                    bgColor={'bg-secondary-1'}
                    hover={'hover:bg-neutral-3-50'}
                    onClick={handleShare}
                  />
                  <Button2
                    text={'Tải file cấu hình'}
                    icon={<TbDownload className='text-body-1' />}
                    bgColor={'bg-secondary-1'}
                    onClick={handleDownloadExcel}
                  />
                </div>
              </div>

              <div className='flex flex-col gap-2 p-2 rounded-lg shadow-shad1'>
                {renderCard(0, CPU_img, 'CPU', 'Bộ vi xử lý')}
                {renderCard(1, Main_img, 'Mainboard', 'Bo mạch chủ')}
                {renderCard(2, VGA_img, 'Card màn hình', 'Card màn hình')}

                {renderCard(3, RAM_img, 'RAM', 'RAM')}
                {renderCard(4, SSD_img, 'Ổ cứng SSD', 'Ổ cứng SSD')}
                {renderCard(5, HDD_img, 'Ổ cứng HDD', 'Ổ cứng HDD')}

                {renderCard(6, Case_img, 'Case máy tính', 'Vỏ máy tính')}
                {renderCard(7, Nguon_img, 'Nguồn máy tính', 'Nguồn máy tính')}
                {renderCard(8, Cooling_img, 'Tản nhiệt CPU', 'Tản nhiệt')}

                {renderCard(9, Monitor_img, 'Màn hình', 'Màn hình')}
                {renderCard(10, Mouse_img, 'Chuột', 'Chuột')}
                {renderCard(11, Keyboard_img, 'Bàn phím', 'Bàn phím')}
                {renderCard(12, Headset_img, 'Tai nghe gaming', 'Tai nghe gaming')}
                {renderCard(13, Windows_img, 'Phần mềm', 'Phần mềm')}
              </div>
            </div>

            <div className='xl:w-[40%]'>
              <div className='xl:mt-[52px]'>

                <div className='fixed bottom-8 z-10 bg-white w-full xl:static rounded-lg shadow-shad1 px-3 pt-5 pb-3'>
                  <div className='pb-2 flex items-center justify-between font-bold text-header-1'>
                    <div className='text-neutral-1-900'>Tạm tính:</div>
                    <div className='text-primary-1 '>{calculateFinalTotal()}</div>
                  </div>
                  <div className='flex justify-end gap-1 text-header-2 font-semibold'>
                    <div className='text-neutral-1-500'>Giá chưa bao gồm Ưu đãi Build PC.</div>
                    <div onClick={() => {
                      window.open("https://gearvn.com/pages/uu-dai-build-custom-pc", "_blank")
                    }}
                      className='cursor-pointer underline text-secondary-2'>
                      Xem chi tiết
                    </div>
                    {/* <Link to="https://gearvn.com/pages/uu-dai-build-custom-pc" className='text-secondary-2 underline'>Xem chi tiết</Link> */}
                  </div>
                </div>

                {/* <div className='mt-3 rounded-lg shadow-shad1 p-2 flex items-center gap-2'>
                  <Button
                    width={'w-1/2'}
                    height={'h-12'}
                    text={'Thêm vào giỏ'}
                    textSize={'text-body-1'}
                    textColor={'text-primary-1'}
                    bgColor={'bg-white'}
                    border={'border-2 border-primary-1'}
                    icon={<FaCartPlus />}
                  />
                  <Button
                    width={'w-1/2'}
                    height={'h-12'}
                    text={'Mua ngay'}
                    textSize={'text-body-1'}
                    textColor={'text-white'}
                    bgColor={'bg-primary-1'}
                  />
                </div> */}

                <div className='mt-3 rounded-lg shadow-shad1 p-2 w-fit mx-auto flex flex-col items-center justify-center'>
                  <div className='text-[17px] px-1 text-neutral-1-500 font-semibold'> Bạn cần thắc mắc về cấu hình?</div>
                  <Button2
                    text={'Liên hệ tư vấn viên'}
                    icon={<VscCallIncoming className='text-body-1 font-bold' />}
                    bgColor={'bg-secondary-1'}
                  />
                </div>

                <div className='mt-3 rounded-lg shadow-shad1 p-2 w-fit mx-auto flex flex-col items-center justify-center'>
                  <img src="https://theme.hstatic.net/200000722513/1001090675/14/banner_facebook_ads_vuong_large.png" alt="Build PC" className="w-full h-auto" />
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {dialogOpen &&
        <Dialog
          dialogOpen={dialogOpen}
          selectedCard={selectedCard}
          setDialogOpen={setDialogOpen}
          setSelectedProducts={setSelectedProducts}
          productFilters={
            selectedCard.value === "Bộ vi xử lý" || selectedCard.value === "Bo mạch chủ"
              ? productFilters
              : null
          }
        />
      }

      {sharePopupOpen &&
        <SharePopup
          sharePopupOpen={sharePopupOpen}
          setSharePopupOpen={setSharePopupOpen}
          selectedProducts={selectedProducts}
        />
      }

      {popupOpen &&
        <Popup
          title={'Xóa sản phẩm'}
          text={'Bạn có muốn xoá sản phẩm này ?'}
          isOpen={popupOpen}
          onClose={() => setPopupOpen(null)}
          onConfirm={handleConfirm}
        />
      }
    </div>
  );
}

export default Main;
