// 引入 jquery
import $ from 'jquery';

export const verficationForm = ()=> {
  var elList = $('.isRequired');
  var flag ={
    state:false,
    name:""
  };
  elList.each((index,element)=>{
    var portionName = $(element).parents('.collapse-content').prev().find('div span').html();
    var value = $(element).attr('data-value');
    if(value=="") {
      flag.state = true;
      flag.name = portionName;
     return false;
    }
  });
  return flag;
};
