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

import HeaderLeftButton from 'HeaderLeftButton';

export default class RepositoryDetail extends Component<{}>{


    static navigationOptions=({navigation})=>{

        const params = navigation.state.params || {};
        let item = params.item;

        var title = item.name?item.name:item.fullName;

        return{
            title:title,
            headerLeft:(
                <HeaderLeftButton
                    onPress={()=>{
                      if (params.goBack){params.goBack()}
                    }}
                />
            )
        }
    }

    // 构造
    constructor(props) {
        super(props);

        let url = this.props.navigation.state.params.item.html_url?
                    this.props.navigation.state.params.item.html_url:
                    TRENDING_URL + this.props.navigation.state.params.itemfullName;

        // 初始状态
        this.state = {
            url:url,
            canGoBack:false,
            title:''
        };
    }

    componentDidMount() {
        this.props.navigation.setParams({goBack:this.goBack})
    }

    onNavigationStateChange(navState){

        this.setState({
            canGoBack:navState.canGoBack,
            title:navState.title
        })
    }

    goBack = ()=>{
        if (this.state.canGoBack){
            this.webView.goBack();
        }else {
            this.props.navigation.goBack();
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