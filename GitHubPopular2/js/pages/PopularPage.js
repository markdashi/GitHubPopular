/**
 * @providesModule PopularPage
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
    DeviceEventEmitter
} from 'react-native';


import httpUtils from '../Utils/HttpUtils';

import dataRepository,{FLAG_STOREAGE} from '../expand/dao/dataRepository';
import RepositoryCell from '../common/RepositoryCell';
import LanguageDao,{FLAG_LANGUAGE} from '../expand/dao/LanguageDao';
import ProjectModel from 'ProjectModel';
import FavoriteDao from 'FavoriteDao';
import Utils from 'Utils';

var FavoriteDaoUtil = new FavoriteDao(FLAG_STOREAGE.flag_popular);

const URL = "https://api.github.com/search/repositories?q=";
const QUERY_STA = '&sort=stars';

import ScrollableTabView,{ScrollableTabBar} from 'react-native-scrollable-tab-view';

import Toast,{DURATION} from 'react-native-easy-toast';

export default class PopularPage extends Component<{}>{

    static navigationOptions={
        title:'最热',
    };
    
    // 构造
      constructor(props) {
        super(props);

        this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key);

        this.dataRepository = new dataRepository(FLAG_STOREAGE.flag_popular);
        // 初始状态
        this.state = {
            text:'',
            languages:[],
        };
      }

    getURL(key){
        return URL + key + QUERY_STA;
    }

    request(url){

        let appURL = this.getURL(this.text);
        this.dataRepository.fetchNetRepository(appURL)
            .then((result)=>{
                this.setState({
                    text:JSON.stringify(result)
                })
            })
            .catch((error)=>{
                this.setState({
                    text:JSON.stringify(error)
                })
            })
    }

    componentDidMount() {

        this.loadData()

        // this.listener = DeviceEventEmitter.addListener('showToast',(text)=>{
        //     this.toast.show(text,DURATION.LENGTH_LONG)
        // })
    }

    componentWillUnmount() {
        // this.listener&& this.listener.remove();
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
                return lan.checked?<PopularTab tabLabel={lan.name} key={i} {...this.props}>lan.name</PopularTab>:null
            })}

        </ScrollableTabView>:null;

        return(
            <View style={styles.container}>
                {content}
            </View>
        )
    }
}

// <PopularTab tabLabel="Java">Java</PopularTab>
// <PopularTab tabLabel="iOS">iOS</PopularTab>
//     <PopularTab tabLabel="Android">Android</PopularTab>
//     <PopularTab tabLabel="JavaScript">JavaScript</PopularTab>

class PopularTab extends Component{
    // 构造
    constructor(props) {
        super(props);

        this.dataRepository = new dataRepository();
        // 初始状态
        this.state = {
            text:'',
            dataSource:[],
            isLoading:false,
            FavoriteKeys:[]
        };
    }

    getURL(key){
        return URL + key + QUERY_STA;
    }

    /**
     * 更新project Item 收藏状态
     * */
    flushFavoriteState(){
        let projectModels = [];
        let items = this.items;
        for (var i =0,len=items.length;i<len;i++){
             projectModels.push(new ProjectModel(items[i],Utils.checkFavorite(items[i],this.state.FavoriteKeys)));
        }

        this.updateState({
            isLoading:false,
            dataSource:projectModels
        })
    }

    // shouldComponentUpdate(nextProps,nextState) {
    //     return true;
    // }

    //获取收藏的keys
    getFavoriteKeys=()=>{
        FavoriteDaoUtil.getFavoriteKeys()
            .then(keys=>{
                if (keys){
                    this.updateState({
                        FavoriteKeys:keys
                    })
                }
                this.flushFavoriteState();
            })
            .catch(error=>{
                this.flushFavoriteState();
            })
    }

    updateState(dic){
        this.setState(dic)
    }


    request(isUserLoading){

        this.setState({
            isLoading:true
        });

        let appURL = this.getURL(this.props.tabLabel);
        this.dataRepository.fetchRepository(appURL)
            .then((result)=>{


                if (!isUserLoading){
                    this.items =result&&result.items?result.items:result?result:[];

                    this.getFavoriteKeys();
                    // this.flushFavoriteState();
                    // this.setState({
                    //     text:JSON.stringify(result),
                    //     dataSource:items,
                    //     isLoading:false
                    // })
                }else {
                    return this.dataRepository.fetchNetRepository(appURL);
                }

                if (result && result.update_date && !this.dataRepository.checkData(result.update_date)){

                     return this.dataRepository.fetchNetRepository(appURL);
                }
                //
                // else {
                    // DeviceEventEmitter.emit('showToast','显示缓存数据');
                    // this.toast.show('显示缓存数据',DURATION.LENGTH_LONG)
                    // alert('显示缓存数据')
                // }

            })
            .then(items=>{


                if (!items || items.length===0)return;
                this.items = items;

                this.getFavoriteKeys();
                // this.flushFavoriteState();
                
                // this.setState({
                //     dataSource:items,
                //     isLoading:false
                // });

                // alert('显示网络数据')
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

    OnFavorite(item,isFavorite){
        
        
        if (isFavorite){
            FavoriteDaoUtil.saveFavoriteItem(item.id.toString(),JSON.stringify(item));
        }else {
            FavoriteDaoUtil.removeFavoriteItem(item.id.toString());
        }

    }

    onSelect = (item)=>{
        this.props.navigation.navigate('RepositoryDetail',{
            projectModel:item,
            flag:FLAG_STOREAGE.flag_popular,
            callback:()=>{
                this.getFavoriteKeys();
            }
        })
    }

    renderItemCell(projectModel){
        return(
            <RepositoryCell
                onSelect={()=>this.onSelect(projectModel)}
                // data={projectModel}
                projectModel={projectModel}
                FavoriteClick={(item,isFavorite)=>{this.OnFavorite(item,isFavorite)}}
            />
        )
    }
    _keyExtractor = (item, index) => item.item.id.toString();

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

//<Text
// onPress={()=>{
//     this.request('https://api.github.com/search/repositories?q=ios&sort=stars')
// }}
// style={styles.text}
// >{'加载数据'}</Text>
// <TextInput
//     style={{height:30,backgroundColor:'red'}}
//     onChangeText={(text)=>{this.text=text}}/>
// <ScrollView>
//     <Text style={{height:400,fontSize:25}}>{this.state.text}</Text>
//     </ScrollView>