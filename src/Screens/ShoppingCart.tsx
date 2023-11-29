import { View, Text, FlatList, Image, Dimensions, Linking, ToastAndroid, Alert, ScrollView, Modal, Pressable, TextInput, ActivityIndicator } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import Icon from 'react-native-vector-icons/Ionicons'
import firestore from '@react-native-firebase/firestore'
import { firebase } from "@react-native-firebase/auth";
import { useIsFocused } from '@react-navigation/native'
import { Divider } from 'react-native-paper';
import { AirbnbRating } from 'react-native-ratings';
import { BlurView } from '@react-native-community/blur';
import { NetInfoCellularGeneration } from '@react-native-community/netinfo';
import { _makeAxiosGetRequest } from '../Service/axios';
import { endpoint } from '../Service/endpoint';

type caetitemdata = {
  ProductQty: number
  ProductPrice: number
  ProductName: string
  ProductImage: string[]
  CartUid: string
  ProductRating: number
  ProductDiscription: string
  discountPercentage: number
  ProductDiscount: number
  ProductSize: number
  ProductCategory: string

}





const ShoppingCart = ({ navigation }: { navigation: any }) => {
  const [cartItemData, setCartItemData] = useState<caetitemdata[]>([]);
  const [visible, setVisible] = useState<boolean>(false)
  const [qty, setQty] = useState<any>(0)
  const [cartID, setCartId] = useState<string>('');
  const isFocused = useIsFocused();
  const [color, setColor] = useState<boolean>(false)
  const textClearRef = useRef<any>()
  const [loading, setLoading] = useState<boolean>(true)


  console.log(qty)
  const getCartItem = async () => {
    setLoading(true)
    try {
      const documentSnapShot = await firestore().collection('cartItem').where('uid', '==', firebase.auth().currentUser?.uid).get()
      const data: any = documentSnapShot.docs.map(doc => doc.data())
      // console.log('cartitem', data)
      setCartItemData(data)
      setLoading(false)
    } catch (error) {
      console.log(error)
    }

  }
  useEffect(() => {
    getCartItem();
    getCartData()
  }, [isFocused])

  const getCartData = () => {
    _makeAxiosGetRequest(endpoint.checkOut, {}).then((res) => {
      console.log(res)
      setCartItemData(res.data.data)
    }).catch((err) => {
      console.log(err)
    })
  }




  const getTotal = () => {
    const Total = cartItemData.reduce((a, b) => {
      return (
        a + Math.round(b.ProductPrice * b.ProductQty)
      )
    }, 0)
    return (
      Total
    )
  }

  const getTotalPrice = () => {
    const Total = cartItemData.reduce((a, b) => {
      const initialPrice = b.ProductPrice * b.ProductQty
      const Discount = 1 - Math.round(b.ProductDiscount) / 100
      const actualPrice = initialPrice / Discount
      return (
        a + Math.round(actualPrice)
      )
    }, 0)
    return (
      Total
    )
  }



  const getDiscount = () => {
    const Discount = cartItemData.reduce((a, b) => {
      return (
        a + Math.round(b.ProductDiscount)
      )

    }, 0)
    return (
      Math.round(Discount)
    )
  }

  const getActualPrice = ({ items }: { items: any }) => {
    const initialPrice = items.ProductPrice * items.ProductQty
    const Discountis = 1 - Math.round(items.ProductDiscount) / 100
    const actualPrice = Math.round(initialPrice / Discountis)
    return (
      <View style={{ bottom: 130, left: 140 }}>
        <View style={{ width: 40, borderBottomWidth: 0.5, borderBottomColor: "#878787", top: 10 }} />
        <Text style={{ color: "#878787", marginRight: 20 }}> ${actualPrice} </Text>

      </View>
    )
  }

  const onRemove = ({ uid }: { uid: string }) => {
    setLoading(true)
    // console.log(uid)
    firestore().collection('cartItem').doc(uid).delete().then(() => {
      getCartItem();
      setLoading(false)
      ToastAndroid.show('remove Item', ToastAndroid.SHORT)
    })

  }

  const addQty = () => {
    setLoading(true)
    // setQty(setQty)
    // console.log('productQty', qty)
    firestore().collection('cartItem').doc(cartID).update({
      ProductQty: Number(qty)
    }).then(() => {
      getCartItem();
      setVisible(false)
      ToastAndroid.show('Quantatiy add', ToastAndroid.SHORT)
      console.log(qty)
      setLoading(false)
      setQty(1)
    })
  }

  const selectQty = ({ uid }: { uid: string }) => {
    setVisible(true)
    setCartId(uid)
    console.log('select', uid)
  }

  useEffect(() => {
    if (qty >= 1) {
      setColor(true)
    } else { null }
  })
  useEffect(() => {
    if (cartItemData != null) {
      console.log('empty')
    } else { console.log('full') }
  })

  const deliveryDay = () => {
    const day = new Date().getDay() + 4
    const date = new Date().getDate() + 4
    const month = new Date().getMonth() + 1
    const Dates = day == 0 ? 'sun' : day == 1 ? 'Mon' : day == 2 ? "Tues" : day == 3 ? "Wed" : day == 4 ? "Thu" : day == 5 ? "Fri" : day == 6 ? "Sat" : null
    const Months = month == 0 ? 'Jan' : month == 2 ? 'Feb' : month == 3 ? 'Mar' : month == 4 ? 'Apri' : month == 5 ? 'May' : month == 6 ? 'June' : month == 7 ? 'July' : month == 8 ? 'Aug' : month == 9 ? 'Sept' : month == 10 ? 'Oct' : month == 11 ? 'Nov' : month == 12 ? 'Dec' : null

    return (
      <View>
        <Text style={{ color: "black", bottom: 0 }}>{Dates} {date} {Months}</Text>
      </View>
    )
  }
  return (
    <ScrollView contentContainerStyle={{ backgroundColor: "white", flex: 1, width: Dimensions.get('screen').width, height: Dimensions.get('screen').height }}>
      <View style={{ top: 10, left: 130, flexDirection: 'row' }}>
        <Icon name='arrow-back' color='black' size={35} style={{ right: 110, bottom: 5 }} onPress={() => navigation.navigate('Home')} />
        <Text style={{ color: "black", fontSize: 20, fontWeight: '800', right: 30 }}>ShoppingCart</Text>
      </View>
      <View style={{ height: 540 }}>
        {cartItemData.length != 0 ?
          <FlatList

            style={{}}
            data={cartItemData}
            keyExtractor={item => item.CartUid}
            renderItem={({ item }) => {
              return (
                <View style={{ backgroundColor: "white", margin: 10, height: 195, width: Dimensions.get('screen').width, shadowColor: "black", shadowOffset: { width: 1, height: 1 }, shadowOpacity: 1, shadowRadius: 2, elevation: 5, right: 10 }}>
                  <View style={{ flexDirection: 'row', alignItems: "center" }}>
                    <Image source={{ uri: item.ProductImage }} resizeMode='contain' style={{ width: 100, height: 100, top: 10, marginLeft: 10 }} />
                    <Text style={{ color: "black", fontWeight: '600', fontSize: 15, bottom: 25, textAlign: "center", right: item.ProductName.length > 11 ? -10 : -5 }}> {item.ProductName.length > 20 ? item.ProductName.substring(0, 25) + '...' : item.ProductName}</Text>
                  </View>
                  <Icon name='ios-trash-outline' color='grey' size={15} style={{ bottom: 90, left: 355 }} onPress={() => onRemove({ uid: item.CartUid })} />
                  <Text style={{ bottom: item.ProductName.length > 15 ? 80 : 70, left: 123, color: "black", fontSize: 10 }}>{item.ProductDiscription.length > 20 ? item.ProductDiscription.substring(0, 50) + '...' : item.ProductDiscription}</Text>
                  {item.ProductCategory == `men's clothing` || item.ProductCategory == `women's clothing` || item.ProductCategory == `"womens-dresses` || item.ProductCategory == `mens-shirts` || item.ProductCategory == 'womens-shoes' || item.ProductCategory == 'mens-shoes' ? <Text style={{ color: "black", bottom: 65, left: 120 }}> Size : {item.ProductSize}</Text> : null}
                  <View style={{ flexDirection: "row", right: 20, top: 70 }}>
                    {getActualPrice({ items: item })}
                    <Text style={{ color: "green", textAlign: 'center', bottom: 132, left: 100, fontWeight: 'bold', fontSize: 18, marginLeft: 20 }}> ${Math.round(item.ProductPrice) * item.ProductQty}</Text>
                    <Text style={{ color: "green", bottom: 130, left: 100, marginLeft: 10 }}> {Math.round(item.ProductDiscount)}% off </Text>

                  </View>
                  <AirbnbRating
                    count={5}
                    defaultRating={item.ProductRating}
                    reviewSize={20}
                    size={15}
                    showRating={false}
                    selectedColor='green'
                    starContainerStyle={{ bottom: 50, right: 20 }}
                  />
                  <View style={{ bottom: 50, left: 18, borderWidth: 1, borderColor: "silver", width: 80, height: 30 }}>
                    <Pressable style={{ flexDirection: 'row', }} onPress={() => selectQty({ uid: item.CartUid })}>
                      <Text style={{ color: "black", right: 2.5, margin: 5, marginLeft: 5, fontSize: 11.6, fontWeight: "bold" }}> Qty:</Text>
                      <Text style={{ color: "black", margin: 5, fontSize: 12, fontWeight: 'bold', right: 15 }}> {item.ProductQty}</Text>
                      <Icon name='caret-down-sharp' size={15} color={'black'} style={{ margin: 5, right: 15 }} />
                    </Pressable>
                  </View>
                  <View style={{ position: "absolute", top: 160, right: 10, flexDirection: "row" }}>
                    <Text style={{ color: "black", top: 0 }}> Delivery by </Text>
                    <Text style={{ top: 0, right: 5 }}> {deliveryDay()}</Text>
                  </View>
                </View>
              )

            }}
          />
          : <><Text style={{ textAlign: "center", color: 'black', fontSize: 20, top: 250 }}> No Item In Cart!! </Text>
            <Image source={{ uri: 'https://media.tenor.com/8BeuRyZSb90AAAAj/shopping-cart-shopping.gif' }} style={{ width: 250, height: 263, bottom: 100, tintColor: "#626ABB" }} /></>
        }
      </View>

      <View style={{ borderTopWidth: 1, bottom: 0, borderColor: "silver", height: Dimensions.get('screen').height - 70, position: "relative" }}>
        <View style={{ margin: 5, flexDirection: "row" }}>
          <Text style={{ color: "black", fontSize: 15 }}> Total Item   </Text>
          <Text style={{ color: "black", left: 255 }}> {cartItemData.length} </Text>
        </View>
        <View style={{ margin: 5, flexDirection: "row" }}>
          <Text style={{ color: "black", fontSize: 15 }}> Sub Total </Text>
          <Text style={{ color: "black", left: getTotal() > 0 ? 260 : 260, fontSize: 12 }}> ${getTotalPrice()} </Text>
        </View>
        <View style={{ margin: 5, flexDirection: "row" }}>
          <Text style={{ color: "black", fontSize: 15 }}> Discount </Text>
          <Text style={{ color: "black", left: getDiscount() > 10 ? 250 || getDiscount() > 100 ? 260 : 270 : 270, fontSize: 15 }}> ${getTotalPrice() - getTotal()} </Text>
        </View>
        <View style={{ margin: 5, flexDirection: "row" }}>
          <Text style={{ color: "black", fontSize: 15 }}> Total  </Text>
          <Text style={{ color: "black", left: getTotal() > 100 ? 100 || getTotal() > 1000 ? 255 : 265 : 280, fontSize: 25 }}>${getTotal()} </Text>
        </View>
        <View style={{ backgroundColor: '#626ABB', width: 360, left: 10, borderRadius: 10, shadowColor: "black", shadowOffset: { width: 1, height: 1 }, shadowOpacity: 1, shadowRadius: 1, elevation: 5 }}>
          <Text style={{ color: "white", textAlign: "center", margin: 5, fontSize: 20, fontWeight: '800', left: 5 }} onPress={() => { getTotal() == 0 ? Alert.alert('Your Cart are empty ') : navigation.navigate('CheckOut') }}>Checkout  </Text>
        </View>
      </View>
      <View>
        <Modal
          visible={visible}
          onRequestClose={() => setVisible(false)}
          transparent={true}
        >
          <BlurView blurType='chromeMaterialDark' style={{ width: 350, height: 140, backgroundColor: 'white', top: 300, left: 25, shadowColor: "black", shadowOffset: { width: 1, height: 1 }, shadowOpacity: 1, shadowRadius: 1, elevation: 10, alignContent: 'center', justifyContent: "center", alignItems: "center", borderRadius: 55 }}>

            <View style={{ borderRadius: 10 }}>
              <View style={{ margin: 5 }}>
                <Text style={{ color: "black", bottom: -10, right: -10, fontWeight: 'bold', fontSize: 15 }}> Enter quantity </Text>
                <TextInput
                  value={qty}
                  onChange={() => setColor(true)}
                  onChangeText={setQty}
                  style={{ right: -10, bottom: -10 }}
                  placeholder='Quantity'
                  placeholderTextColor='black'
                  maxLength={6}
                  cursorColor='blue'
                  keyboardType='number-pad'
                  clearButtonMode='always'
                  ref={textClearRef}

                />
              </View>
              <View style={{ borderTopColor: "silver", borderTopWidth: 1, width: 350, bottom: -21, }} />
              <View style={{ flexDirection: "row", top: 16, height: 50, }}>
                <View style={{ top: 13, left: 80, }}>
                  <Text style={{ color: "black", }} onPress={() => setVisible(false)}> CANCEL </Text>
                </View>
                <View style={{ borderLeftWidth: 0.5, borderLeftColor: "grey", left: 110, bottom: -5 }} />
                <View style={{ left: 160, bottom: -4 }}>
                  <Text style={{ color: color ? "#2874F0" : "silver", top: 10 }} onPress={() => color ? addQty() : null}> APPLY </Text>
                </View>
              </View>

            </View>
          </BlurView>

        </Modal>
        <Modal
          visible={loading}
          onRequestClose={() => setLoading(false)}
          transparent={true}
        >
          <BlurView style={{ left: 0, top: 300 }}>
            <View style={{ justifyContent: "center", alignContent: "center", alignItems: "center", borderRadius: 20 }}>
              <ActivityIndicator color={'red'} size={35} />
              <Text> Loading....</Text>
            </View>
          </BlurView>
        </Modal>
      </View>
    </ScrollView>
  )
}

export default ShoppingCart





{/* <View style={{ top: 10 }}>
<View style={{ backgroundColor: "white", height: 185, width: Dimensions.get('window').width, alignItems: "center", flexDirection: 'row', marginTop: 5, shadowColor: "black", shadowOffset: { width: 1, height: 1 }, shadowRadius: 5, shadowOpacity: 1, elevation: 5, }}>
  <Image source={{ uri: item.ProductImage }} resizeMode='contain' style={{ width: 100, height: 100, top: -30, marginLeft: 10 }} />
  <Text style={{ color: "black", fontWeight: '600', fontSize: 15, bottom: 60, textAlign: "center" }}> {item.ProductName.length > 20 ? item.ProductName.substring(0, 25) + '...' + '\n' + item.ProductName.substring(25, 50) : item.ProductName}</Text>
</View>
<Icon name='ios-trash-outline' color='grey' size={15} style={{ bottom: 170, left: 360 }} onPress={() => onRemove({ uid: item.CartUid })} />
<View style={{ bottom: 10, right: 50 }}>
  <Text style={{ bottom: 135, left: 170, color: "black", fontSize: 10 }}>{item.ProductDiscription.length > 20 ? item.ProductDiscription.substring(0, 50) + '...' : item.ProductDiscription}</Text>
  {item.ProductCategory == `men's clothing` || item.ProductCategory == `women's clothing` || item.ProductCategory == `"womens-dresses` || item.ProductCategory == `mens-shirts` || item.ProductCategory == 'womens-shoes' || item.ProductCategory == 'mens-shoes' ? <Text style={{ color: "black", bottom: 130, left: 165 }}> Size : {item.ProductSize}</Text> : null}
  <View style={{ flexDirection: "row", left: 30, top: 5 }}>
    {getTotalPrice({ items: item })}
    <Text style={{ color: "green", textAlign: 'center', bottom: 132, left: 100, fontWeight: 'bold', fontSize: 18, marginLeft: 20 }}> ${item.ProductPrice * item.ProductQty}</Text>
    <Text style={{ color: "green", bottom: 130, left: 100, marginLeft: 10 }}> {Math.round(item.ProductDiscount)}% off </Text>

  </View>
  <AirbnbRating
    count={5}
    defaultRating={item.ProductRating}
    reviewSize={20}
    size={15}
    showRating={false}
    selectedColor='green'
    starContainerStyle={{ bottom: 120, left: 20 }}
  />
</View>
<View style={{ bottom: 130, left: 18, borderWidth: 1, borderColor: "silver", width: 80, height: 30 }}>
  <Pressable style={{ flexDirection: 'row', }} onPress={() => selectQty({ uid: item.CartUid })}>
    <Text style={{ color: "black", right: 2.5, margin: 5, marginLeft: 5, fontSize: 11.6, fontWeight: "bold" }}> Qty:</Text>
    <Text style={{ color: "black", margin: 5, fontSize: 12, fontWeight: 'bold', right: 15 }}> {item.ProductQty}</Text>
    <Icon name='caret-down-sharp' size={15} color={'black'} style={{ margin: 5, right: 15 }} />
  </Pressable>
</View>
<View style={{ position: "absolute", top: 155, left: 100, flexDirection: "row" }}>
  <Text style={{ color: "black" }}> Delivery by </Text>
  <Text style={{ top: 2, right: 5 }}> {deliveryDate()}</Text>
</View>
</View> */}