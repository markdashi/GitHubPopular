/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
    StatusBar,
    TouchableOpacity,
    Image
} from 'react-native';

import {TabNavigator,StackNavigator} from 'react-navigation';

import WelcomePage from './js/pages/WelcomePage';

import PopularPage from './js/pages/PopularPage';
import MyPage from './js/pages/MyPage';
import FavoritePage from './js/pages/FavoritePage';
import TrendPage from './js/pages/TrendPage';
import CustomKeyPage from './js/pages/CustomKeyPage';

const TabBar = TabNavigator({
    PopularPage:{
        screen:PopularPage,
        navigationOptions:({navigation}) => ({
            tabBarLabel:'最热',
            tabBarIcon:({ focused ,tintColor}) => (
                focused?
                <Image source={require('./res/images/ic_polular.png')} style={[styles.iconStyle,{tintColor:tintColor}]} />:
                    <Image source={require('./res/images/ic_polular.png')} style={styles.iconStyle} />

            )
        })
    },
    TrendPage:{
        screen:TrendPage,
        navigationOptions:({navigation}) => ({
            tabBarLabel:'趋势',
            tabBarIcon:({ focused ,tintColor}) => (
                focused?
                <Image source={require('./res/images/ic_trending.png')} style={[styles.iconStyle,{tintColor:tintColor}]} />:
                    <Image source={require('./res/images/ic_trending.png')} style={styles.iconStyle} />
            )
        })
    },
    FavoritePage:{
        screen:FavoritePage,
        navigationOptions:({navigation}) => ({
            tabBarLabel:'收藏',
            tabBarIcon:({ focused ,tintColor}) => (
                focused?
                <Image source={require('./res/images/ic_favorite.png')} style={[styles.iconStyle,{tintColor:tintColor}]} />:
                    <Image source={require('./res/images/ic_favorite.png')} style={styles.iconStyle} />
            )
        })
    },
    MyPage:{
        screen:MyPage,
        navigationOptions:({navigation}) => ({
            tabBarLabel:'我的',
            tabBarIcon:({ focused ,tintColor}) => (
                focused?
                <Image source={require('./res/images/ic_my.png')} style={[styles.iconStyle,{tintColor:tintColor}]} />:
                    <Image source={require('./res/images/ic_my.png')} style={styles.iconStyle} />
            )
        })
    },
},{
    animationEnabled: false, // 切换页面时不显示动画
    tabBarPosition: 'bottom', // 显示在底端，android 默认是显示在页面顶端的
    swipeEnabled: false, // 禁止左右滑动
    backBehavior: 'none', // 按 back 键是否跳转到第一个 Tab， none 为不跳转
    tabBarOptions: {
        activeTintColor: '#2196F3', // 文字和图片选中颜色
        inactiveTintColor: '#666', // 文字和图片默认颜色
        // activeBackgroundColor:'#2196F3',
        // inactiveBackgroundColor:'#666',
        showIcon: true, // android 默认不显示 icon, 需要设置为 true 才会显示
        indicatorStyle: {height: 0}, // android 中TabBar下面会显示一条线，高度设为 0 后就不显示线了， 不知道还有没有其它方法隐藏？？？
        style: {
            backgroundColor: '#fff', // TabBar 背景色
        },
        labelStyle: {
            fontSize: 11, // 文字大小
        },
    },
}
);
const App = StackNavigator({
    WelcomePage:{screen:WelcomePage},
    PopularPage:{screen:PopularPage},
    TabBar:{screen:TabBar},
    CustomKeyPage:{screen:CustomKeyPage}
},{
    navigationOptions:{
        headerStyle:{
            backgroundColor:'#2196F3'
        },
        headerTitleStyle:{
            color:'white',
            alignSelf:'center'//适配安卓居中
        }
    }
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    statusBar:{
        height:20,
        backgroundColor:'red'
    },
    iconStyle:{
        width:25,
        height:25
    },
    backImage:{
        width:36,
        height:36
    }
});

export default App


