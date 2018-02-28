/**
 * Created by apple on 27/2/18.
 */
import React,{Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    AsyncStorage,
    TextInput
} from 'react-native';

import AsyncStoragePage from '../AsyncStorageTest/AsyncStoragePage';

export default class TrendPage extends Component<{}>{

    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
      }

    render(){
        return(
            <View style={styles.container}>
                <AsyncStoragePage />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1
    }
})