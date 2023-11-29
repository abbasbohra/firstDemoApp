import { View, Text, Image, StatusBar } from 'react-native'
import React from 'react'
const FinalScene = () => {
    return (
        <View style={{ backgroundColor: "white", flex: 1 }}>
            <Image source={{ uri: 'https://i.ibb.co/rb2xv6F/4753850-removebg-preview.png' }} resizeMode='contain' style={{ width: 400, height: 400, top: 50, right: 10 }} />
            <View style={{ width: 150, height: 20, backgroundColor: "white", position: "relative", top: 15, left: 100 }} />
            <Text style={{ color: "#626ABB", fontFamily: "NotoSansVithkuqi-Regular", fontSize: 35, top: 100, left: 50 }}> Delivery</Text>
            <Text style={{ top: 150, marginLeft: 50, fontFamily: 'Sono_Proportional-Medium', color: "grey" }}>{`Lorem ipsum dolor sit amet, consect etuer` + '\n' + `adipi cing elit ,sed diam nonummy nibh.`}  </Text>
        </View>
    )
}

export default FinalScene