import { View, Text } from 'react-native'
import React from 'react'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder'
const SkelatonEffectEditProfile = () => {
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={{justifyContent:"center",alignItems:"center"}}>
                <View style={{top:15}}>
                    <SkeletonPlaceholder>
                        <View style={{ height: 120, width: 120, borderRadius: 60 }} />
                    </SkeletonPlaceholder>
                </View>
                <View style={{top:40}}>
                    <SkeletonPlaceholder>
                        <View style={{ height: 50, width: 350, borderRadius: 15 }} />
                    </SkeletonPlaceholder>
                </View>
                <View style={{top:50}}>
                    <SkeletonPlaceholder>
                        <View style={{ height: 50, width: 350, borderRadius: 15 }} />
                    </SkeletonPlaceholder>
                </View>
                <View style={{top:60}}>
                    <SkeletonPlaceholder>
                        <View style={{ height: 50, width: 350, borderRadius: 15 }} />
                    </SkeletonPlaceholder>
                </View>
                <View style={{top:70}}>
                    <SkeletonPlaceholder>
                        <View style={{ height: 50, width: 350, borderRadius: 15 }} />
                    </SkeletonPlaceholder>
                </View>
                <View style={{top:80}}>
                    <SkeletonPlaceholder>
                        <View style={{ height: 50, width: 350, borderRadius: 15 }} />
                    </SkeletonPlaceholder>
                </View>
                <View style={{top:90}}>
                    <SkeletonPlaceholder>
                        <View style={{ height: 50, width: 350, borderRadius: 15 }} />
                    </SkeletonPlaceholder>
                </View>
                <View style={{top:100}}>
                    <SkeletonPlaceholder>
                        <View style={{ height: 50, width: 350, borderRadius: 15 }} />
                    </SkeletonPlaceholder>
                </View>

            </View>
        </View>
    )
}

export default SkelatonEffectEditProfile