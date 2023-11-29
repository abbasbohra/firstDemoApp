import { View, Text, ScrollView, Dimensions } from 'react-native'
import React from 'react'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const SkelatonEffectShoppingCart = () => {
    return (
        <ScrollView contentContainerStyle={{ backgroundColor: '#F5F5F5', paddingBottom: 80 }}>
            <View style={{ backgroundColor: "white", shadowColor: 'black', shadowOffset: { width: 1, height: 1 }, shadowOpacity: 1, shadowRadius: 1, elevation: 3, width: '96%', borderRadius: 20, top: 20, left: 8 }}>
                <SkeletonPlaceholder>
                    <View style={{ width: Dimensions.get('screen').width - 10, height: 200, backgroundColor: 'white', shadowColor: 'black', shadowOffset: { width: 1, height: 1 }, shadowOpacity: 1, shadowRadius: 1, elevation: 5, flexDirection: 'row' }}>
                        <View style={{ width: 125, height: 125, borderRadius: 10, left: 10, top: 50 }} />
                        <View style={{ width: 220, height: 20, top: 60, left: 20, borderRadius: 10 }} />
                        <View style={{ width: 220, height: 20, top: 100, left: -200, borderRadius: 10 }} />
                        <View style={{ width: 120, height: 20, top: 140, left: -420, borderRadius: 10 }} />
                    </View>
                </SkeletonPlaceholder>
            </View>
            <View style={{ backgroundColor: "white", shadowColor: 'black', shadowOffset: { width: 1, height: 1 }, shadowOpacity: 1, shadowRadius: 1, elevation: 5, width: '96%', borderRadius: 20, top: 30, left: 8 }}>
                <SkeletonPlaceholder>
                    <View style={{ width: Dimensions.get('screen').width - 10, height: 200, backgroundColor: 'white', shadowColor: 'black', shadowOffset: { width: 1, height: 1 }, shadowOpacity: 1, shadowRadius: 1, elevation: 5, flexDirection: 'row' }}>
                        <View style={{ width: 125, height: 125, borderRadius: 10, left: 10, top: 50 }} />
                        <View style={{ width: 220, height: 20, top: 60, left: 20, borderRadius: 10 }} />
                        <View style={{ width: 220, height: 20, top: 100, left: -200, borderRadius: 10 }} />
                        <View style={{ width: 120, height: 20, top: 140, left: -420, borderRadius: 10 }} />
                    </View>
                </SkeletonPlaceholder>
            </View>
            <View style={{ backgroundColor: "white", shadowColor: 'black', shadowOffset: { width: 1, height: 1 }, shadowOpacity: 1, shadowRadius: 1, elevation: 5, width: '96%', borderRadius: 20, top: 40, left: 8 }}>
                <SkeletonPlaceholder>
                    <View style={{ width: Dimensions.get('screen').width - 10, height: 200, backgroundColor: 'white', shadowColor: 'black', shadowOffset: { width: 1, height: 1 }, shadowOpacity: 1, shadowRadius: 1, elevation: 5, flexDirection: 'row' }}>
                        <View style={{ width: 125, height: 125, borderRadius: 10, left: 10, top: 50 }} />
                        <View style={{ width: 220, height: 20, top: 60, left: 20, borderRadius: 10 }} />
                        <View style={{ width: 220, height: 20, top: 100, left: -200, borderRadius: 10 }} />
                        <View style={{ width: 120, height: 20, top: 140, left: -420, borderRadius: 10 }} />
                    </View>
                </SkeletonPlaceholder>
            </View>
            <View style={{ backgroundColor: "white", shadowColor: 'black', shadowOffset: { width: 1, height: 1 }, shadowOpacity: 1, shadowRadius: 1, elevation: 5, width: '96%', borderRadius: 20, top: 50, left: 8 }}>
                <SkeletonPlaceholder>
                    <View style={{ width: Dimensions.get('screen').width - 10, height: 200, backgroundColor: 'white', shadowColor: 'black', shadowOffset: { width: 1, height: 1 }, shadowOpacity: 1, shadowRadius: 1, elevation: 5, flexDirection: 'row' }}>
                        <View style={{ width: 125, height: 125, borderRadius: 10, left: 10, top: 50 }} />
                        <View style={{ width: 220, height: 20, top: 60, left: 20, borderRadius: 10 }} />
                        <View style={{ width: 220, height: 20, top: 100, left: -200, borderRadius: 10 }} />
                        <View style={{ width: 120, height: 20, top: 140, left: -420, borderRadius: 10 }} />
                    </View>
                </SkeletonPlaceholder>
            </View>
            <View style={{ backgroundColor: "white", shadowColor: 'black', shadowOffset: { width: 1, height: 1 }, shadowOpacity: 1, shadowRadius: 1, elevation: 5, width: '96%', borderRadius: 20, top: 60, left: 8 }}>
                <SkeletonPlaceholder>
                    <View style={{ width: Dimensions.get('screen').width - 10, height: 200, backgroundColor: 'white', shadowColor: 'black', shadowOffset: { width: 1, height: 1 }, shadowOpacity: 1, shadowRadius: 1, elevation: 5, flexDirection: 'row' }}>
                        <View style={{ width: 125, height: 125, borderRadius: 10, left: 10, top: 50 }} />
                        <View style={{ width: 220, height: 20, top: 60, left: 20, borderRadius: 10 }} />
                        <View style={{ width: 220, height: 20, top: 100, left: -200, borderRadius: 10 }} />
                        <View style={{ width: 120, height: 20, top: 140, left: -420, borderRadius: 10 }} />
                    </View>
                </SkeletonPlaceholder>
            </View>
        </ScrollView>
    )
}

export default SkelatonEffectShoppingCart