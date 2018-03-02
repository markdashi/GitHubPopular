/**
 * @providesModule TrendPage
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
} from 'react-native';


import dataRepository,{FLAG_STOREAGE} from '../expand/dao/dataRepository';
import TrendingCell from 'TrendingCell';
import LanguageDao,{FLAG_LANGUAGE} from '../expand/dao/LanguageDao';


import HeaderLeftButton from 'HeaderLeftButton';

import GitHubTrending from 'GitHubTrending';

const API_URL = "https://github.com/trending/";

import ScrollableTabView,{ScrollableTabBar} from 'react-native-scrollable-tab-view';

import Toast,{DURATION} from 'react-native-easy-toast';


export default class TrendPage extends Component<{}>{

    static navigationOptions={
        title:'趋势',
    }

    // 构造
    constructor(props) {
        super(props);

        this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_language);

        // 初始状态
        this.state = {
            languages:[]
        };
    }

    componentDidMount() {
        this.loadData()
    }


    loadData(){

        this.languageDao.fetch()
            .then((result)=>{
                this.setState({
                    languages:result
                })
            })
            .catch((error)=>{
                console.log(error);
            })

    }

    render(){
        let content = this.state.languages.length>0?<ScrollableTabView
            renderTabBar={()=><ScrollableTabBar/>}
            tabBarBackgroundColor="#2196F3"
            tabBarActiveTextColor="mintcream"
            tabBarInactiveTextColor="mintcream"
            tabBarUnderlineStyle={styles.UnderlineStyle}
        >
            {this.state.languages.map((reult,i,arr)=>{
                let lan = arr[i]
                return lan.checked?<TrendTab tabLabel={lan.name} key={i} {...this.props}>lan.name</TrendTab>:null
            })}

        </ScrollableTabView>:null;

        return(
            <View style={styles.container}>
                {content}
            </View>
        )
    }
}


class TrendTab extends Component{
    // 构造
    constructor(props) {
        super(props);

        this.dataRepository = new dataRepository(FLAG_STOREAGE.flag_trending);
        // 初始状态
        this.state = {
            text:'',
            dataSource:[],
            isLoading:false
        };
    }

    getFetchURL(catergory,timeSpan){
        return API_URL + catergory + timeSpan;
    }

    request(isUserLoading){

        this.setState({
            isLoading:true
        });

        let appURL = this.getFetchURL(this.props.tabLabel,'?since=daily');

        this.dataRepository.fetchRepository(appURL)
            .then((result)=>{

                console.log(result);
                if (!isUserLoading){
                    let items =result&&result.items?result.items:result?result:[];

                    this.setState({
                        text:JSON.stringify(result),
                        dataSource:items,
                        isLoading:false
                    })
                }else {
                    return this.dataRepository.fetchNetRepository(appURL);
                }

                // if (result && result.update_date && !this.dataRepository.checkData(result.update_date)){
                //
                //      return this.dataRepository.fetchNetRepository(appURL);
                // }
                //
                // else {
                // DeviceEventEmitter.emit('showToast','显示缓存数据');
                // this.toast.show('显示缓存数据',DURATION.LENGTH_LONG)
                alert('显示缓存数据')
                // }

            })
            .then(items=>{


                if (!items || items.length===0)return;
                this.setState({
                    dataSource:items,
                    isLoading:false
                });

                alert('显示网络数据')
            })
            .catch((error)=>{
                this.setState({
                    text:JSON.stringify(error),
                    dataSource:[],
                    isLoading:false
                })
            })
    }

    componentDidMount() {
        this.request(false);

    }
    onSelect = (item)=>{
        this.props.navigation.navigate('RepositoryDetail',{
            item:item
        })
    }

    renderItemCell(item){
        return(
            <TrendingCell
                onSelect={()=>this.onSelect(item)}
                data={item}/>
        )
    }
    _keyExtractor = (item, index) => '' + item.id+index;

    render(){
        return(
            <View style={styles.container}>
                <FlatList
                    data={this.state.dataSource}
                    renderItem={({item})=>this.renderItemCell(item)}
                    keyExtractor={this._keyExtractor}
                    onRefresh={()=>{this.request(true)}}
                    refreshing={this.state.isLoading}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1
    },
    text:{
        marginTop:100,
        fontSize:20
    },
    UnderlineStyle:{
        backgroundColor:"#e7e7e7",
        height:2
    }
});
