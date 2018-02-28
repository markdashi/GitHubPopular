/**
 * Created by apple on 27/2/18.
 */


export default class dataRepository{

    fetchNetRepository(url){
        return new  Promise((resolve,reject)=>{
            fetch(url)
                .then((response)=>response.json())
                .then((result)=>{
                    resolve(result)
                })
                .catch((error)=>{
                    reject(error)
                })
        })
    }
    
    
}