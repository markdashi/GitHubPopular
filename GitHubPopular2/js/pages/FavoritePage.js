/**
 * Created by apple on 27/2/18.
 */
import React,{Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    TextInput
} from 'react-native';

import TrendingTest from 'TrendingTest';

export default class FavoritePage extends Component<{}>{

    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
        };
      }


    render(){
        return(
            <View style={styles.container}>
                <TrendingTest />
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container:{
        flex:1
    }
})