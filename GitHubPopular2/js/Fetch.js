import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    StatusBar,
} from 'react-native';


import Toast,{DURATION} from 'react-native-easy-toast'

export default class Fetch extends Component<{}>{

    //Fetch
    //GET
    onRequets(url){

        fetch(url)
            .then((response) => response.json())
            .then((result) =>{

            })
            .catch((error) => {

            })
    }
    onPost(url){

        fetch(url,{
            method:'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                firstParam: 'yourValue',
                secondParam: 'yourOtherValue',
            })
                .then((response) => response.json())
                .then((result) => {

                })
                .catch((error) => {

                })
        })
    }





    render(){
        return(
            <View style={styles.container}>
                <Text>{'这是一个测试的'}</Text>
                <Toast ref={toast=>{this.toast=toast}}/>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container:{
        flex:1
    }
})