import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator, Dimensions, StyleSheet, BackHandler } from 'react-native'
import React, { useEffect, useState } from 'react'
import { _makeAxiosGetRequest, _makeAxiosPostRequest } from '../../Service/axios'
import { endpoint } from '../../Service/endpoint'
import Header from '../../component/Header'
import Icon from 'react-native-vector-icons/Ionicons';
import LottieView from 'lottie-react-native'

const TrackOrder = ({ route, navigation }: { route: any, navigation: any }) => {
  const { orderId } = route.params
  const [orderDetail, setOrderDetail] = useState('');
  const [Deliveryaddress, setDeliveryAddress] = useState('');
  const [loading, setLoading] = useState(false)
  const [orderProductDetail, setOrderProductDetail] = useState([]);
  // console.log(orderId, 'orderid')






  const getOrderDetail = () => {
    setLoading(true)
    const url = `${endpoint.OrderDetailbyid}/${orderId}`
    _makeAxiosGetRequest(url, {}).then((res) => {
      // console.log(res.data)
      setOrderDetail(res.data.data)
      setOrderProductDetail(res.data.data[0]?.get_item)
      setLoading(false)
    }).catch((error) => {
      setLoading(false)
      console.log(error)
    })
  }
  // console.log('orderpr', orderProductDetail)
  useEffect(() => {
    getOrderDetail();
  }, [])
  const displayOrderStatus = () => {
    return (
      <View style={{ paddingBottom: 80 }}>
        <FlatList
          data={orderDetail}
          keyExtractor={(item: any) => item.id}
          renderItem={({ item, index }: { item: any, index: any }) => {
            const address = JSON?.parse(item?.address)
            return (
              <View style={{ top: 5, paddingBottom: 30 }}>
                <View style={{ top: 20, backgroundColor: 'white', height: 80 }}>
                  <View style={{ flexDirection: 'row', }}>
                    <Text style={{ color: 'black', fontWeight: '900', padding: 10 }}> Order#</Text>
                    <Text style={{ color: 'black', padding: 10, right: 23 }}> {item?.order_number}</Text>
                  </View>
                  <View style={{ borderBottomWidth: 1, borderColor: 'silver', width: '90%', left: 10, top: 20 }} />
                </View>
                <View style={{ backgroundColor: 'white', paddingBottom: 10 }}>
                  <Text style={{ color: 'black', fontSize: 15, fontWeight: '900', margin: 5 }}> Payment Detail </Text>
                  <Text style={{ color: "black", margin: 5, fontSize: 16, fontWeight: '500' }}> {item?.payment_method} -{item?.payment_status}</Text>
                  <Text style={{ color: "black", fontSize: 15, fontWeight: '500', left: 10 }}>{item?.transaction_id.toUpperCase()}</Text>
                </View>
                <View style={{ paddingBottom: 30, top: 10, margin: 5, backgroundColor: 'white' }}>
                  {orderProductDetail?.map((item: any, index: any) => (

                    <View style={{ backgroundColor: 'white', shadowColor: 'black', shadowOffset: { width: 1, height: 1 }, shadowOpacity: 1, shadowRadius: 1, elevation: 3 }}>
                      {item.select_option?.length === 0 ? null : <View style={{ left: 120, top: 80 }}>
                        {item?.select_option === null ? null : <View>
                          {item?.select_option?.map((item: any, index: any) => (
                            <View>
                              <Text> {item?.attr_type} : {item?.value}</Text>
                            </View>
                          ))}
                        </View>
                        }
                      </View>}
                      <View style={{ top: item?.select_option === null ? 80 : item?.select_option?.length > 1 ? 120 : 100, left: 120, position: 'absolute' }}>
                        <Text style={{ color: 'black' }}> {item?.quantity} x Rs {item?.offer_price} =  </Text>
                      </View>

                      {item?.product_detail?.map((item: any, index: any) => (
                        <View>
                          <View style={{ backgroundColor: '#F5F5F5', width: 110, height: 110 }}>
                            <Image source={{ uri: item?.ImageSrc }} resizeMode='contain' style={{ width: 105, height: 105, top: 5 }} />
                          </View>
                          <View style={{ position: 'absolute', left: 120 }}>
                            <Text style={{ color: 'black', fontWeight: '900' }}> {item?.brand}</Text>
                            <Text style={{ color: 'black', fontWeight: '900', width: 200, }} numberOfLines={1}>{item?.product_name}</Text>
                            <Text style={{ color: 'black', top: 43, left: 80, marginLeft: 10 }}> {item?.customer_cost}</Text>
                            <Icon name='chevron-forward-outline' size={25} style={{ left: 180 }} color={'grey'} />
                          </View>
                        </View>
                      ))}
                      <View style={{ flexDirection: 'row', top: -8, left: 110, }}>
                        <View style={{ backgroundColor: item?.status === 'Cancelled' ? "red" : 'green', width: 10, height: 10, borderRadius: 20, top: 7 }} />
                        <Text style={{ color: 'black', fontSize: 16 }}> {item?.status}</Text>
                      </View>

                    </View>

                  ))}
                </View>
                {item?.status === 'Cancelled' ? null : <TouchableOpacity onPress={() => navigation.navigate('ExampleOrderCancel', { orderId: item?.id, order_item_id: item?.get_item[0]?.id })} style={{ paddingBottom: 20, flexDirection: 'row', top: 10 }}>
                  <Text style={{ color: 'black', fontWeight: '900', fontSize: 18, margin: 10, left: 20 }}> Cancel </Text>
                  <Icon name='chevron-forward-outline' size={30} style={{ left: 230, margin: 10 }} color={'grey'} />

                </TouchableOpacity>}
                <View style={{ paddingBottom: 20, backgroundColor: 'white' }}>
                  <Text style={{ color: 'black', fontWeight: '900', fontSize: 18, margin: 10 }}> Delivery status</Text>
                  <Text style={{ color: 'black', fontWeight: '300', fontSize: 15, margin: 5, left: 10 }}> {item?.status}</Text>
                </View>
                <View style={{ paddingBottom: 20, backgroundColor: 'white', top: 5 }}>
                  <Text style={{ color: 'black', fontWeight: '900', fontSize: 18, margin: 10 }}> Delivery Address</Text>
                  <Text style={{ color: 'black', fontWeight: '300', fontSize: 15, margin: 5, left: 10 }}> {address?.name}</Text>
                  <Text style={{ color: 'black', fontWeight: '300', fontSize: 15, margin: 5, left: 10 }}> {address?.address},{address?.city},{address?.pincode},{`(${address?.state})`}</Text>

                </View>
                <View style={{ paddingBottom: 20, backgroundColor: 'white', top: 10 }}>

                  <Text style={{ color: 'black', fontWeight: '900', fontSize: 18, margin: 10 }}> Price Details</Text>

                  <View style={{ flexDirection: 'row' }}>
                    <Text style={{ color: 'black', fontSize: 15, margin: 10 }}> Product Price </Text>
                    <Text style={{ color: 'black', fontSize: 15, left: 200, margin: 10, marginLeft: -0 }}>Rs {item?.original_price}</Text>

                  </View>
                  <View style={{ flexDirection: 'row', }}>
                    <Text style={{ color: 'black', fontSize: 15, margin: 10 }}> Delivery Fee </Text>
                    <Text style={{ color: 'black', fontSize: 15, left: 200, margin: 10, marginRight: 10 }}> +Rs {item?.delivery_charges}</Text>
                  </View>
                  {parseInt(item?.discount_price) === 0 ? null : <View style={{ flexDirection: 'row', }}>
                    <Text style={{ color: 'black', fontSize: 15, margin: 10 }}> Discount Price </Text>
                    <Text style={{ color: 'black', fontSize: 15, left: 200, margin: 10, marginLeft: -10 }}> -{item?.discount_price}</Text>
                  </View>}
                  <View style={{ borderBottomWidth: 1, borderColor: 'silver', width: '97%', left: 10, top: 5, }} />
                  <View style={{ flexDirection: 'row', top: 10 }}>
                    <Text style={{ color: 'black', fontSize: 15, margin: 10, fontWeight: '900' }}> Order Total  </Text>
                    <Text style={{ color: 'black', fontSize: 15, left: 200, margin: 10, fontWeight: '900', marginLeft: -5 }}> Rs {item?.total_price}</Text>
                  </View>
                </View>
              </View>

            )
          }}
        />
      </View>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      <Header title='ORDER DETAIL' showShadow={true} cartleft={-10} onpress={() => navigation.goBack()} searchLeft={5} />


      {loading ? (
        <View style={{ top: 250, justifyContent: 'center', alignItems: 'center' }}>
          {/* <Text style={{ color: 'black', textAlign: "center", fontSize: 20, fontWeight: '500' }}> LOADING PLEASE WAIT...</Text> */}
          <LottieView style={{ width: 200, height: 200, }} source={require('../../component/Animations/Animation - 1699005800056.json')} autoPlay loop />

        </View>
      ) :
        orderDetail?.length == 0 ? (
          <View style={{ top: 200 }}>
            <Image source={{ uri: 'https://i.ibb.co/5GMS7qR/download-1.png' }} style={{ width: 120, height: 120, left: 110, tintColor: '#4B4B4B' }} resizeMode='contain' />
            <Text style={{ fontSize: 15, fontWeight: '800', color: "#4B4B4B", textAlign: "center", right: 20, margin: 5 }}>  Product Not  found</Text>
          </View>
        ) : (

          <View>
            {displayOrderStatus()}
          </View>
        )}
    </View>
  )
}
const style = StyleSheet.create({
  cancelbtn: {
    position: 'absolute',
    top: 320,
    left: 230

  }
})
export default TrackOrder