/**
 * Created by apple on 28/2/18.
 */



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

export default class LanguageDao{

    // 构造
      constructor(flag) {

        this.flag=flag;

        // 初始状态
        this.state = {};
      }

    fetch(){
        return new Promise((resolve,reject)=>{
            AsyncStorage.getItem(this.flag,(error,result)=>{
                if (error){

                        reject(error)
                }else {
                     if (result&&result!=='[]'){
                         try {
                             resolve(JSON.parse((result)))
                         } catch (error){
                             reject(error)
                         }
                     }else {
                         //如果是空,返回默认数据
                         var data = this.flag === FLAG_LANGUAGE.flag_key?keys:langData;
                         if (data){this.save(data)}
                         resolve(data)
                     }
                }
            })
        })
    }

    save(data){

        AsyncStorage.setItem(this.flag,JSON.stringify(data),(error)=>{

        })
    }

}