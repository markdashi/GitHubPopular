/*
* @providesModule TrendingCell
* **/
import React,{Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Image
} from 'react-native';

import PropType from 'prop-types';

import Toast,{DURATION} from 'react-native-easy-toast';

import HTMLView from 'react-native-htmlview';

export default class TrendingCell extends Component<{}>{

    static propTypes={
        data:PropType.object
    };

    render(){

        let description = '<p>'+this.props.data.description+ '</p>';


        return(
            <TouchableOpacity
                onPress={this.props.onSelect}
                style={styles.container}
            >
                <View style={styles.cell_container}>
                    <Text style={styles.title}>{this.props.data.fullName}</Text>
                    {/*<Text style={styles.description}>{this.props.data.description}</Text>*/}
                    <HTMLView
                        value={description}
                        stylesheet={{
                            p:styles.description,
                            a:styles.description
                        }}
                        // onLinkPress={(url) => console.log('clicked link: ', url)}
                        onLinkPress={()=>{}}
                    />
                    <Text style={styles.description}>{this.props.data.meta}</Text>
                    <View style={styles.bottomViewStyle}>
                        <View style={styles.AuthorStyle}>
                            <Text style={styles.author}>{'Build by:'}</Text>
                            {this.props.data.contributors.map((result,i,arr)=>{
                                return <Image key={i} source={{uri:arr[i]}} style={styles.avatarImage}/>
                            })}

                        </View>
                        <Image style={styles.starStyle} source={require('../../res/images/ic_star.png')}/>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1
    },
    avatarImage:{
        width:22,
        height:22,
        marginLeft:5
    },
    bottomViewStyle:{
        flexDirection:'row',
        justifyContent:'space-between'
    },
    AuthorStyle:{
        flexDirection:'row',
        alignItems:'center'
    },
    StarStyle:{
        flexDirection:'row',
        alignItems:'center'
    },
    starStyle:{
        width:22,
        height:22
    },
    title:{
        fontSize:16,
        marginBottom:2,
        color:'#212121'
    },
    description:{
        fontSize:14,
        marginBottom:2,
        color:'#757575',
        // borderRadius:3
    },
    cell_container:{
        backgroundColor:'white',
        padding:10,
        marginLeft:5,
        marginRight:5,
        marginVertical:3,//垂直边距
        borderWidth:0.1,
        //iOS特有
        shadowColor:'gray',
        shadowOffset:{width:0.5,height:0.5},
        shadowRadius:1,
        borderColor:'gray',
        shadowOpacity:0.4,
        //安卓特有
        elevation:5
    },
    author:{
        fontSize:14,
        marginBottom:2,
        color:'#757575'
    }
})
