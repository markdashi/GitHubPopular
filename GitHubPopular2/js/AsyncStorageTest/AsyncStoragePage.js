/**
 * Created by apple on 28/2/18.
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

const KEY = 'text';

import Toast,{DURATION} from 'react-native-easy-toast'

export default class AsyncStoragePage extends Component<{}>{

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
    }

    onSave(){
        if (this.text == null){
            this.toast.show('不能存储空数据',DURATION.LENGTH_LONG);
            return;
        }

        AsyncStorage.setItem(KEY,this.text,(error)=>{
            if (!error){
                this.toast.show('保存成功!',DURATION.LENGTH_LONG);
            }else {
                this.toast.show('保存失败!',DURATION.LENGTH_LONG);
            }
        })
    }
    onRemove(){
        AsyncStorage.removeItem(KEY,(error)=>{
            if (!error){
                this.toast.show('移除成功',DURATION.LENGTH_LONG)
            }else {
                this.toast.show('移除失败',DURATION.LENGTH_LONG)
            }
        })
    }
    onGet(){
        AsyncStorage.getItem(KEY,(error,result)=>{
            if (!error){
                if (result !=='' && result !== null){
                    this.toast.show('取出的内容为:'+result);
                }else {
                    this.toast.show('取出的内容为空')
                }

            }else {
                this.toast.show('取出失败')
            }
        })

    }


    render(){
        return(
            <View style={styles.container}>
                <TextInput style={styles.textInput}
                           onChangeText={(text)=>{this.text=text}}
                />
                <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                    <Text style={styles.text}
                          onPress={()=>{
                                this.onSave()
                          }}
                    >{'存储'}</Text>
                    <Text style={styles.text}
                          onPress={()=>{
                                this.onRemove()
                          }}
                    >{'删除'}</Text>
                    <Text style={styles.text}
                          onPress={()=>{
                                this.onGet()
                          }}
                    >{'获取'}</Text>
                </View>
                <Toast ref={toast=>this.toast=toast} position="center"/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1
    },
    text:{
        marginLeft:10,
        marginRight:10
    },
    textInput:{
        height:30,
        backgroundColor:'red',
        borderWidth:1,
        borderColor:'#e6e6e6'
    }
})