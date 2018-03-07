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
    TouchableOpacity,
    Image,
    DeviceEventEmitter
} from 'react-native';


import dataRepository,{FLAG_STOREAGE} from '../expand/dao/dataRepository';
import TrendingCell from 'TrendingCell';
import LanguageDao,{FLAG_LANGUAGE} from '../expand/dao/LanguageDao';

import FavoriteDao from 'FavoriteDao';
import ProjectModel from 'ProjectModel';
import Utils from 'Utils';

import Popover from '../common/Popover';
import TimeSpan from 'TimeSpan';
var timeSpanTextArray=[
    new TimeSpan('今 天','since=daily'),
    new TimeSpan('本 周','since=weekly'),
    new TimeSpan('本 月','since=monthly')
];

import HeaderLeftButton from 'HeaderLeftButton';

import GitHubTrending from 'GitHubTrending';

const API_URL = "https://github.com/trending/";

import ScrollableTabView,{ScrollableTabBar} from 'react-native-scrollable-tab-view';

import Toast,{DURATION} from 'react-native-easy-toast';

import PropTypes from 'prop-types';

class HeadeTitle extends Component<{}>{

    static propTypes={
        onTitlePress:PropTypes.func,
        button:PropTypes.element,
        timeSpan:PropTypes.object
    };

    render() {
        return (
            <TouchableOpacity
                ref='button'
                onPress={()=>{
                    this.props.onTitlePress(this.refs.button)
                }}
                style={{flexDirection:'row',alignItems:'center'}}>
                <Text style={{color:'white',fontSize:16}}>{'趋势 '+ this.props.timeSpan.showText}</Text>
                <Image
                    source={require('../../res/images/ic_spinner_triangle.png')}
                    style={{ width: 10, height: 10 ,marginLeft:5}}
                />
            </TouchableOpacity>
        );
    }
}


export default class TrendPage extends Component<{}>{

    static navigationOptions=({navigation})=> {

        const parmas = navigation.state.params || {};

        return{
            headerTitle:<HeadeTitle
                timeSpan={parmas.timeSpan?parmas.timeSpan:timeSpanTextArray[0]}
                onTitlePress={(button)=>{
                    if (parmas.showPopover){parmas.showPopover(button)}
              }
            }
            />
        }
    };

    // 构造
    constructor(props) {
        super(props);

        this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_language);


        // 初始状态
        this.state = {
            languages: [],
            isVisible: false,
            fromRect: {},
            timeSpan: timeSpanTextArray[0],
            isFavoriteChanged:false
        }
    }

    componentDidMount() {

        this.listener = DeviceEventEmitter.addListener('isFavoriteChanged_trending',()=>{
            this.setState({
                isFavoriteChanged:true
            })
        });

        this.props.navigation.setParams({showPopover:this.showPopover});

        this.loadData();
    }

    componentWillUnmount() {
        this.listener && this.listener.remove()
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


    //Popover 相关

    showPopover = (button) =>{
        button.measure((ox, oy, width, height, px, py) => {
            this.setState({
                fromRect: {x: px, y: py-50, width: width, height: height},
                isVisible: true
            });
        });
    };


    closePopover() {
        this.setState({isVisible: false});
    }

    onSelectTimeSpan(timeSpan){
        this.setState({
            isVisible:false,
            timeSpan:timeSpan
        });
        this.props.navigation.setParams({timeSpan:timeSpan})
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
                return lan.checked?<TrendTab tabLabel={lan.name} key={i} isFavoriteChanged={this.state.isFavoriteChanged} timeSpan={this.state.timeSpan} {...this.props}>lan.name</TrendTab>:null
            })}

        </ScrollableTabView>:null;

        let timeSpanView = (<Popover
            fromRect={this.state.fromRect}
            isVisible={this.state.isVisible}
            placement="bottom"
            contentStyle={{backgroundColor:'#343434',opacity:0.8}}
            onClose={()=>this.closePopover()}>
            {timeSpanTextArray.map((result,i,arr)=>{
                return <TouchableOpacity key={i} onPress={()=>{this.onSelectTimeSpan(arr[i])}}>
                    <Text style={{fontSize:16,color:'white',fontWeight:'800',padding:5}}>{arr[i].showText}</Text>
                </TouchableOpacity>
            })}
        </Popover>);

        return(
            <View style={styles.container}>
                {content}
                {timeSpanView}
            </View>
        )
    }
}


class TrendTab extends Component{

    // 构造
    constructor(props) {
        super(props);

        this.dataRepository = new dataRepository(FLAG_STOREAGE.flag_trending);

        this.FavoriteDaoUtil = new FavoriteDao(FLAG_STOREAGE.flag_trending);

        // 初始状态
        this.state = {
            text:'',
            dataSource:[],
            isLoading:false,
            FavoriteKeys:[]
        };
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.timeSpan !== this.props.timeSpan){
            this.request(false,nextProps.timeSpan);
        }else if (nextProps.isFavoriteChanged == true){
            this.props.isFavoriteChanged = false
            this.request(false,this.props.timeSpan);
        }
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


    getFetchURL(catergory,timeSpan){
        return API_URL + catergory + '?' + timeSpan.searchText;
    }

    request(isUserLoading,timeSpan){

        this.setState({
            isLoading:true
        });

        let appURL = this.getFetchURL(this.props.tabLabel,timeSpan);

        this.dataRepository.fetchRepository(appURL)
            .then((result)=>{
                
                if (!isUserLoading){
                    this.items =result&&result.items?result.items:result?result:[];

                    this.getFavoriteKeys();

                    // this.setState({
                    //     text:JSON.stringify(result),
                    //     dataSource:items,
                    //     isLoading:false
                    // })
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
                // alert('显示缓存数据')
                // }
            })
            .then(items=>{


                if (!items || items.length===0)return;

                this.items = items;

                this.getFavoriteKeys();

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

        // this.listener = DeviceEventEmitter.addListener('isFavoriteChanged_trending',()=>{
        //     this.setState({isFavoriteChanged:true})
        // });

        this.request(false,this.props.timeSpan);
    }

    // componentWillUnmount() {
    //     this.listene&&this.listener.remove()
    // }

    OnFavorite(item,isFavorite){

        if (isFavorite){
            this.FavoriteDaoUtil.saveFavoriteItem(item.fullName,JSON.stringify(item));
        }else {
            this.FavoriteDaoUtil.removeFavoriteItem(item.fullName);
        }
    }

    onSelect = (item)=>{
        this.props.navigation.navigate('RepositoryDetail',{
            projectModel:item,
            callback:()=>{
                this.getFavoriteKeys();
            },
            flag:FLAG_STOREAGE.flag_trending
        })
    }

    renderItemCell(projectModel){
        return(
            <TrendingCell
                onSelect={()=>this.onSelect(projectModel)}
                projectModel={projectModel}
                FavoriteClick={(item,isFavorite)=>{this.OnFavorite(item,isFavorite)}}
            />
        )
    }
    _keyExtractor = (item, index) =>  item.item.fullName;

    render(){
        return(
            <View style={styles.container}>
                <FlatList
                    data={this.state.dataSource}
                    renderItem={({item})=>this.renderItemCell(item)}
                    keyExtractor={this._keyExtractor}
                    onRefresh={()=>{this.request(true,this.props.timeSpan)}}
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
