import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    StatusBar,
} from 'react-native';

import PropTypes from 'prop-types';

const StatusBarShape={
    backgroundColor:PropTypes.string,
    barStyle:PropTypes.OneOf(['default', 'light-content', 'dark-content']),
    hidden:PropTypes.bool
}


//定义一个组件的流程
//1.分析组件的内容
//2.设置一些属性,可以设置属性的默认值
//3.布局样式

export default class NavigationBar extends Component<{}>{
    static propTypes={
        style:View.propTypes.style,
        title:PropTypes.string,
        titleView:PropTypes.element,
        leftButton:PropTypes.element,
        rightButton:PropTypes.element,
        statusBar:PropTypes.shape(StatusBarShape)
    };
    //设置一些属性的默认值
    static defaultProps={statusBar: {
        barStyle:'light-content',
        hidden:false
      }
    }
    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            title:'',
            hide:false
        };
      }


    render(){
        //进行内容布局
        let status = <View style={styles.statusBar}>
            <StatusBar
                {...this.props.statusBar}
            />
        </View>
        let titleView = this.props.titleView? this.props.titleView : <Text style={styles.title}>{this.props.title}</Text>
        let content = <View style={styles.navBar}>
                    {this.props.leftButton}
                    <View style={styles.titleViewContainer}>
                        {titleView}
                    </View>
                    {this.props.rightButton}
        </View>
        return(
            <View style={[style.container,this.props.style]}>
                {status}
                {content}
            </View>
        )
    }
}
//设置属性
const styles = StyleSheet.create({
    container: {
        backgroundColor: 'gray'
    },
    statusBar:{
        height:Platform.OS === 'ios'? 20 : 0
    },
    title:{
        fontSize:25
    },
    navBar:{
        height:44,
        flexDirection:'row',

    },
    titleViewContainer:{
        alignItems:'center',
    }
});