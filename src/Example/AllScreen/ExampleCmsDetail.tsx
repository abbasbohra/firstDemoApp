import { View, Text, ScrollView, Image, Dimensions } from 'react-native'
import React from 'react'
import Header from '../../component/Header'
import RenderHTML from 'react-native-render-html'

const ExampleCmsDetail = ({ route, navigation }: { route: any, navigation: any }) => {
    const { item } = route.params
    const html = item?.content
    const tagsStyles = {
    
        body: {
            width:380,
            color: 'black',
            fontSize:13,
            top: 20,
            right:10
        },
        a: {
            color: 'black',
            fontWeight:'800',
        }
    };
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <Header cartleft={-10} searchLeft={5} onpress={() => navigation.goBack()} showShadow={true} title={item?.title} />
            <ScrollView contentContainerStyle={{ paddingBottom: 10, backgroundColor: 'white', top: 10 }}>
                <Image source={{ uri: item?.ImageSrc }} resizeMode='contain' style={{ width: 350, height: 100, left: 20, top: 50 }} />
                <Text style={{ padding: 0, margin: 10 }}> {<RenderHTML
                    source={{ html: html }}
                    tagsStyles={tagsStyles}
                    baseStyle={{ color: 'black', fontSize: 12,}}
                />} </Text>
            </ScrollView>
        </View>

    )
}

export default ExampleCmsDetail