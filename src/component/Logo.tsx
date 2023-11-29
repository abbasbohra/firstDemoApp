import { View, Text, Image } from 'react-native'
import React from 'react'
import { } from 'react-native-svg'

const Logo = ({ top, left, right, width, height }: { top: number, left: number, right: number, width: number, height: number }) => {
    return (
        <View style={{ flex: 1 }}>
            {/* <View style={{ width: 52, height: 50, borderRadius: 70 ,position:"absolute",borderColor:"#A49456",borderWidth:1,left:30,top:5}}>
                <Text style={{ color: "#A49456", fontWeight: "500", fontSize: 21,alignItems:"center",left:0,top:10 }}>NILY</Text>
            </View> */}
            <Image source={{ uri: 'https://i.ibb.co/XLTLNPt/fashion-Leo-Logo-With-Name-56bc05da.png' }} resizeMode='contain' style={{ width: width, height: height, top: top, left: left, right: right }} />
        </View>
    )
}

export default Logo