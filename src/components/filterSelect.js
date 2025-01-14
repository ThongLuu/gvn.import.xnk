import React, { memo } from 'react';
import { FaAngleDown } from "react-icons/fa6";
import Button from '../components/button';

const FilterSelect = ({ index, text, icon, options, openFilter, setOpenFilter,
  selectedFilters, setSelectedFilters, setSendFilter, changeBg }) => {

  const handleFilterSelect = (text, op) => {
    setSelectedFilters(prevFilters => {
      const currentFilter = prevFilters[text] || [];

      // Kiểm tra xem `op` có trong mảng chưa
      const newFilter = currentFilter.includes(op)
        ? currentFilter.filter(item => item !== op) // Nếu có, xóa phần tử
        : [...currentFilter, op];                   // Nếu không, thêm phần tử vào mảng

      return {
        ...prevFilters,
        [text]: newFilter,
      };
    });
  };

  const handleFiltersRemove = key => {
    setSelectedFilters(prevFilters => {
      const { [key]: _, ...newFilters } = prevFilters; // Tách key cần xóa ra khỏi object
      return newFilters;
    });

    setSendFilter(null)
  };

  const handleFiltersSend = (e) => {
    e.stopPropagation()

    // remove key with empty arr
    const fitlers = Object.fromEntries(
      Object.entries(selectedFilters).filter(([key, value]) => !(Array.isArray(value) && value.length === 0))
    )

    setSelectedFilters(fitlers)
    setSendFilter(fitlers)
    setOpenFilter(null)
  };

  return (
    <div key={`filter ${index}`}
      className={`pl-2 pr-3 py-0.5 rounded-2xl w-fit cursor-pointer 
        flex items-center justify-center gap-1 
        border font-medium text-caption-1 xl:text-body-2
        ${(selectedFilters[text] && selectedFilters[text].length > 0) || (changeBg && text === 'Giá')
            ? 'bg-primary-2 text-primary-1 border-primary-1'
            : 'bg-white text-neutral-1-500 border-neutral-500'
          }`}
      onClick={(e) => {
        e.stopPropagation()
        setOpenFilter(index)
      }}
    >
      {icon ? icon : null}
      <div className='whitespace-pre'>{text}</div>
      {options ? <FaAngleDown /> : null}
      {options ?
        <div className={`absolute z-50 overflow-y-auto top-8 p-2 border bg-white border-gray-200 rounded-lg shadow-lg 
                      w-64 md:w-[450px] xl:w-96 max-h-32 md:max-h-40 xl:max-h-[170px] left-0 xl:left-auto
                        ${openFilter === index ? 'block' : 'hidden'}`}>
          <ul className='flex flex-wrap gap-2'>
            {options.map((op, index) => (
              <li
                key={index}
                className={`px-2 py-1 flex items-center cursor-pointer whitespace-pre border border-gray-200 rounded-xl
                            ${selectedFilters[text]?.includes(op) ? 'bg-primary-2 text-primary-1 border-primary-1' : 'text-neutral-1-500 bg-white border-gray-200 xl:hover:bg-gray-100'}`}
                onClick={() => handleFilterSelect(text, op)}
              >
                {op}
              </li>
            ))}
          </ul>

          <div className="flex justify-between items-center mt-4 space-x-2 xl:space-x-4">
            <Button
              width={'w-1/2'}
              height={'h-8'}
              text={'Xóa bộ lọc'}
              textSize={'text-body-2 xl:text-body-1'}
              textColor={'text-primary-1'}
              bgColor={'bg-white'}
              border={'border-2 border-primary-1'}
              onClick={(e) => {
                e.stopPropagation()
                handleFiltersRemove(text)
              }}
            />
            <Button
              width={'w-1/2'}
              height={'h-8'}
              text={'Xem kết quả'}
              textSize={'text-body-2 xl:text-body-1'}
              textColor={'text-white'}
              bgColor={'bg-primary-1'}
              onClick={(e) => handleFiltersSend(e)}
            />
          </div>
        </div>
        : null
      }
    </div>
  )
}

export default memo(FilterSelect)
