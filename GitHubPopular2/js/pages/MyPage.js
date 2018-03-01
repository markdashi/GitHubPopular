/**
 * Created by apple on 27/2/18.
 */
import React,{Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View
} from 'react-native';



export default class MyPage extends Component<{}>{
    render(){
        return(
            <View style={styles.container}>
                <Text onPress={()=>{
                        this.props.navigation.navigate('CustomKeyPage',{
                            isRemoveKey:false
                        })
                }}>{'自定义标签页'}</Text>
                <Text onPress={()=>{
                        this.props.navigation.navigate('SortKeyPage')
                }}>{'标签排序'}</Text>
                <Text onPress={()=>{
                        this.props.navigation.navigate('CustomKeyPage',{
                            isRemoveKey:true
                        })
                }}>{'标签移除'}</Text>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container:{
        flex:1
    }
})