/**
 * @providesModule SortKeyPage
 * */
import React,{Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    ScrollView,
    TextInput,
    FlatList,
    TouchableHighlight,
    Image,
    Alert
} from 'react-native';

import LanguageDao,{FLAG_LANGUAGE} from '../expand/dao/LanguageDao';
import ArrayUtils from '../Utils/ArrayUtils';
import SortableListView from 'react-native-sortable-listview';
import HeaderRightButton from 'HeaderRightButton';
import HeaderLeftButton from 'HeaderLeftButton';

export default class SortKeyPage extends Component<{}>{

    static navigationOptions=({navigation})=>{

        const params = navigation.state.params || {};

        return {

            title:'自定义标签',

            headerRight: (
                <HeaderRightButton
                    onPress={()=>{
                        if (params.onSave){params.onSave()}
                    }}
                    title={'保存'}
                />
            ),
            headerLeft: (
                <HeaderLeftButton
                    onPress={()=>{
                      if (params.isModified() === false){
                                navigation.goBack();
                                return;
                           }
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
                    }}

                />
            )
        }
    }


    // 构造
      constructor(props) {
        super(props);

          this.dataArray=[]; //数据库查询数组,查询所有的
          this.sortResultArray=[]; //排序后的数组
          this.originalCheckedArray=[];//原始选中的数组
        // 初始状态
        this.state = {
            checkedArray:[]
        };
      }


    componentWillMount() {
        this.props.navigation.setParams({onSave:this.onSave,isModified:this.isModified})
    }

    /*
    * 判断标签项是否修改过
    * */
    isModified = ()=>{

        if (ArrayUtils.isEqual(this.originalCheckedArray,this.state.checkedArray)){
            return false;
        }
        return true;
    }


    //保存
    onSave = ()=>{

        if (this.isModified()===false){
            this.props.navigation.goBack();
            return;
        }

        this.getSortResult();

        this.languageDao.save(this.sortResultArray);

        this.props.navigation.goBack();

    };

    // splice() 方法用于插入、删除或替换数组的元素。
    // 会改变原数组
    
    getSortResult(){

        //克隆查询数据库的数据,进行排序
        this.sortResultArray = ArrayUtils.clone(this.dataArray);

        for (let i=0,len=this.originalCheckedArray.length;i<len;i++){
            let item=this.originalCheckedArray[i];
            let index = this.dataArray.indexOf(item);
            this.sortResultArray.splice(index,1,this.state.checkedArray[i]);
        }
    }


    componentDidMount() {

        this.languageDao=new LanguageDao(FLAG_LANGUAGE.flag_key);

        this.loadData()
    }

    loadData(){
        this.languageDao.fetch()
            .then((result)=>{
                this.getCheckedItems(result)
            })
            .catch((error)=>{

            })
    }

    //获取选择的标签项
    getCheckedItems(result){

        //数据库中查询数据
        this.dataArray=result;

        let checkedArray=[];
        for (let i=0,len=result.length;i<len;i++) {
            let data = result[i];
            if (data.checked) {
                checkedArray.push(data)
            }
        }
        this.setState({
            checkedArray:checkedArray
        });

        //记录初始选中数组
        this.originalCheckedArray = ArrayUtils.clone(checkedArray);
    }


    render(){
        return(
            <View style={styles.container}>
                <SortableListView
                    style={{ flex: 1 }}
                    data={this.state.checkedArray}
                    order={Object.keys(this.state.checkedArray)}//Array of keys
                    onRowMoved={e => {
                           this.state.checkedArray.splice(e.to, 0, this.state.checkedArray.splice(e.from, 1)[0]);
                           this.forceUpdate()
                    }}
                    renderRow={row => <SortCell data={row} />}
                />
            </View>
        )
    }
}

class SortCell extends Component<{}>{

    render(){
        return(
            <TouchableHighlight
                underlayColor={'#eee'}
                style={styles.item}
                {...this.props.sortHandlers}
            >
                <View style={styles.row}>
                    <Image
                        style={styles.iconImage}
                        source={require('../../res/images/ic_sort.png')}/>
                    <Text>{this.props.data.name}</Text>
                </View>
            </TouchableHighlight>
        )
    }

}

const styles = StyleSheet.create({
    container:{
        flex:1
    },
    item:{
        padding: 15,
        backgroundColor: '#F8F8F8',
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
    row:{
        flexDirection:'row',
        alignItems:'center'
    },
    iconImage:{
        tintColor:'#2196F3',
        width:20,
        height:20,
        marginRight:10
    }
})