import { COLORS } from "../../../../../styles/colors";

const style = {
    FontSize: 18,
    lowFontSize: 13,
    blueColor: '#0084c8',
    lightBlue: '#0BCFDE',
    ratingColor: '#009e53',
    purpleColor:'#875A7B',
    skyBlue:'#26A09D',
    greenColor: '#009e53',
    lightGreen: '#0BD4AA',
    fontFamily:'Roboto',
    hr_tag: {
        width: '100%',
        height: 10,
        borderTopColor: '#8c8c8c',
        borderTopWidth: 1,
        backgroundColor: '#d6d5d5',
        marginVertical: 10
    },
    container: {
        flex:1,
        width: '100%',
        backgroundColor:COLORS.whiteColor
    },
    thinhr_tag: {
        width: '98%',
        height: 2,
        alignSelf: 'center',
        borderTopColor: '#8c8c8c',
        borderTopWidth: 1,
        backgroundColor: '#d6d5d5',
        marginVertical: 5,
    },
    fluid_container: {
        flex: 1,
        width: '100%',
        padding: 5,
        alignSelf: 'center',
    }, 
    row: {
        width: '90%',
        alignSelf: 'center',
    },
    general_font: {
        fontSize: 16,
        color: 'black',
        fontWeight: '500',
        // textTransform: 'capitalize',
        
    },
    bold_font: {
        fontSize:17,
        fontWeight: '700',
        textTransform: 'capitalize'
    },
    pressable: {
        borderWidth: 2, 
        borderColor: '#009e53',
        borderRadius: 6, 
        padding: 5
    }, 
    pressable__text: {
        fontSize: 17,
        fontWeight: '600',
        textTransform: 'capitalize',
        color: '#009e53',
    },
    show_data_in_row:{
        flexDirection:'row',
        justifyContent:'space-between',
        marginTop:'2%',
    },
    show_data_in_column:{
        flexDirection:'column',
        justifyContent:'space-between',
        marginTop:'2%',
    },
    header_font:{
        fontSize:17,
        fontWeight: 'bold',
        textTransform: 'capitalize'
    },
    cardViewContainer: {
        flexDirection:'row',
        justifyContent:'space-between',
        paddingVertical:3
      },
    line: {
        width: '100%',
        height: 2,
        borderTopColor: '#8c8c8c',
        borderTopWidth: 1,
        backgroundColor: '#d6d5d5',
        // marginVertical: 10
    },
    textInputContainer:{
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        marginTop:'3%',
        // borderBottomWidth:2
        
        // gap:'2px'
    },
    textInput:{
        borderBottomWidth: 2,
        borderColor:'#8080806e',
        padding: 2,
        fontSize:17,
        // borderRadius:4,
        width:'60%'
    },
    btnStyle:{
        paddingHorizontal:'5%',
        borderRadius:10,
    },
    header: {
        width: '90%',
        height: 30,
        fontWeight:'700',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 5
    },
    header_text: {
      fontSize: 18,
      color: '#0084c8',
      fontWeight: 'bold',
      fontSize:21,
      marginBottom:'-1%',
    },
    successMessage:{
        fontSize:20,
        fontWeight: 'bold',
        textTransform: 'capitalize',
        marginVertical:10,
        marginLeft:'3%',
        alignItems:'center'
    },
    successCardStyle:{
        paddingVertical: 5,
        borderRadius:10,
        elevation:5,
        borderColor:'#009e53',
    }
}

export default style;
