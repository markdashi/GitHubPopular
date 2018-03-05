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

import {FLAG_LANGUAGE} from '../../js/expand/dao/LanguageDao'

export default class MyPage extends Component<{}>{
    render(){
        return(
            <View style={styles.container}>
                <Text
                    style={styles.text}
                    onPress={()=>{
                        this.props.navigation.navigate('CustomKeyPage',{
                            isRemoveKey:false,
                            flag:FLAG_LANGUAGE.flag_language
                        })
                }}>{'自定义语言'}</Text>
                <Text
                    style={styles.text}
                    onPress={()=>{
                        this.props.navigation.navigate('CustomKeyPage',{
                            isRemoveKey:false,
                            flag:FLAG_LANGUAGE.flag_key
                        })
                }}>{'自定义标签页'}</Text>
                <Text
                style={styles.text}
                onPress={()=>{
                        this.props.navigation.navigate('SortKeyPage',{
                            flag:FLAG_LANGUAGE.flag_key
                        })
                }}>{'标签排序'}</Text>
                <Text
                    style={styles.text}
                    onPress={()=>{
                        this.props.navigation.navigate('SortKeyPage',{
                            flag:FLAG_LANGUAGE.flag_language
                        })
                }}>{'语言排序'}</Text>
                <Text
                    style={styles.text}
                    onPress={()=>{
                        this.props.navigation.navigate('CustomKeyPage',{
                            isRemoveKey:true,
                            flag:FLAG_LANGUAGE.flag_language
                        })
                }}>{'标签移除'}</Text>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container:{
        flex:1
    },
    text:{
        fontSize:20
    }
})