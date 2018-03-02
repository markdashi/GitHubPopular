/**
 * @providesModule WebViewTest
 * */
import React,{Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    WebView
} from 'react-native';

const URL = 'https://www.baidu.com'

export default class WebViewTest extends Component<{}>{

    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            url:URL,
            title:'',
            canGoBack:false

        };
      }

    onNavigationStateChange(navState){

        this.setState({
            canGoBack:navState.canGoBack,
            title:navState.title
        })
    }



    render(){
        return(
            <View style={styles.container}>
                <WebView
                    source={{uri:this.state.url}}
                    onNavigationStateChange={(navState)=>this.onNavigationStateChange(navState)}
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