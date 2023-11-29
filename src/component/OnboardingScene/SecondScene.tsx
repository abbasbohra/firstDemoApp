import { View, Text, Image, StatusBar } from 'react-native'
import React from 'react'
const SecondScence = () => {
    return (
        <View style={{ backgroundColor: "white", flex: 1 }}>
            <Image source={{ uri: 'https://i.ibb.co/LZTKTk4/2879855-onboadrd1.png' }} resizeMode='contain' style={{ width: 400, height: 400, top: 50, right: 10 }} />
            <View style={{ width: 150, height: 20, backgroundColor: "white", position: "relative", top: 15, left: 100 }} />
            <Text style={{ color: "#626ABB", fontFamily: "NotoSansVithkuqi-Regular", fontSize: 35, top: 100, left: 50 }}> Pay  </Text>
            <Text style={{ top: 150, marginLeft: 50, fontFamily: 'Alexandria-variableFont_wgh', color: "grey" }}>{'Lorem ipsum dolor sit amet, consect etuer adipib' + '\n' + 'cing elit, sed diam nonummy nibh euismod tinci' + '\n' + 'dunt ut vol utpat .Ut wisi enim'}  </Text>
        </View>
    )
}

export default SecondScence