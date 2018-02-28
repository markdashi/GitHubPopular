/**
 * @providesModule HeaderRightButton
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

export default class HeaderRightButton extends Component<{}>{

    static propTypes={
        title:PropTypes.string.isRequired,
        onPress:PropTypes.func
    };
    render(){
        return(
            <Text
                onPress={()=>{
                       if (this.props.onPress){this.props.onPress()}
                    }}
                style={[styles.title]}>{this.props.title}</Text>
        )
    }
}

const styles = StyleSheet.create({
    title:{
        fontSize:18,
        marginRight:10,
        color:'white'
    }
});
