import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import Header from '../../component/Header'
import { LaungageData } from '../../component/ProfileOptions/Option'
import Icon from 'react-native-vector-icons/Ionicons'
const Laungage = ({ navigation }: { navigation: any }) => {

    const [selectLaungage, setSelectLaungage] = useState('1')


    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <Header onpress={() => navigation.goBack()} title='My Laungage ' showShadow={true} searchLeft={5} cartleft={-10}  />
            <View style={{ paddingBottom: 50, }}>
                <FlatList
                    data={LaungageData}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item, index }: { item: any, index: any }) => {
                        return (
                            <TouchableOpacity onPress={() => setSelectLaungage(item.id)} style={{ backgroundColor: selectLaungage === item.id ? '#27AAE1' : "white", margin: 5, width: '95%', shadowColor: 'black', shadowOffset: { width: 1, height: 1 }, shadowOpacity: 1, shadowRadius: 1, elevation: 5, left: 5, paddingBottom: 15, borderRadius: 10 }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Icon name={selectLaungage === item.id ? 'radio-button-on' : 'radio-button-off'} size={25} color={'black'} style={{ margin: 20, top: 20 }} />
                                    <Text style={{ margin: 20, fontSize: 25, color: selectLaungage === item.id ? 'white' : "black", fontWeight: '900', right: 20 }}> {item.title}</Text>
                                </View>
                                <Text style={{ color: selectLaungage === item.id ? 'white' : "black", fontSize: 18, left: 75, bottom: 10 }}> {item.subTitle}</Text>
                                <Image source={item.image} style={{ width: 100, height: 100, position: "absolute", left: 250 }} />


                            </TouchableOpacity>
                        )
                    }}
                />
            </View>
        </View>
    )
}

export default Laungage