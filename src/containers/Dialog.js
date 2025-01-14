import React, { useState, useEffect, useRef } from "react";
// import logo_intel from '../assets/logo_Intel.png'
// import logo_amd from '../assets/logo_amd.png'

import FilterBar from "./FilterBar";
import SearchBar from "../components/searchBar";
import Card from '../components/card';
import Button from "../components/button";

import { IoMdClose } from "react-icons/io"
import { FaAngleDown } from "react-icons/fa6";
import { FaArrowDownWideShort, FaArrowDownShortWide } from "react-icons/fa6";

import ProductServices from '../services/product.services'
import categories from '../data/category.json'

const sortOptions = [
  { value: "default", label: "Mặc định" },
  { value: "price-asc", label: "Giá Thấp - Cao", icon: <FaArrowDownShortWide /> },
  { value: "price-desc", label: "Giá Cao - Thấp", icon: <FaArrowDownWideShort /> },
];

const Dialog = ({ dialogOpen, selectedCard, setDialogOpen, setSelectedProducts, productFilters }) => {
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef(null);
  const debounceRef = useRef(null);

  const [isOpenSort, setIsOpenSort] = useState(false);
  const [selectedSort, setSelectedSort] = useState(sortOptions[0]);
  const [selectedBrand, setSelectedBrand] = useState(0)
  const [products, setProducts] = useState(null)

  const [filters, setFilters] = useState({})
  const [openFilter, setOpenFilter] = useState(null)
  const [selectedFilters, setSelectedFilters] = useState(productFilters || {})
  const [sendFilter, setSendFilter] = useState(productFilters || null);

  const [search, setSearch] = useState(null);

  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [priceRange, setPriceRange] = useState(null);
  const [price, setPrice] = useState(null);

  useEffect(() => {
    loadProduct(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSort, price]);

  useEffect(() => {
    if (search) {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        loadProduct(false);
      }, 800);

      return () => clearTimeout(debounceRef.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  useEffect(() => {
    if (sendFilter) {
      loadProduct(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sendFilter]);

  useEffect(() => {
    if (currentPage > 1) {
      loadProduct(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  useEffect(() => {
    if (dialogOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    // Dọn dẹp khi component bị hủy
    return () => {
      document.body.style.overflow = "auto";

    };
  }, [dialogOpen]);

  const loadProduct = async (new_page) => {
    setIsLoading(true);
    const category_id = categories.find(cat => cat.category_name === selectedCard.value).category_id;

    let firstLoad = false
    if (!products) {
      firstLoad = true
    }

    try {
      let requestParams = {
        page: currentPage,
        limit: 20,
        sort: selectedSort.value,
        name: search,
        category_id: category_id,
        filterAttributes: JSON.stringify(sendFilter)
      }

      if (price) {
        requestParams.price_from = price[0];
        requestParams.price_to = price[1];
      }

      const response = await ProductServices.getProduct(requestParams);

      if (new_page) {
        setProducts(prevProducts => [...prevProducts, ...response.products]);
      }
      else {
        setProducts(response.products)
        setTotalPages(Math.ceil(response.total / 20))
        setCurrentPage(1)
        setFilters(response.filterAttributes)
        firstLoad && setPriceRange([response.minPrice, response.maxPrice])
      }

    } catch (error) {
      console.log(`Không tải được danh sách sản phẩm thuộc category ${category_id}: `, error)

    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSort = (option) => {
    setSelectedSort(option);
    setIsOpenSort(false);
  };

  const setBrandFilters = (prevFilters, key, value) => {
    const currentFilter = prevFilters[key] || [];

    let newFilter
    if (value) {
      newFilter = currentFilter.includes(value)
        ? currentFilter.filter(item => item !== value) // Xóa nếu đã tồn tại
        : [...currentFilter, value];                   // Thêm nếu chưa tồn tại
    }
    return { ...prevFilters, [key]: newFilter };
  };

  const handleSelectBrand = (value, index) => {
    setSelectedBrand(index)
    setSelectedFilters(prevFilters => setBrandFilters(prevFilters, 'Hãng', value));
    if (sendFilter) {
      setSendFilter(prevFilters => setBrandFilters(prevFilters, 'Hãng', value));
    } else {
      setSendFilter(() => setBrandFilters({}, 'Hãng', value));
    }
  };

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center">

      <div className="fixed inset-0 bg-black bg-opacity-50"></div>

      <div onClick={() => setOpenFilter(null)}
        className="absolute bottom-0 left-0 w-full overflow-hidden bg-white rounded-lg xl:bottom-auto xl:left-auto xl:max-h-[800px] xl:max-w-[1200px]">

        <div className="flex items-center justify-between w-full bg-neutral-2-50 border-b border-neutral-1-100 py-4 px-3">
          <div className="flex items-center gap-3">
            <div className="text-header-1 font-bold text-neutral-1-900">{selectedCard.label}</div>
            {/* <div className="text-body-2 font-semibold py-1 px-2 text-primary-1 bg-primary-2 rounded">Giảm đến 30%</div> */}
          </div>
          <IoMdClose onClick={() => setDialogOpen(false)}
            className="cursor-pointer text-heading-3 font-bold text-neutral-1-700 hover:text-neutral-900" />
        </div>

        <div className="w-full p-3 xl:h-full">
          <div className="flex items-center gap-3 overflow-scroll scollbar-hide xl:overflow-auto">
            <div className="text-body-1 font-bold text-neutral-1-900 whitespace-pre">Chọn thương hiệu:</div>

            <div onClick={() => handleSelectBrand(null, 0)}
              className={`whitespace-pre w-fit text-body-1 rounded border-2 p-1 font-medium cursor-pointer
                ${selectedBrand === 0
                  ? 'bg-primary-2 text-primary-1 border-primary-1'
                  : 'bg-white text-neutral-1-500 border-neutral-1-400'}`}
            >Tất cả</div>

            {filters["Hãng"] && filters["Hãng"].map((brand, index) => (
              <div key={index + 1} onClick={() => handleSelectBrand(brand, index + 1)}
                className={`whitespace-pre w-fit text-body-1 rounded border-2 p-1 font-medium cursor-pointer
                ${selectedFilters["Hãng"]?.includes(brand)
                    ? 'bg-primary-2 text-primary-1 border-primary-1'
                    : 'bg-white text-neutral-1-500 border-neutral-1-400'}`}
              >{brand}</div>
            ))}

            {/* <img onClick={() => handleSetBrand(1, 'Intel')} src={logo_intel}
              className={`w-16 h-auto rounded border-2 p-2 cursor-pointer
                ${selectedBrand === 1 ? 'bg-primary-2 text-primary-1 border-primary-1'
                  : 'bg-white text-neutral-1-500 border-neutral-1-400'}`} alt="logo intel" />

            <img onClick={() => handleSetBrand(2, 'AMD')} src={logo_amd}
              className={`w-20 h-auto rounded border-2 px-1 cursor-pointer
              ${selectedBrand === 2 ? 'bg-primary-2 text-primary-1 border-primary-1'
                  : 'bg-white text-neutral-1-500 border-neutral-1-400'}`} alt="logo amd" /> */}
          </div>

          <div className="flex items-center gap-3 pr-5 justify-between pt-2 xl:pt-5 xl:justify-start">
            <div className="whitespace-pre text-body-1 font-bold text-neutral-1-900">Lọc theo:</div>
            <FilterBar
              filters={filters}
              openFilter={openFilter}
              setOpenFilter={setOpenFilter}
              selectedFilters={selectedFilters}
              setSelectedFilters={setSelectedFilters}
              setSendFilter={setSendFilter}
              priceRange={priceRange}
              price={price}
              setPrice={setPrice}
            />
          </div>

          {sendFilter && sendFilter === selectedFilters &&
            Object.keys(sendFilter)
              .filter(key => sendFilter[key] !== null && sendFilter[key] !== undefined).length > 0

            && <div className="flex items-center gap-3 pt-2 xl:pt-5">
              <div className="whitespace-pre text-body-1 font-bold text-neutral-1-900">Đang lọc theo:</div>
              <div className=" overflow-x-scroll scrollbar-hide xl:overflow-x-auto">
                <ul className='flex flex-wrap gap-2'>
                  {Object.entries(selectedFilters).map(([key, options], index) => (
                    options &&
                    <li key={index} className='px-2 py-1 flex items-center whitespace-pre bg-neutral-2-100 border border-gray-200 rounded-xl text-body-2 text-neutral-1-500 font-medium'>
                      {key}: {options.join(', ')}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          }

          <div className="flex items-center justify-between gap-3 mt-2 xl:mt-5">
            <div className="w-[40%] xl:w-1/2">
              <SearchBar setSearch={setSearch} />
            </div>
            <div className="w-1/2 flex items-center justify-end gap-3">
              <div className="font-bold text-neutral-1-900 text-body-2 whitespace-pre xl:text-body-1">Sắp xếp:</div>

              <div className="relative text-body-2 text-neutral-1-600 font-medium xl:text-body-1">

                <div onClick={() => setIsOpenSort(!isOpenSort)}
                  className='px-2 py-1 border-2 border-neutral-1-400 hover:bg-neutral-3-100 transition-all
                              cursor-pointer flex justify-center items-center gap-1 rounded-md'>
                  <span className="whitespace-pre">{selectedSort.label}</span>
                  <FaAngleDown />
                </div>

                {isOpenSort && (
                  <ul className="absolute right-0 z-50 w-36 bg-white border border-gray-200 rounded-lg shadow-lg xl:w-40">
                    {sortOptions.map((option, index) => (
                      <li
                        key={index}
                        className="p-1 mx-auto flex items-center gap-1 cursor-pointer whitespace-pre hover:bg-gray-100"
                        onClick={() => handleSelectSort(option)}
                      >
                        {option.icon}
                        {option.label}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

            </div>
          </div>

          <div ref={containerRef}
            className={`mt-3 w-full overflow-y-scroll scrollbar-hide bg-secondary-1 p-2 
              ${!isLoading && products?.length > 0 && 'grid'} grid-cols-2 gap-2 h-[450px] md:h-[300px] md:grid-cols-3 xl:h-auto xl:max-h-[430px] xl:p-3 xl:gap-3 xl:grid-cols-5`} >

            {isLoading &&
              <div className="w-full h-full flex items-center justify-center">
                <div className="relative w-10 h-10">
                  <div className="absolute w-full h-full border-4 border-primary-1 rounded-full animate-ping opacity-50"></div>
                  <div className="absolute w-full h-full border-4 border-primary-1 rounded-full animate-ping delay-150"></div>
                </div>
              </div>
            }

            {!isLoading && products?.length > 0 && products.map(p => (
              <Card
                product={p}
                setSelectedProducts={setSelectedProducts}
                setDialogOpen={setDialogOpen}
                selectedCard={selectedCard}
              />
            ))}

            {isLoading || currentPage === totalPages || products?.length === 0
              ? <></>
              : <div className="w-full flex justify-center col-span-full">
                <Button
                  width={'w-80'}
                  height={'h-8'}
                  text={'Hiển thị thêm sản phẩm'}
                  textSize={'text-body-1'}
                  textColor={'text-primary-1'}
                  bgColor={'bg-white'}
                  border={'border-2 border-primary-1'}
                  icon={<FaAngleDown className='animate-bounce' />}
                  onClick={() => setCurrentPage(curr => curr + 1)}
                />
              </div>
            }

            {products?.length === 0 &&
              <div className="text-center text-header-1 font-bold text-neutral-1-500">
                Không tìm thấy sản phẩm .
              </div>
            }
          </div>
        </div>
      </div>
    </div>

  );
}

export default Dialog
