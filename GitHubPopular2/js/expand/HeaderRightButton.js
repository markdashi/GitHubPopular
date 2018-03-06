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
        isTextButton:PropTypes.bool,
        buttonIcon:PropTypes.number,
        iconStyle: View.propTypes.style,
        title:PropTypes.string,
        onPress:PropTypes.func
    };
    render(){

        let content = this.props.isTextButton? <Text
            onPress={()=>{
                       if (this.props.onPress){this.props.onPress()}
                    }}
            style={[styles.title]}>{this.props.title}</Text>:
            <TouchableOpacity onPress={()=>{if (this.props.onPress){this.props.onPress()}}}>
                <Image source={this.props.buttonIcon} style={[styles.buttonIconStyle,this.props.iconStyle]}/>
            </TouchableOpacity>
        return(
            content
        )
    }
}

const styles = StyleSheet.create({
    title:{
        fontSize:18,
        marginRight:10,
        color:'white'
    },
    buttonIconStyle:{
        width:25,
        height:25,
        marginRight:15,
        tintColor:'white'
    }
});
