

//类型转换
const typeSwitch = function(str) {
    let type;
    switch(str) {
        case 'DATE_TIME': type = 'date'; break;
        case 'SINGLE_INPUT': type = 'text'; break;
        case 'SINGLE_COMBOX': type = 'field-noInput'; break;
        case 'TABLE': type = 'field-hide'; break;
        case 'GATHER': type = 'field-noInput'; break;
        case 'NUMBER_INPUT': type = 'number'; break;
        default: type = "text";
    }
    return type;
}

//时间转换
const formateDate = function (date) {
    if (!date) {
        return '';
    }
    let newDate = new Date(date);
    let year = newDate.getFullYear();
    let month = newDate.getMonth() + 1;
    let day = newDate.getDate();
    month = month > 9 ? month : '0' + month;
    day = day > 9 ? day : '0' + day;
    if (type == 'date') {
        return year + '-' + month + '-' + day;
    }
    if (type == 'month') {
        return year + '-' + month;
    }
    if (type == 'year') {
        return year;
    }
};


export default {
    typeSwitch,
    formateDate
}