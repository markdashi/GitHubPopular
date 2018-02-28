/**
 * Created by apple on 27/2/18.
 */
import React,{Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    // Navigator
} from 'react-native';

import WelcomePage from './WelcomePage';


function setup() {

    //进行一些初始化配置
    class Root extends Component{

        // renderScene(route,navigator){
        //     let Component = route.component;
        //     return <Component {...route.params} navigator={navigator}/>
        // }

        // render(){
        //     return <Navigator
        //         initialRoute={{component:WelcomePage}}
        //         renderScene={(route,navigator)=>this.renderScene(route,navigator)}
        //     />
        // }
        render(){
            return (<View>
                <Text>{'欢迎'}</Text>
            </View>)
        }

    }
    return <Root/>
}
module.exports=setup;
