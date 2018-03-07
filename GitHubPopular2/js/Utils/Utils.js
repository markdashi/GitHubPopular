/**
 * @providesModule Utils
 * */


export default class Utils{

    /**
     * 检查该Item 有没有被收藏过
     * */
    static checkFavorite(item,items){

        for(var i= 0,len=items.length;i<len;i++){

             let im = item.id?item.id.toString():item.fullName;
             if (im === items[i]){
                 return true
             }
        }
        return false
    }
}
