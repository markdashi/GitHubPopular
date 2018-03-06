/**
 * @providesModule Utils
 * */


export default class Utils{

    /**
     * 检查该Item 有没有被收藏过
     * */
    static checkFavorite(item,items){

        // if (!item || items.length === 0) return false;

        for(var i= 0,len=items.length;i<len;i++){

             if (item.id.toString() === items[i]){
                 return true
             }
        }
        return false
    }
}
