/**
 * @providesModule RepositoryDetail
 * */
import React,{Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    WebView
} from 'react-native';

const TRENDING_URL = "https://github.com/";

import {FLAG_STOREAGE} from '../expand/dao/dataRepository';
import FavoriteDao from 'FavoriteDao';


import HeaderLeftButton from 'HeaderLeftButton';
import HeaderRightButton from 'HeaderRightButton';

export default class RepositoryDetail extends Component<{}>{


    static navigationOptions=({navigation})=>{

        const params = navigation.state.params || {};
        let item = params.projectModel.item;

        var title = item.name?item.name:item.fullName;

        let FavoriteIcon = 0
        if(!params.isFavorite){
            FavoriteIcon = params.projectModel.isFavorite?require('../../res/images/ic_star.png'):require('../../res/images/ic_unstar_transparent.png')
        }else {
            FavoriteIcon = params.isFavorite?require('../../res/images/ic_star.png'):require('../../res/images/ic_unstar_transparent.png')
        }

        return{
            title:title,
            headerLeft:(
                <HeaderLeftButton
                    onPress={()=>{
                      if (params.goBack){params.goBack()}
                    }}
                />
            ),
            headerRight:(
                <HeaderRightButton
                    isTextButton={false}
                    onPress={()=>{
                        if(params.onClickFavorite){params.onClickFavorite()}
                    }}
                    buttonIcon={FavoriteIcon}
                />
            )
        }
    }

    // 构造
    constructor(props) {
        super(props);

        const params = this.props.navigation.state.params || {};

        let url = params.projectModel.item.html_url?
            params.projectModel.item.html_url:
                    TRENDING_URL + params.projectModel.item.fullName;

        // 初始状态
        this.state = {
            url:url,
            canGoBack:false,
            title:''
        };
    }

    componentDidMount() {

        //FLAG_STOREAGE.flag_popular
        this.FavoriteDaoUtil = new FavoriteDao(this.props.navigation.state.params.flag);

        this.props.navigation.setParams({goBack:this.goBack,onClickFavorite:this.onClickFavorite})
    }

    onNavigationStateChange(navState){

        this.setState({
            canGoBack:navState.canGoBack,
            title:navState.title
        })
    }

    //收藏按钮点击
    onClickFavorite = ()=>{
        
        let ProjectModel = this.props.navigation.state.params.projectModel;
        ProjectModel.isFavorite = !ProjectModel.isFavorite;

        this.props.navigation.setParams({isFavorite:ProjectModel.isFavorite})
        if (ProjectModel.isFavorite){
            this.FavoriteDaoUtil.saveFavoriteItem(ProjectModel.item.id.toString(),JSON.stringify(ProjectModel.item));
        }else {
            this.FavoriteDaoUtil.removeFavoriteItem(ProjectModel.item.id.toString());
        }
    };


    //返回
    goBack = ()=>{
        if (this.state.canGoBack){
            this.webView.goBack();
        }else {
            this.props.navigation.goBack();
            this.props.navigation.state.params.callback();
        }
    };


    render(){
        return(
            <View style={styles.container}>
                <WebView
                    ref={webView=>this.webView=webView}
                    source={{uri:this.state.url}}
                    onNavigationStateChange={(navState)=>this.onNavigationStateChange(navState)}
                    startInLoadingState={true}
                />
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container:{
        flex:1
    }
})