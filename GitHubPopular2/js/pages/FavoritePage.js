/**
 * Created by apple on 27/2/18.
 */
import React,{Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    TextInput,
    FlatList,
    DeviceEventEmitter
} from 'react-native';

import {FLAG_STOREAGE} from '../expand/dao/dataRepository';
import RepositoryCell from '../common/RepositoryCell';
import TrendingCell from 'TrendingCell';
import LanguageDao,{FLAG_LANGUAGE} from '../expand/dao/LanguageDao';
import ProjectModel from 'ProjectModel';
import FavoriteDao from 'FavoriteDao';
import Utils from 'Utils';
import PropTypes  from 'prop-types';

import ArrayUtils from 'ArrayUtils';

import ScrollableTabView,{ScrollableTabBar} from 'react-native-scrollable-tab-view';

export default class FavoritePage extends Component<{}>{

    static navigationOptions={
        title:'收藏',
    };

    // 构造
    constructor(props) {
        super(props);

        this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key);

        // 初始状态
        this.state = {
            text:'',
            languages:[],
        };
    }

    componentDidMount() {
    }

    render(){
        return(
            <View style={styles.container}>
                <ScrollableTabView
                    renderTabBar={()=><ScrollableTabBar/>}
                    tabBarBackgroundColor="#2196F3"
                    tabBarActiveTextColor="mintcream"
                    tabBarInactiveTextColor="mintcream"
                    tabBarUnderlineStyle={styles.UnderlineStyle}
                >
                    <FavoriteTab tabLabel={'最热'} {...this.props} flag={FLAG_STOREAGE.flag_popular}/>
                    <FavoriteTab tabLabel={'趋势'} {...this.props} flag={FLAG_STOREAGE.flag_trending}/>
                </ScrollableTabView>
            </View>
        )
    }
}

class FavoriteTab extends Component{

    static propTypes={
        flag:PropTypes.string
    };

    // 构造
    constructor(props) {
        super(props);

        this.FavoriteDaoUtil = new FavoriteDao(this.props.flag);
        this.unFavotiteItems = [];

        // 初始状态
        this.state = {
            dataSource:[],
            isLoading:false,
            FavoriteKeys:[]
        };
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

    //获取收藏的keys
    getFavoriteKeys=()=>{
        this.FavoriteDaoUtil.getFavoriteKeys()
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

    request(){

        this.FavoriteDaoUtil.getAllStoreItems()
                            .then(items=>{
                                this.items = items;
                                this.getFavoriteKeys();
                            })
    }

    componentDidMount() {
        this.request()
    }

    OnFavorite(item,isFavorite){

        // item.fullName?item.fullName:item.id.toString();
        let key = '';
        if (this.props.flag === FLAG_STOREAGE.flag_popular){
             key = item.id.toString();
        }else {
             key = item.fullName;
        }
        ArrayUtils.updateArray(this.unFavotiteItems,item);

        if (isFavorite){
            this.FavoriteDaoUtil.saveFavoriteItem(key,JSON.stringify(item),()=>{
                this.getRefreshItems()
            });
        }else {
            this.FavoriteDaoUtil.removeFavoriteItem(key,()=>{
                this.getRefreshItems()
            });
        }


    }
    getRefreshItems(){
        if (this.unFavotiteItems.length > 0){
            if (this.props.flag === FLAG_STOREAGE.flag_popular){
                DeviceEventEmitter.emit('isFavoriteChanged_popular');
            }else {
                DeviceEventEmitter.emit('isFavoriteChanged_trending');
            }
            this.request()
        }
    }

    onSelect = (item)=>{
        this.props.navigation.navigate('RepositoryDetail',{
            projectModel:item,
            flag:this.props.flag,
            callback:()=>{
                this.request()
            }
        })
    };

    renderItemCell(projectModel){

        let CellComponent = projectModel.item.fullName?TrendingCell:RepositoryCell;

        return(
            <CellComponent
                onSelect={()=>this.onSelect(projectModel)}
                // data={projectModel}
                projectModel={projectModel}
                FavoriteClick={(item,isFavorite)=>{this.OnFavorite(item,isFavorite)}}
            />
        )
    }
    _keyExtractor = (item, index) => {
       this.props.flag === FLAG_STOREAGE.flag_popular?item.item.id.toString():item.item.fullName;
    };
    render(){

        return(
            <View style={styles.container}>
                <FlatList
                    data={this.state.dataSource}
                    renderItem={({item})=>this.renderItemCell(item)}
                    keyExtractor={this._keyExtractor}
                    onRefresh={()=>{this.request()}}
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