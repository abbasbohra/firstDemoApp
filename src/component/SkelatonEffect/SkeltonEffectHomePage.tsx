import { View, Text, ScrollView, Dimensions } from 'react-native'
import React from 'react'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';


const SkeltonEffect = () => {
    return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ height: 2100, backgroundColor: "white" }}>
            <SkeletonPlaceholder>
                <View style={{ flex: 1, backgroundColor: 'white' }}>
                    <View style={{ width: '90%', height: 50, backgroundColor: '#EDEDED', left: 20, top: 40, flexDirection: 'row', borderRadius: 10 }}>
                    </View>
                    <View style={{ top: 50, flexDirection: "row", margin: 5 }}>
                        <View style={{ width: 50, height: 50, borderRadius: 50, margin: 6 }} />
                        <View style={{ width: 50, height: 50, borderRadius: 50, margin: 6 }} />
                        <View style={{ width: 50, height: 50, borderRadius: 50, margin: 6 }} />
                        <View style={{ width: 50, height: 50, borderRadius: 50, margin: 6 }} />
                        <View style={{ width: 50, height: 50, borderRadius: 50, margin: 6 }} />
                        <View style={{ width: 50, height: 50, borderRadius: 50, margin: 6 }} />
                    </View>
                    <View style={{ width: Dimensions.get('screen').width - 10, height: 170, backgroundColor: '#EDEDED', left: 5, top: 130, flexDirection: 'row', borderRadius: 10 }}>
                    </View>
                    <View style={{ backgroundColor: "white", width: Dimensions.get('screen').width, height: 330, top: 200 }}>
                    </View>
                    <View style={{ backgroundColor: "#E1F8DC", width: Dimensions.get('screen').width, height: 330, top: 250 }}>
                    </View>
                    <View style={{ backgroundColor: "#F7D8BB", width: Dimensions.get('screen').width, height: 330, top: 300 }}>
                    </View>
                    <View style={{ backgroundColor: "#D7BFD7", width: Dimensions.get('screen').width, height: 330, top: 350 }}>
                    </View>
                    <View style={{ backgroundColor: "#D7BFD7", width: Dimensions.get('screen').width, height: 330, top: 400 }}>
                    </View>


                </View>
            </SkeletonPlaceholder>
        </ScrollView>
    )
}

export default SkeltonEffect