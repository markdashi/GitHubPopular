import React,{Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View
} from 'react-native';

import { NavigationActions } from 'react-navigation';
const resetAction = NavigationActions.reset({
    index: 0,  //确定route的index
    actions: [ //确定routes
        NavigationActions.navigate({ routeName: 'TabBar'})
    ]
})

export default class WelcomePage extends Component<{}>{

    componentDidMount() {
       this.timer = setTimeout(()=>{
            //这里需要的是重置路由,保持首页为栈底控制器
            // this.props.navigator.resetTo({
            //     component:HomePage
            // })
           this.props.navigation.dispatch(resetAction)
        },2000)
    }

    //组件被卸载了
    componentWillUnmount() {
        this.timer && clearTimeout(this.timer)
    }

    //隐藏导航栏
    static navigationOptions={
        header:null
    }

    render(){
        return(
            <View style={styles.container}>
                <Text>{'欢迎界面'}</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
   container:{
       flex:1,
       justifyContent:'center',
       alignItems:'center'
   }
});
