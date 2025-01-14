import React, { useRef, useState } from "react";

import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { FaAngleRight } from "react-icons/fa6";

import FilterSelect from '../components/filterSelect'
import RangeSlider from "../components/rangeSlider";

const FilterBar = ({ filters, openFilter, setOpenFilter, priceRange, price, setPrice,
  selectedFilters, setSelectedFilters, setSendFilter }) => {

  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scroll = (direction) => {
    const newIndex = direction === "left" ? activeIndex - 1 : activeIndex + 1;

    // Kiểm tra nếu index hợp lệ
    if (newIndex >= 0 && newIndex < Object.keys(filters).length) {
      const childElement = containerRef.current.children[newIndex];
      childElement.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      setActiveIndex(newIndex);
    }
  };

  return (
    <div className="relative w-3/4 xl:w-4/5">
      {/* Nút mũi tên trái */}
      {activeIndex > 0 && (
        <button key={'arrow-left'}
          className="absolute -left-6 top-1/2 transform -translate-y-1/2 bg-primary-1 p-1 rounded-full shadow xl:hidden"
          onClick={() => scroll("left")}
        >
          <FaAngleRight className="text-white text-body-2 font-semibold rotate-180" />
        </button>
      )}

      {/* Container cuộn */}
      <div
        ref={containerRef}
        className="flex items-center gap-4 overflow-x-scroll scrollbar-hide scroll-smooth xl:overflow-auto"
      >
        <FilterSelect
          index={0}
          text={'Giá'}
          icon={<RiMoneyDollarCircleLine />}
          openFilter={openFilter}
          setOpenFilter={setOpenFilter}
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
          setSendFilter={setSendFilter}
          changeBg={price && price !== priceRange ? true : false}
        />
        {openFilter === 0 ?
          (priceRange &&
            <RangeSlider
              priceRange={priceRange}
              price={price}
              setPrice={setPrice}
            />
          )
          : <></>}

        {Object.entries(filters).map(([key, options], index) => (
          key !== "Hãng" && (
            <FilterSelect
              key={index}
              index={index + 1}
              text={key}
              options={options}
              openFilter={openFilter}
              setOpenFilter={setOpenFilter}
              selectedFilters={selectedFilters}
              setSelectedFilters={setSelectedFilters}
              setSendFilter={setSendFilter}
            />
          )
        ))}
      </div>

      {/* Nút mũi tên phải */}
      {activeIndex < 4 && (
        <button key={'arrow-right'}
          className="absolute -right-6 top-3 transform -translate-y-1/2 p-1 bg-primary-1 rounded-full shadow xl:hidden"
          onClick={() => scroll("right")}
        >
          <FaAngleRight className="text-white text-body-2 font-semibold" />
        </button>
      )}
    </div>
  );
};

export default FilterBar;
