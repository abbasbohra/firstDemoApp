import { View, Text, Dimensions, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../../component/Header'
import { _makeAxiosGetRequest } from '../../Service/axios'
import { endpoint } from '../../Service/endpoint'
import { BorderlessButton, FlatList } from 'react-native-gesture-handler'
import SkeltonEffectMyFollowing from '../../component/SkelatonEffect/SkeltonEffectMyFollowing'

const VendorFollowingList = ({ navigation }: { navigation: any }) => {
    const [followings, setFollowings] = useState([])
    const [loading, setLoading] = useState(false)
    const getFollowingLList = () => {
        setLoading(true)
        _makeAxiosGetRequest(endpoint.myFollowings, {}).then((res) => {
            setFollowings(res.data.users)
            setLoading(false)
        }).catch((error) => {
            setLoading(false)
            console.log(error)
        })
    }
    useEffect(() => {
        getFollowingLList()
    }, [])
    const formateDate = ({ date }: { date: any }) => {
        const originalDate = date
        const FormateDate = new Date(originalDate)
        const options: any = { year: 'numeric', month: 'short', day: 'numeric' };
        const ForamtedDate = FormateDate.toLocaleDateString('en-US', options);
        return (
            <View style={{ position: 'absolute', left: 250, top: 100 }}>
                <Text style={{ color: 'black', fontWeight: '600' }}> {ForamtedDate}</Text>
            </View>
        )
    }
    return (
        <View style={{ flex: 1, backgroundColor: "white" }}>
            <Header title='My Following' onpress={() => navigation.goBack()} cartleft={-10} searchLeft={5} showShadow={true} />
            {loading ? (<SkeltonEffectMyFollowing />) : (<View style={{ top: 10 }}>
                <FlatList
                    data={followings}
                    keyExtractor={(item: any) => item.id}
                    renderItem={({ item, index }: { item: any, index: any }) => {
                        return (
                            <TouchableOpacity onPress={() => navigation.navigate('ExampleProductByVendor', { vendorId: item?.id })} style={{ width: Dimensions.get('screen').width - 20, backgroundColor: 'white', shadowColor: "black", shadowOffset: { width: 1, height: 1 }, shadowOpacity: 1, shadowRadius: 1, elevation: 5, left: 5, paddingBottom: 10, margin: 5 }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ width: 100, height: 100, backgroundColor: "white", shadowColor: "black", shadowOffset: { width: 1, height: 1 }, shadowOpacity: 1, shadowRadius: 1, elevation: 5, borderRadius: 50, margin: 10 }}>
                                        <Image source={{ uri: item?.profile }} style={{ width: 100, height: 100, borderRadius: 50 }} />
                                    </View>
                                    <View style={{ top: 40, height: 50, width: 250 }}>
                                        <Text style={{ color: "black", fontSize: 18, fontWeight: '900', }}> {item?.username}</Text>
                                    </View>
                                    {formateDate({ date: item?.created_at })}
                                </View>
                            </TouchableOpacity>
                        )
                    }}
                />
            </View>)}
        </View>
    )
}

export default VendorFollowingList