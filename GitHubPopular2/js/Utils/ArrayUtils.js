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

    /*
    * 克隆一个数组
    * */
    static clone(from){
        if (!from) return [];
        let newArray=[];
        for (let i=0,len=from.length;i<len;i++){
            newArray[i]=from[i];
        }
        return newArray;
     }

    /*
    * 判断两个数组是否一一对应*/
    static isEqual(arr1,arr2){
        if(!arr1&&!arr2) return false;
        if (arr1.length !== arr2.length) return false;
        for (let i=0,len=arr1.length;i<len;i++){
            if (arr1[i] !== arr2[i]) return false
        }
        return true;
    }

    /*
    * 移除数组中指定的元素
    * */
    static remove(arr,item){
        if (!arr) return;

        for (let i=0,len=arr.length;i<len;i++){
            if (item === arr[i]){
                arr.splice(i,1);
            }
        }
    }

}