/**
 * @providesModule HeaderLeftButton
 * */
import React,{Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
} from 'react-native'

import PropTypes from 'prop-types';

export default class HeaderLeftButton extends Component<{}>{

    static propTypes={
        onPress:PropTypes.func.isRequired
    };
    render(){
        return(
            <TouchableOpacity 
                style={{flex:1}} 
                onPress={()=>{
                        if (this.props.onPress){this.props.onPress()}
                }}>
                <Image
                    style={styles.image}
                    source={require('../../res/images/ic_arrow_back_white_36pt.png')}/>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
   image:{
       marginLeft:10,
       width:25,
       height:25
   } 
});