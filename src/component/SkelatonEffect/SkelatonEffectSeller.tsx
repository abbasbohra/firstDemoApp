import { View, Text, Dimensions } from 'react-native'
import React from 'react'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder'

const SkelatonEffectSeller = () => {
    return (
        <View>
            <View style={{ backgroundColor: "white" }}>
                <View style={{ left: 5 }}>
                    <SkeletonPlaceholder>
                        <View style={{ width: Dimensions.get('screen').width - 10, height: 180, borderRadius: 10 }} />
                    </SkeletonPlaceholder>
                </View>
                <View style={{ left: 35, marginTop: 40, }}>
                    <SkeletonPlaceholder>
                        <View style={{ width: 230, height: 20, borderRadius: 7 }} />
                    </SkeletonPlaceholder>
                </View>
                <View style={{ marginTop: 10, }}>
                    <SkeletonPlaceholder>
                        <View style={{ width: Dimensions.get('screen').width, height: 20, borderRadius: 7 }} />
                    </SkeletonPlaceholder>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ left: 20, marginTop: 20, }}>
                        <SkeletonPlaceholder>
                            <View style={{ width: 50, height: 50, borderRadius: 7 }} />
                        </SkeletonPlaceholder>
                    </View>
                    <View style={{ left: 35, top: 30 }}>
                        <SkeletonPlaceholder>
                            <View style={{ width: 230, height: 15, borderRadius: 7 }} />
                        </SkeletonPlaceholder>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', top: 10, left: 60, marginBottom: 80 }}>
                    <View style={{ left: 20, }}>
                        <SkeletonPlaceholder>
                            <View style={{ width: 50, height: 50, borderRadius: 7 }} />
                        </SkeletonPlaceholder>
                    </View>
                    <View style={{ left: 35, }}>
                        <SkeletonPlaceholder>
                            <View style={{ width: 50, height: 50, borderRadius: 7 }} />
                        </SkeletonPlaceholder>
                    </View>
                    <View style={{ left: 50, }}>
                        <SkeletonPlaceholder>
                            <View style={{ width: 50, height: 50, borderRadius: 7 }} />
                        </SkeletonPlaceholder>
                    </View>
                </View>


            </View>
            <View style={{ flexDirection: 'row' }}>
                <View style={{ width: 180, height: 260, backgroundColor: 'white', shadowColor: "black", shadowOffset: { width: 1, height: 1, }, shadowOpacity: 1, shadowRadius: 1, elevation: 3, margin: 10, borderRadius: 10 }}>
                    <View style={{ top: 20 }}>
                        <SkeletonPlaceholder>
                            <View style={{ width: 150, height: 160, left: 15, borderRadius: 5 }} />
                        </SkeletonPlaceholder>
                    </View>
                    <View style={{ top: 40 }}>
                        <SkeletonPlaceholder>
                            <View style={{ width: 100, height: 20, left: 15, borderRadius: 5 }} />
                        </SkeletonPlaceholder>
                    </View>
                    <View style={{ top: 50 }}>
                        <SkeletonPlaceholder>
                            <View style={{ width: 70, height: 20, left: 15, borderRadius: 5 }} />
                        </SkeletonPlaceholder>
                    </View>
                </View>
                <View style={{ width: 180, height: 260, backgroundColor: 'white', shadowColor: "black", shadowOffset: { width: 1, height: 1, }, shadowOpacity: 1, shadowRadius: 1, elevation: 3, margin: 10, borderRadius: 10 }}>
                    <View style={{ top: 20 }}>
                        <SkeletonPlaceholder>
                            <View style={{ width: 150, height: 160, left: 15, borderRadius: 5 }} />
                        </SkeletonPlaceholder>
                    </View>
                    <View style={{ top: 40 }}>
                        <SkeletonPlaceholder>
                            <View style={{ width: 100, height: 20, left: 15, borderRadius: 5 }} />
                        </SkeletonPlaceholder>
                    </View>
                    <View style={{ top: 50 }}>
                        <SkeletonPlaceholder>
                            <View style={{ width: 70, height: 20, left: 15, borderRadius: 5 }} />
                        </SkeletonPlaceholder>
                    </View>
                </View>

            </View>
        </View>
    )
}

export default SkelatonEffectSeller