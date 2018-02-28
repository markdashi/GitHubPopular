/**
 * Created by apple on 28/2/18.
 */



export default class ArrayUtils{
    /*
     *更新数组,若item已存在则从数组中移除,否则添加进数组
     */
    static updateArray(array,item){
        for (var i=0,len=array.length;i<len;i++){
            var temp = array[i];
            if (temp===item){
                array.splice(i,1);
                return;
            }
        }
        array.push(item)
    }
}