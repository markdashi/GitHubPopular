import  React,{Component} from 'react'
import {
    View,
    Text,
    StyleSheet
} from 'react-native'

export default class Girl extends Component{
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
    }
    render(){
        return(
            <View style={styles.container}>
                <Text style={styles.text}>{'I am a Girl'}</Text>
                <Text style={styles.text}>{this.props.word}</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'red',
        justifyContent:'center'
    },
    text:{
        fontSize:22
    }
})





