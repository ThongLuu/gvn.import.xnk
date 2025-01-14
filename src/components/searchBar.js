import React, { memo } from 'react';
import { IoSearch } from "react-icons/io5";

const SearchBar = ({ onClick, setSearch }) => {

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearch(value);
    };

    return (
        <div className='pl-2 pr-3 py-0.5 rounded-2xl w-full cursor-pointer bg-neutral-3-50
                    flex items-center gap-1 border-2 border-neutral-1-400 
                    font-medium text-neutral-1-500 text-body-2 xl:text-body-1'
            onClick={onClick}>
            <IoSearch />
            <input
                type="text"
                placeholder="Bạn cần tìm gì"
                className='bg-transparent w-full outline-none focus:outline-none'
                onChange={handleInputChange}
            />
        </div>
    )
}

export default memo(SearchBar)
