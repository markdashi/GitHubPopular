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

export default class CustomKeyPage extends Component<{}>{


    static navigationOptions = ({navigation})=> {

        const params = navigation.state.params || {};

        const isRemoveKey = params.isRemoveKey?true:false;
        
        let title=isRemoveKey?'标签移除':'自定义标签';

        title= params.flag === FLAG_LANGUAGE.flag_language?'自定义语言':title;

        let rightButtonTitle=isRemoveKey?'移除':'保存';

        return {
            title: title,
            headerRight: (

                <HeaderRightButton
                    isTextButton={true}
                    onPress={()=>{
                        if (params.onSave){params.onSave()}
                    }}
                    title={rightButtonTitle}
                />
            ),
            headerLeft: (
                <HeaderLeftButton onPress={()=>{
                if (params.isChanged&&params.isChanged()==true){
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
                }else {
                   navigation.goBack();
                }
                }}/>
            )
        }
    }

    // 构造
      constructor(props) {
        super(props);

          let params = this.props.navigation.state.params;
          this.isRemoveKey=params.isRemoveKey?true:false;
        // 初始状态
        this.state = {
            dataArray:[],
            count: 0,
        };
         this.changeValues=[];
      }


    componentWillMount() {
        this.props.navigation.setParams({ onSave: this.onSave,isChanged:this.isChanged});
    }

    componentDidMount() {

        this.languageDao = new LanguageDao(this.props.navigation.state.params.flag);

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


    //判断状态有没有变化
    isChanged = ()=>{
        if (this.changeValues.length==0) return false;
        return true;
    }


    onSave = ()=>{

        if (this.isChanged()==false){
            this.props.navigation.goBack();
            return;
        }


        //标签移除
        if (this.isRemoveKey){
            //遍历改变的数组,移除元素
            for (let i=0,len=this.changeValues.length;i<len;i++){
                ArrayUtils.remove(this.state.dataArray,this.changeValues[i]);
            }
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

        !this.isRemoveKey?data.checked=!data.checked:null;
        
        ArrayUtils.updateArray(this.changeValues,data);
    }

    renderCheckBox(data){
        let leftText = data.name;
        let isChecked = this.isRemoveKey?false:data.checked;

        return(
            <CheckBox
                style={{flex:1,padding:10}}
                onClick={()=>this.onClick(data)}
                leftText={leftText}
                isChecked={isChecked}
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