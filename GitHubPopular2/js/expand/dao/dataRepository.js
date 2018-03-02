/**
 * Created by apple on 27/2/18.
 */

import React,{Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    AsyncStorage
} from 'react-native';

export var FLAG_STOREAGE={flag_popular:'popular',flag_trending:'trending'};

// 数据缓存策略:
// 1.程序启动加载缓存数据
//     - 判断缓存数据是否存在?
//           - 存在: 判断数据是否过期 (设置一个过期时间) 过期? 加载网络数据并缓存 : 直接显示
//           - 不存在: 加载网络数据并缓存

import GitHubTrending from 'GitHubTrending';
export default class dataRepository{

    // 构造
      constructor(flag) {

        this.flag = flag;

        if (flag == FLAG_STOREAGE.flag_trending){
            this.trending = new GitHubTrending();
        }
        // 初始状态
        this.state = {};
      }

    fetchRepository(url){
        return new Promise((resovle,reject)=>{
            //获取本地数据的方法
            this.fetchLocalRepsitory(url)
                .then(result=>{
                    if (result){
                        resovle(result);
                    } else {
                        this.fetchNetRepository(url)
                            .then((result)=>{
                                resovle(result)
                            })
                            .catch((error)=>{
                                reject(error)
                            })
                    }
                })
                .catch((error)=>{
                    this.fetchNetRepository(url)
                        .then((result)=>{
                            resovle(result)
                        })
                        .catch((error)=>{
                            reject(error)
                        })
                })
        })
    }
    

    /*获取本地数据*/
    fetchLocalRepsitory(url){
        return new Promise((resovle,reject)=>{
            AsyncStorage.getItem(url,(error,result)=>{
                if (!error){
                    try {
                        resovle(JSON.parse(result))
                    }catch (error){
                        reject(error)
                    }
                }else {
                    reject(error)
                }
            })
        })
    }


    fetchNetRepository(url){
        return new  Promise((resolve,reject)=>{

            if (this.flag === FLAG_STOREAGE.flag_trending){
                this.trending.fetchTrending(url)
                    .then(result=>{
                        if (!result) {
                            reject(new Error('responseData is null'))
                            return;
                        }
                        this.saveReposity(url,result);
                        resolve(result);
                    })
            }else {
                fetch(url)
                    .then((response)=>response.json())
                    .then((result)=>{
                        if (!result){
                            reject(new Error('response Data is null'))
                        }
                        resolve(result.items);
                        this.saveReposity(url,result.items)
                    })
                    .catch((error)=>{
                        reject(error)
                    })
            }
        })
    }

    saveReposity(url,items,callBack){

        if (!url||!items)return;
        let wrapData={items:items,update_date:new Date().getTime()}
        AsyncStorage.setItem(url,JSON.stringify(wrapData),callBack)
    }

    //检查数据日期是否过期

    checkData(longTime){

        return false;

        let cDate = new Date();
        let tDate = new  Date();
        tDate.setTime(longTime);
        if (cDate.getMonth() !== tDate.getMonth()) return false;
        if (cDate.getDay() !== tDate.getDay()) return false;
        if (cDate.getHours() - tDate.getHours()>4) return false;

        return true;
    }
    
}