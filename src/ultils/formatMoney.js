const formatNumber = (number, currency) => {
    if (number === undefined || number === null) return '0đ';
    return number.toLocaleString('vi-VI') + (currency ? currency : 'đ');
};
export default formatNumber;
