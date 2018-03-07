/**
 * @providesModule FavoriteDao
 * */


import React,{Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    AsyncStorage
} from 'react-native';

import keys from '../../../res/data/keys.json';
import langData from '../../../res/data/langs.json';

export var FLAG_LANGUAGE={flag_language:'flag_language_language',flag_key:'flag_language_key'};

const FAVAORITE_KEY_PREFIX='favorite_'

export default class FavoriteDao{

    // 构造
    constructor(flag) {

        this.flag = flag;
        this.FavoriteKey = FAVAORITE_KEY_PREFIX + flag;

        // 初始状态
        this.state = {};
    }


    /*
    * 取消收藏,移除已经收藏的项目
    * */
    removeFavoriteItem(key,callback){
        AsyncStorage.removeItem(key,(error)=>{
            this.updateFavoriteKeys(key,false,callback)
        })
    }

    /*
    * 获取收藏项目对应的key
    * */
    getFavoriteKeys(){
        return new Promise((resolve,reject)=>{
            AsyncStorage.getItem(this.FavoriteKey,(error,result)=>{
                if (!error){
                    try {
                        resolve(JSON.parse(result))
                    }catch (error){
                        reject(error);
                    }
                }else {
                    reject(error);
                }
            })
        })
    }

    //收藏项目,保存收藏项目
    /**
     * key 项目id 或者名称
     * value 收藏的项目
     * callback 回调
     * */
    saveFavoriteItem(key,value,callback){
        AsyncStorage.setItem(key,value,(error)=>{
            if (!error){
                this.updateFavoriteKeys(key,true,callback);
            }
        })
    }

    /*
    * 更新favorite key 集合
    * key
    * isAdd true 添加,收藏项目,删除
    * */
    updateFavoriteKeys(key,isAdd,callback){
        AsyncStorage.getItem(this.FavoriteKey,(error,result)=>{
            if (!error){
                var favoriteKey=[];
                if(result){
                    favoriteKey = JSON.parse(result);
                }
                var index = favoriteKey.indexOf(key);
                if (isAdd){
                    if (index === -1){
                        favoriteKey.push(key)
                    }
                }else {
                    if (index !==-1){
                        favoriteKey.splice(index,1);
                    }
                }
                AsyncStorage.setItem(this.FavoriteKey,JSON.stringify(favoriteKey),callback)
            }
        })
    }

    //获取所有收藏的项目
    getAllStoreItems(){
        return new Promise((resolve,reject)=>{
            this.getFavoriteKeys().then(keys=>{
                var stores = []
                AsyncStorage.multiGet(keys,(errors,results)=>{
                    if (!errors){
                        results.map((result,i,results)=>{
                            let item = results[i][1];
                            if (item){stores.push(JSON.parse(item))}
                        })
                        resolve(stores);
                    }else {
                        reject(errors);
                    }
                })
            })
                .catch(error=>{
                    reject(error)
                })
        });
    }






}
