import { View, Text, Dimensions } from 'react-native'
import React from 'react'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder'
const SkelatonEffectProductDetail = () => {
    return (
        <View style={{ flex: 1 }}>
            <View style={{ top: 60, left: 30 }}>
                <SkeletonPlaceholder>
                    <View style={{}}>
                        <View style={{ width: 330, height: 200, top: 0, borderRadius: 10, }} />
                    </View>
                </SkeletonPlaceholder>
            </View>
            <View style={{ top: 80, left: 10 }}>
                <SkeletonPlaceholder>
                    <View style={{}}>
                        <View style={{ width: 380, height: 100, top: 0, borderRadius: 10, }} />
                    </View>
                </SkeletonPlaceholder>
            </View>
            <View style={{ top: 100, left: 10 }}>
                <SkeletonPlaceholder>
                    <View style={{}}>
                        <View style={{ width: 380, height: 100, top: 0, borderRadius: 10, }} />
                    </View>
                </SkeletonPlaceholder>
            </View>
            <View style={{ top: 120, left: 10 }}>
                <SkeletonPlaceholder>
                    <View style={{}}>
                        <View style={{ width: 380, height: 100, top: 0, borderRadius: 10, }} />
                    </View>
                </SkeletonPlaceholder>
            </View>
            <View style={{ top: 140, left: 10 }}>
                <SkeletonPlaceholder>
                    <View style={{}}>
                        <View style={{ width: 380, height: 250, top: 0, borderRadius: 10, }} />
                    </View>
                </SkeletonPlaceholder>
            </View>
            <View style={{ top: 160, left: 10 }}>
                <SkeletonPlaceholder>
                    <View style={{}}>
                        <View style={{ width: 380, height: 250, top: 0, borderRadius: 10, }} />
                    </View>
                </SkeletonPlaceholder>
            </View>
        </View>

    )
}

export default SkelatonEffectProductDetail