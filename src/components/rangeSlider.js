import React, { useState } from "react";
import ReactSlider from "react-slider";
import Button from '../components/button';
import formatNumber from '../ultils/formatMoney';

const RangeSlider = ({ priceRange, setPrice }) => {
  const [curr, setCurr] = useState(priceRange);
  
  const step = (priceRange[1] - priceRange[0]) / 20

  return (
    <div className="absolute top-3 left-0 z-50 bg-white mx-auto shadow-xl my-5 border border-neutral-1-50 rounded-md px-2 py-3"
      onClick={(e) => e.stopPropagation()}>
      <div className="flex justify-between text-sm font-medium mb-2">
        <span>{formatNumber(priceRange[0])}</span>
        <span>{formatNumber(priceRange[1])}</span>
      </div>
      <ReactSlider
        className="relative h-2 bg-gray-200 rounded"
        thumbClassName="absolute w-6 h-6 bg-white border border-gray-300 rounded-full shadow -top-2 transform translate-y-1/2"
        value={curr}
        onChange={(newValues) => setCurr(newValues)}
        min={priceRange[0]}
        max={priceRange[1]}
        pearling
        minDistance={step}
        step={step}
        renderThumb={(props, state) => (
          <div
            {...props}
            className="absolute w-4 h-4 bg-white border border-gray-300 rounded-full shadow flex justify-center items-center -top-3 transform translate-y-1/2"
          >
            <div className="absolute -top-8 bg-neutral-1-800 text-white text-xs py-1 px-2 rounded">
              {formatNumber(state.valueNow)}
            </div>
          </div>
        )}
        renderTrack={(props, state) => {
          const trackColors = ["bg-gray-200", "bg-red-500", "bg-gray-200"];
          const trackIndex = state.index; // 0 = left, 1 = middle, 2 = right
          return (
            <div
              {...props}
              key={state.valueNow}
              className={`h-2 ${trackColors[trackIndex]} rounded`}
            />
          );
        }}
      />

      <div className="flex justify-between items-center mt-4 space-x-2 xl:space-x-4">
        <Button
          width={'w-32 xl:w-40'}
          height={'h-8'}
          text={'Xóa bộ lọc'}
          textSize={'text-body-2 xl:text-body-1'}
          textColor={'text-primary-1'}
          bgColor={'bg-white'}
          border={'border-2 border-primary-1'}
          onClick={() => {
            setCurr(priceRange)
            setPrice(priceRange)
          }}
        />
        <Button
          width={'w-32 xl:w-40'}
          height={'h-8'}
          text={'Xem kết quả'}
          textSize={'text-body-2 xl:text-body-1'}
          textColor={'text-white'}
          bgColor={'bg-primary-1'}
          onClick={() => setPrice(curr)}
        />
      </div>
    </div>
  );
};

export default RangeSlider;
