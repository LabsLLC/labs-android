import { StyleSheet } from 'react-native';

export default styles = StyleSheet.create({
    title: {
        fontSize: 14,
        fontFamily: "Roboto",
        color: "#8F8F8F",
    },
    contentText: {
        fontSize: 16,
        fontFamily: "Roboto",
        color: "#000000",
        marginBottom: 2
    },
    container: {
        flex: 1,
        flexDirection:"row",
        marginTop: 24
    },
    textStack: {
        flex: 2,
        marginLeft: 20,
        flexDirection: "column"
    },
    listIcon: {
        marginTop: 4,
        marginLeft:20,
        width:16,
        height:23.58
    },
    chevron: {
        marginTop:8,
        height:28.6,
        width:16,
        marginLeft: 16,
        marginRight: 20
    }
});
