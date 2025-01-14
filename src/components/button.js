import React, {memo} from 'react';

const Button = ({text, hover, width, height, textSize, textColor, onClick, bgColor, border, icon}) => {
    return (
        <div 
            className={`${width} ${height} ${textSize} ${textColor} ${hover} ${bgColor} ${border} transition-all cursor-pointer flex justify-center items-center gap-1 relative rounded-md font-medium hover:brightness-90`}
            onClick={onClick}
        >
            {icon ? icon : null}
            <span>{text}</span>
        </div>
    )
}

export default memo(Button)
