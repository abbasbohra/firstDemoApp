import { View, Text, FlatList, TouchableOpacity, ToastAndroid, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FAB } from 'react-native-paper'
import Icon from 'react-native-vector-icons/Ionicons'
import Header from '../../component/Header'
import firestore from '@react-native-firebase/firestore'
import { firebase } from "@react-native-firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useIsFocused } from '@react-navigation/native'
import { _makeAxiosDeleteRequest, _makeAxiosGetRequest } from '../../Service/axios'
import { endpoint } from '../../Service/endpoint'
import axios from 'axios'


type adresss = {
  id: any
  state: string
  city: string
  pincode: any
  address_type: string
  address: string
  name: any
}

const Address = ({ navigation }: { navigation: any }) => {
  const [adress, setAddress] = useState<adresss[]>([]);
  const isFocused = useIsFocused();

  const getAddress = async () => {
    _makeAxiosGetRequest(endpoint.getAllAddress, {}).then((res) => {
      // console.log(res.data)
      setAddress(res.data)
    }).catch((error) => {
      console.log(error)
    })

  }

  useEffect(() => {
    getAddress();
  }, [isFocused])

  const deleteAddress = ({ id }: { id: any }) => {
    const deleteUrl = `${endpoint.deleteAddress}${id}`
    _makeAxiosDeleteRequest(deleteUrl, {}).then((res: any) => {
      // console.log(res.data)
      getAddress()
      ToastAndroid.show(res.message, ToastAndroid.TOP,)
    }).catch((error) => {
      console.log(error)
      Alert.alert(error.response.data.message)

    })
  }
  return (
    <View style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      <Header onpress={() => navigation.goBack()} title={'ADDRESS'} showShadow={true} cartleft={-10} searchLeft={5} />
      <View style={{ top: 20, paddingBottom: 80 }}>


        <FlatList
          data={adress}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return (
              <View style={{ margin: 5, width: '100%', alignContent: "center", left: 0, backgroundColor: "white" }}>
                <View style={{ top: 30 }}>
                  <Text style={{ color: "black", fontWeight: '900', fontSize: 15, left: 15, }}> {item.name.toLowerCase()}</Text>
                  <View style={{ width: '73%', margin: 5 }}>
                    <Text style={{ color: "black", fontSize: 15, marginLeft: 15, }}>{item?.address},{item?.city},{item?.pincode},{item?.state},{item?.landmark}</Text>
                  </View>

                </View>
                <View style={{ top: -60, margin: 10, left: 20 }}>
                  <View style={{ backgroundColor: "white", borderRadius: 30, marginLeft: 5, left: 280, top: -10, borderWidth: 1, borderColor: '#27AAE1', width: '13%' }}>
                    <Text style={{ padding: 5, color: "#27AAE1", fontSize: 10, left: 2.5 }}>{item?.address_type} </Text>
                  </View>
                  <Icon name='create' color='black' size={25} style={{ left: 300, top: 25, position: "absolute" }} onPress={() => navigation.navigate('AddAddress', { type: 'edit', Data: item })} />
                  <Icon name='ios-trash-outline' color='black' size={25} style={{ left: 300, top: 60, position: "absolute" }} onPress={() => deleteAddress({ id: item.id })} />
                </View>
              </View>
            )
          }}
        />

      </View>
      <View style={{ flex: 1, justifyContent: 'flex-end', }}>
        <FAB
          onPress={() => navigation.navigate('AddAddress', { type: 'new' })}
          icon={() => <Icon name='ios-add' color='white' size={30} style={{ left: 5, top: 5 }} />}
          size='small'
          style={{ width: 50, borderRadius: 150, height: 50, top: -80, left: 300, backgroundColor: "#27AAE1" }}
          mode='elevated'
          rippleColor={'#27AAE1'}
          animated={false}
        />
      </View>

    </View>
  )
}

export default Address