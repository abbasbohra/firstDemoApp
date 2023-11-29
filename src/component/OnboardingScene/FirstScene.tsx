import { View, Text, Image, StatusBar } from 'react-native'
import React from 'react'
const FirstScene = () => {
    return (
        <View style={{ backgroundColor: "white", flex: 1 }}>
            <Image source={{ uri: 'https://i.ibb.co/7VrfyyQ/2672252.jpg' }} resizeMode='contain' style={{ width: 400, height: 400, top: 50, right: 10 }} />
            <View style={{ width: 150, height: 20, backgroundColor: "white", position: "relative", top: 15, left: 100 }} />
            <Text style={{ color: "#626ABB", fontFamily: "NotoSansVithkuqi-Regular", fontSize: 35, top: 100, left: 50 }}> Purchase  </Text>
            <Text style={{ color: "#626ABB", fontSize: 35, top: 105, left: 50, fontFamily: "NotoSansVithkuqi-Regular" }}> online  </Text>
            <Text style={{ top: 120, marginLeft: 50, fontFamily: 'Sono_Proportional-Medium', color: "grey" }}>{`Loprem ipsum dolor sit amet, consect etuer` + '\n' + `adipi cing elit ,sed diam nonummy nibh .`}  </Text>
        </View>
    )
}

export default FirstScene