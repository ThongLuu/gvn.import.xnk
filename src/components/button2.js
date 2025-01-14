import React, { memo } from 'react';

const Button2 = ({ text, icon, bgColor, hover, onClick }) => {
    return (
        <div className='p-1 rounded-lg shadow-shad1 w-fit cursor-pointer'
            onClick={onClick}>
            <div className={`${bgColor} ${hover} transition-all flex items-center gap-1 font-medium text-secondary-2 px-1 py-1 rounded xl:px-3`}>
                {icon ? icon : null}
                <div className='text-body-2 xl:text-body-1 tracking-tight'>{text}</div>
            </div>
        </div>
    )
}

export default memo(Button2)
