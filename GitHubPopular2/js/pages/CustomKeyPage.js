/**
 * Created by apple on 28/2/18.
 */
import React,{Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    ScrollView,
    Button,
    Alert
} from 'react-native';


import ArrayUtils from '../Utils/ArrayUtils';

import CheckBox from 'react-native-check-box';

import LanguageDao,{FLAG_LANGUAGE} from '../expand/dao/LanguageDao';

import HeaderLeftButton from 'HeaderLeftButton';

import HeaderRightButton from 'HeaderRightButton';

// <Text
//     onPress={()=>{
//                        if (params.onSave){params.onSave()}
//                     }}
//     style={{fontSize:18,marginRight:10,color:'white'}}>{'保存'}</Text>

export default class CustomKeyPage extends Component<{}>{


    static navigationOptions = ({navigation})=> {

        const params = navigation.state.params || {};

        return {
            title: '自定义标签',
            headerRight: (

                <HeaderRightButton
                    onPress={()=>{
                        if (params.onSave){params.onSave()}
                    }}
                    title={'保存'}
                />
            ),
            headerLeft: (
                <HeaderLeftButton onPress={()=>{
                         Alert.alert(
            '提示',
            '要保存修改吗?',
            [
                {text:'不保存',onPress:()=>{
                    navigation.goBack();
                },style:'cancel'},
                {text:'保存',onPress:()=>{
                    if (params.onSave){params.onSave()}
                }}
            ]
        )
                }}/>
            )
        }
    }

    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            dataArray:[],
            count: 0,
        };
         this.changeValues=[];
      }


    componentWillMount() {
        this.props.navigation.setParams({ onSave: this.onSave});
    }

    componentDidMount() {

        this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key);

        //加载默认数据
        this.loadData();
    }

    loadData(){

        this.languageDao.fetch()
            .then((result)=>{
                this.setState({
                    dataArray:result
                })
            })
            .catch((error)=>{
                console.log(error);
            })
    }

    //保存
    onSave = ()=>{

        if (this.changeValues.length === 0){
            this.props.navigation.goBack();
            return;
        }
        this.languageDao.save(this.state.dataArray);
        this.props.navigation.goBack();
    }


    renderView(){

        if (!this.state.dataArray||this.state.dataArray.length==0) return null;
        let len  = this.state.dataArray.length;
        let views = [];
        for(let i=0,l=len-2;i<l;i+=2){
            views.push(
                <View key={i}>
                   <View style={styles.item}>
                       {this.renderCheckBox(this.state.dataArray[i])}
                       {this.renderCheckBox(this.state.dataArray[i+1])}
                   </View>
                    <View style={styles.line}></View>
                </View>
            )
        }
        views.push(
            <View key={len-1}>
                <View style={styles.item}>
                    {len%2==0?this.renderCheckBox(this.state.dataArray[len-2]):null}
                    {this.renderCheckBox(this.state.dataArray[len-1])}
                </View>
                <View style={styles.line}></View>
            </View>
        )

        return views;
    }
    onClick(data){
        data.checked=!data.checked;
        ArrayUtils.updateArray(this.changeValues,data);
    }

    renderCheckBox(data){
        let leftText = data.name;
        return(
            <CheckBox
                style={{flex:1,padding:10}}
                onClick={()=>this.onClick(data)}
                leftText={leftText}
                isChecked={data.checked}
                checkedImage={
                    <Image style={{tintColor:'#6495ED'}}
                    source={require('../../res/images/ic_check_box.png')}/>
                }
                unCheckedImage={
                    <Image style={{tintColor:'#6495ED'}}
                    source={require('../../res/images/ic_check_box_outline_blank.png')}/>
                }
            />
        )
    }

    render(){
        return(
            <View style={styles.container}>
                <ScrollView>
                    {this.renderView()}
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1
    },
    iconImage:{
        width:18,
        height:18
    },
    line:{
        height:0.3,
        backgroundColor:'#e6e6e6'
    },
    item:{
        flexDirection:'row',
        alignItems:'center'
    }
})