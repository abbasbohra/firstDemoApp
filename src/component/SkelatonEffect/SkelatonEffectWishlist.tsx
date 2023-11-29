import { View, Text, ScrollView, Dimensions } from 'react-native'
import React from 'react'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';


const SkelatonEffectWishlist = () => {
    return (
        <View style={{ backgroundColor: "white", flex: 1 }}>
            <View style={{ flexDirection: "row" }}>
                <View style={{}}>
                    <SkeletonPlaceholder>
                        <View style={{ width: 120, height: Dimensions.get('screen').height }} />
                    </SkeletonPlaceholder>
                </View>
                <View >
                    <View style={{ left: 0, flexDirection: 'row' }}>
                        <SkeletonPlaceholder>
                            <View style={{}}>
                                <View style={{ width: 80, height: 80, borderRadius: 20, margin: 5 }} />
                                <View style={{ width: 80, height: 80, borderRadius: 20, margin: 5 }} />
                                <View style={{ width: 80, height: 80, borderRadius: 20, margin: 5 }} />
                            </View>
                        </SkeletonPlaceholder>
                    </View>
                    <View style={{ left: 0 }}>
                        <SkeletonPlaceholder>
                            <View style={{}}>
                                <View style={{ width: 80, height: 80, borderRadius: 20, margin: 5 }} />
                                <View style={{ width: 80, height: 80, borderRadius: 20, margin: 5 }} />
                                <View style={{ width: 80, height: 80, borderRadius: 20, margin: 5 }} />
                            </View>
                        </SkeletonPlaceholder>
                    </View>
                    <View style={{ left: 0 }}>
                        <SkeletonPlaceholder>
                            <View style={{}}>
                                <View style={{ width: 80, height: 80, borderRadius: 20, margin: 5 }} />
                                <View style={{ width: 80, height: 80, borderRadius: 20, margin: 5 }} />
                                <View style={{ width: 80, height: 80, borderRadius: 20, margin: 5 }} />
                            </View>
                        </SkeletonPlaceholder>
                    </View>
                    <View style={{ left: 90, position: 'absolute' }}>
                        <SkeletonPlaceholder>
                            <View style={{}}>
                                <View style={{ width: 80, height: 80, borderRadius: 20, margin: 5 }} />
                                <View style={{ width: 80, height: 80, borderRadius: 20, margin: 5 }} />
                                <View style={{ width: 80, height: 80, borderRadius: 20, margin: 5 }} />
                            </View>
                        </SkeletonPlaceholder>
                    </View>
                    <View style={{ left: 180, position: 'absolute' }}>
                        <SkeletonPlaceholder>
                            <View style={{}}>
                                <View style={{ width: 80, height: 80, borderRadius: 20, margin: 5 }} />
                                <View style={{ width: 80, height: 80, borderRadius: 20, margin: 5 }} />
                                <View style={{ width: 80, height: 80, borderRadius: 20, margin: 5 }} />
                            </View>
                        </SkeletonPlaceholder>
                    </View>
                    <View style={{ position: 'absolute', top: 280, left: 90 }}>
                        <SkeletonPlaceholder>
                            <View style={{}}>
                                <View style={{ width: 80, height: 80, borderRadius: 20, margin: 5 }} />
                                <View style={{ width: 80, height: 80, borderRadius: 20, margin: 5 }} />
                                <View style={{ width: 80, height: 80, borderRadius: 20, margin: 5 }} />
                            </View>
                        </SkeletonPlaceholder>
                    </View>
                    <View style={{ position: 'absolute', top: 280, left: 180 }}>
                        <SkeletonPlaceholder>
                            <View style={{}}>
                                <View style={{ width: 80, height: 80, borderRadius: 20, margin: 5 }} />
                                <View style={{ width: 80, height: 80, borderRadius: 20, margin: 5 }} />
                                <View style={{ width: 80, height: 80, borderRadius: 20, margin: 5 }} />
                            </View>
                        </SkeletonPlaceholder>
                    </View>

                    <View style={{ position: 'absolute', top: 550, left: 90 }}>
                        <SkeletonPlaceholder>
                            <View style={{}}>
                                <View style={{ width: 80, height: 80, borderRadius: 20, margin: 5 }} />
                                <View style={{ width: 80, height: 80, borderRadius: 20, margin: 5 }} />
                                <View style={{ width: 80, height: 80, borderRadius: 20, margin: 5 }} />
                            </View>
                        </SkeletonPlaceholder>
                    </View>
                    <View style={{ position: 'absolute', top: 550, left: 180 }}>
                        <SkeletonPlaceholder>
                            <View style={{}}>
                                <View style={{ width: 80, height: 80, borderRadius: 20, margin: 5 }} />
                                <View style={{ width: 80, height: 80, borderRadius: 20, margin: 5 }} />
                                <View style={{ width: 80, height: 80, borderRadius: 20, margin: 5 }} />
                            </View>
                        </SkeletonPlaceholder>
                    </View>
                </View>

            </View>

        </View>

    )
}

export default SkelatonEffectWishlist
{/* <View style={{ left: 130, bottom: 800 }}>
<View style={{ flexDirection: 'row', }}>
    <View style={{ width: 80, height: 80, borderRadius: 20, margin: 5 }} />
    <View style={{ width: 80, height: 80, borderRadius: 20, margin: 5 }} />
    <View style={{ width: 80, height: 80, borderRadius: 20, margin: 5 }} />

</View>
<View style={{ flexDirection: 'row' }}>
    <View style={{ width: 80, height: 80, borderRadius: 20, margin: 5 }} />
    <View style={{ width: 80, height: 80, borderRadius: 20, margin: 5 }} />
    <View style={{ width: 80, height: 80, borderRadius: 20, margin: 5 }} />

</View>
<View style={{ flexDirection: 'row' }}>
    <View style={{ width: 80, height: 80, borderRadius: 20, margin: 5 }} />
    <View style={{ width: 80, height: 80, borderRadius: 20, margin: 5 }} />
    <View style={{ width: 80, height: 80, borderRadius: 20, margin: 5 }} />

</View>
<View style={{ flexDirection: 'row' }}>
    <View style={{ width: 80, height: 80, borderRadius: 20, margin: 5 }} />
    <View style={{ width: 80, height: 80, borderRadius: 20, margin: 5 }} />
    <View style={{ width: 80, height: 80, borderRadius: 20, margin: 5 }} />

</View>
<View style={{ flexDirection: 'row' }}>
    <View style={{ width: 80, height: 80, borderRadius: 20, margin: 5 }} />
    <View style={{ width: 80, height: 80, borderRadius: 20, margin: 5 }} />
    <View style={{ width: 80, height: 80, borderRadius: 20, margin: 5 }} />

</View>
<View style={{ flexDirection: 'row' }}>
    <View style={{ width: 80, height: 80, borderRadius: 20, margin: 5 }} />
    <View style={{ width: 80, height: 80, borderRadius: 20, margin: 5 }} />
    <View style={{ width: 80, height: 80, borderRadius: 20, margin: 5 }} />

</View>
<View style={{ flexDirection: 'row' }}>
    <View style={{ width: 80, height: 80, borderRadius: 20, margin: 5 }} />
    <View style={{ width: 80, height: 80, borderRadius: 20, margin: 5 }} />
    <View style={{ width: 80, height: 80, borderRadius: 20, margin: 5 }} />

</View>
<View style={{ flexDirection: 'row' }}>
    <View style={{ width: 80, height: 80, borderRadius: 20, margin: 5 }} />
    <View style={{ width: 80, height: 80, borderRadius: 20, margin: 5 }} />
    <View style={{ width: 80, height: 80, borderRadius: 20, margin: 5 }} />

</View>
</View> */}