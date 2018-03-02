/**
 * @providesModule TrendingTest
 * */
import React,{Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    WebView,
    TextInput
} from 'react-native';


import HeaderLeftButton from 'HeaderLeftButton';

import GitHubTrending from 'GitHubTrending';

const URL = "https://github.com/trending/";

export default class TrendingTest extends Component<{}> {


    // 构造
      constructor(props) {
        super(props);

        this.trending = new GitHubTrending();
        // 初始状态
        this.state = {
            result:''
        };
      }



    onLoad(){


        let url = URL + this.text;

        console.log(url)
        this.trending.fetchTrending(url)
            .then(result=>{
                this.setState({
                    result:JSON.stringify(result)
                })
            })
            .catch(error=>{
                this.setState({
                    result:JSON.stringify(error)
                })
            })
    }


    render(){
          return(
              <View style={styles.container}>
                  <TextInput
                      onChangeText={(text)=>this.text=text}
                      style={styles.input}/>
                  <Text onPress={()=>{
                        this.onLoad()
                  }}>
                      {'加载数据'}
                  </Text>
                  <Text style={styles.result}>{this.state.result}</Text>
              </View>
          )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1
    },
    input:{
        height:30,
        borderWidth:1,
        borderColor:'black'
    },
    result:{
        width:300,
        height:500,
        backgroundColor:'red'
    }

})