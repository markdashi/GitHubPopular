
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

export default class RepositoryCell extends Component<{}>{
    
    static propTypes={
        // data:PropType.object,
        projectModel:PropType.object,
        FavoriteClick:PropType.func
    };

    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            isFavorite:this.props.projectModel.isFavorite,
            favoriteIcon:this.props.projectModel.isFavorite?
                require('../../res/images/ic_star.png')
                :require('../../res/images/ic_unstar_transparent.png')
        };
      }


    componentWillReceiveProps(nextProps) {
        this.setFavoriteState(nextProps.projectModel.isFavorite)
    }

    onPressavoriteButton(){

        let favorite = !this.state.isFavorite;
        this.setFavoriteState(favorite);
        this.props.projectModel.isFavorite = favorite; //修复数据刷新不及时的bug
        if (this.props.FavoriteClick){this.props.FavoriteClick(this.props.projectModel.item,!this.state.isFavorite)}
    }

    setFavoriteState(isFavorite){
        this.setState({
            isFavorite:isFavorite,
            favoriteIcon:isFavorite?require('../../res/images/ic_star.png'):require('../../res/images/ic_unstar_transparent.png')
        })
    }

    render(){

        let FavoriteButton = <TouchableOpacity
            onPress={()=>{this.onPressavoriteButton()}}>
            <Image style={styles.starStyle} source={this.state.favoriteIcon}/>
        </TouchableOpacity>;

        let item = this.props.projectModel.item;

        return(
            <TouchableOpacity
                onPress={this.props.onSelect}
                style={styles.container}
            >
                <View style={styles.cell_container}>
                    <Text style={styles.title}>{item.full_name}</Text>
                    <Text style={styles.description}>{item.description}</Text>
                    <View style={styles.bottomViewStyle}>
                       <View style={styles.AuthorStyle}>
                           <Text>{'Author:'}</Text>
                           <Image source={{uri:item.owner.avatar_url}} style={styles.avatarImage}/>
                       </View>
                        <View style={styles.StarStyle}>
                            <Text>{'Star:'}</Text>
                            <Text>{item.stargazers_count}</Text>
                        </View>
                        {FavoriteButton}
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
        height:22,
        tintColor:'#2196F3'
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
    }
})