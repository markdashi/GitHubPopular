/**
 * Created by apple on 28/2/18.
 */
import React,{Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity
} from 'react-native';

export default class ViewUtils{
    static getLeftButton(callBack){
        return(
            <TouchableOpacity
                onPress={()=>{
                    if (callBack){callBack()}
                }}
                style={styles.container}>
                <Image
                    style={styles.iconImage}
                    source={require('../../res/images/ic_arrow_back_white_36pt.png')}/>
            </TouchableOpacity>
        )
    }
    
}

const styles = StyleSheet.create({
    container:{
        padding:8
    },
    iconImage:{
        width:18,
        height:18
    }
});