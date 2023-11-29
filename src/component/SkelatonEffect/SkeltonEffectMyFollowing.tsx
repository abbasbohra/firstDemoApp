import { View, Text, Dimensions } from 'react-native'
import React from 'react'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder'

const SkeltonEffectMyFollowing = () => {
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={{ width: Dimensions.get('screen').width-20, left: 10, backgroundColor: 'white', shadowColor: 'black', shadowOffset: { width: 1, height: 1 }, shadowOpacity: 1, shadowRadius: 1, elevation: 5 }}>
                <View style={{margin:10,marginBottom:20}}>
                    <SkeletonPlaceholder>
                        <View style={{ width: 100, height: 100, borderRadius: 50 }} />
                    </SkeletonPlaceholder>
                </View>
                <View style={{margin:10,position:"absolute",left:120,top:30}}>
                    <SkeletonPlaceholder>
                        <View style={{ width: 150, height: 15,borderRadius:5}} />
                    </SkeletonPlaceholder>
                </View>
                <View style={{margin:10,position:"absolute",left:250,top:100}}>
                    <SkeletonPlaceholder>
                        <View style={{ width: 100, height: 15,borderRadius:5}} />
                    </SkeletonPlaceholder>
                </View>
            </View>
            <View style={{ width: Dimensions.get('screen').width-20, left: 10, backgroundColor: 'white', shadowColor: 'black', shadowOffset: { width: 1, height: 1 }, shadowOpacity: 1, shadowRadius: 1, elevation: 5,top:10 }}>
                <View style={{margin:10,marginBottom:20}}>
                    <SkeletonPlaceholder>
                        <View style={{ width: 100, height: 100, borderRadius: 50 }} />
                    </SkeletonPlaceholder>
                </View>
                <View style={{margin:10,position:"absolute",left:120,top:30}}>
                    <SkeletonPlaceholder>
                        <View style={{ width: 150, height: 15,borderRadius:5}} />
                    </SkeletonPlaceholder>
                </View>
                <View style={{margin:10,position:"absolute",left:250,top:100}}>
                    <SkeletonPlaceholder>
                        <View style={{ width: 100, height: 15,borderRadius:5}} />
                    </SkeletonPlaceholder>
                </View>
            </View>
            <View style={{ width: Dimensions.get('screen').width-20, left: 10, backgroundColor: 'white', shadowColor: 'black', shadowOffset: { width: 1, height: 1 }, shadowOpacity: 1, shadowRadius: 1, elevation: 5,top:20 }}>
                <View style={{margin:10,marginBottom:20}}>
                    <SkeletonPlaceholder>
                        <View style={{ width: 100, height: 100, borderRadius: 50 }} />
                    </SkeletonPlaceholder>
                </View>
                <View style={{margin:10,position:"absolute",left:120,top:30}}>
                    <SkeletonPlaceholder>
                        <View style={{ width: 150, height: 15,borderRadius:5}} />
                    </SkeletonPlaceholder>
                </View>
                <View style={{margin:10,position:"absolute",left:250,top:100}}>
                    <SkeletonPlaceholder>
                        <View style={{ width: 100, height: 15,borderRadius:5}} />
                    </SkeletonPlaceholder>
                </View>
            </View>
            <View style={{ width: Dimensions.get('screen').width-20, left: 10, backgroundColor: 'white', shadowColor: 'black', shadowOffset: { width: 1, height: 1 }, shadowOpacity: 1, shadowRadius: 1, elevation: 5,top:30 }}>
                <View style={{margin:10,marginBottom:20}}>
                    <SkeletonPlaceholder>
                        <View style={{ width: 100, height: 100, borderRadius: 50 }} />
                    </SkeletonPlaceholder>
                </View>
                <View style={{margin:10,position:"absolute",left:120,top:30}}>
                    <SkeletonPlaceholder>
                        <View style={{ width: 150, height: 15,borderRadius:5}} />
                    </SkeletonPlaceholder>
                </View>
                <View style={{margin:10,position:"absolute",left:250,top:100}}>
                    <SkeletonPlaceholder>
                        <View style={{ width: 100, height: 15,borderRadius:5}} />
                    </SkeletonPlaceholder>
                </View>
            </View>
            <View style={{ width: Dimensions.get('screen').width-20, left: 10, backgroundColor: 'white', shadowColor: 'black', shadowOffset: { width: 1, height: 1 }, shadowOpacity: 1, shadowRadius: 1, elevation: 5,top:40 }}>
                <View style={{margin:10,marginBottom:20}}>
                    <SkeletonPlaceholder>
                        <View style={{ width: 100, height: 100, borderRadius: 50 }} />
                    </SkeletonPlaceholder>
                </View>
                <View style={{margin:10,position:"absolute",left:120,top:30}}>
                    <SkeletonPlaceholder>
                        <View style={{ width: 150, height: 15,borderRadius:5}} />
                    </SkeletonPlaceholder>
                </View>
                <View style={{margin:10,position:"absolute",left:250,top:100}}>
                    <SkeletonPlaceholder>
                        <View style={{ width: 100, height: 15,borderRadius:5}} />
                    </SkeletonPlaceholder>
                </View>
            </View>
            <View style={{ width: Dimensions.get('screen').width-20, left: 10, backgroundColor: 'white', shadowColor: 'black', shadowOffset: { width: 1, height: 1 }, shadowOpacity: 1, shadowRadius: 1, elevation: 5,top:50 }}>
                <View style={{margin:10,marginBottom:20}}>
                    <SkeletonPlaceholder>
                        <View style={{ width: 100, height: 100, borderRadius: 50 }} />
                    </SkeletonPlaceholder>
                </View>
                <View style={{margin:10,position:"absolute",left:120,top:30}}>
                    <SkeletonPlaceholder>
                        <View style={{ width: 150, height: 15,borderRadius:5}} />
                    </SkeletonPlaceholder>
                </View>
                <View style={{margin:10,position:"absolute",left:250,top:100}}>
                    <SkeletonPlaceholder>
                        <View style={{ width: 100, height: 15,borderRadius:5}} />
                    </SkeletonPlaceholder>
                </View>
            </View>
        </View>
    )
}

export default SkeltonEffectMyFollowing