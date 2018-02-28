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
                            itemId:'5468999',
                            name:'MyPage'
                        })
                }}>{'自定义标签页'}</Text>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container:{
        flex:1
    }
})