import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        backgroundColor: "white",
        paddingHorizontal:16,
    },
    centerIcon: {
        position:"absolute", zIndex:1, alignSelf:"center", top:-16, width: 72, height: 72
    },
    centerIconSize:
    {
        height:72,
        width:72
    },
    tabBarAnchor:
    {
        position: 'absolute', left:0, right:0, bottom:0
    }
});