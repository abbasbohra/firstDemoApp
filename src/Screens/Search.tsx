import { View, Text, FlatList, ActivityIndicator, Dimensions, Image, Pressable, RefreshControl, Alert, TouchableOpacity, ToastAndroid, StyleSheet } from 'react-native'
import React, { useState, useEffect } from 'react'
import Icon from 'react-native-vector-icons/Ionicons'
import { Searchbar } from 'react-native-paper';
import { Rating, AirbnbRating } from 'react-native-ratings'
import Header from '../component/Header';
import { _makeAxiosGetRequest, _makeAxiosPostRequest } from '../Service/axios';
import { endpoint } from '../Service/endpoint';




type allproduct = {
  id: string
  ImageSrc: any
  price: string | null | number
  short_desc: string
  category: string[]
  rating: number
  title: string
  offer_price: any
  product_name: any

}



const Search = ({ navigation }: { navigation: any }) => {
  const [allProduct, setAllProduct] = useState<allproduct[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [refresh, setRefresh] = useState(false)
  const [wishlistData, setWishlistData] = useState([]);

  const Search = () => {
    setLoading(true)
    const body = new FormData()
    body.append('search', search)
    body.append('type', 'most-popular')

    _makeAxiosPostRequest(endpoint.search_product, body).then((res: any) => {
      // console.log(res.data)
      setAllProduct(res.data.data)
      setLoading(false)
      ToastAndroid.showWithGravity(res.message, ToastAndroid.SHORT, ToastAndroid.CENTER)
    }).catch((error) => {
      console.log(error.response.data.message)
      setLoading(false)
      Alert.alert(error.response.data.message)

    })
  }
  const nothingShow = () => {
    return (
      <View style={{ top: 100 }}>
        <Image source={{ uri: 'https://media.tenor.com/a4SaQmo5EesAAAAj/iranserver-bluebot.gif' }} style={{ width: 100, height: 120, position: "absolute", top: 50, left: 120 }} />
        <Text style={{ color: "black", textAlign: "center", top: 200, fontWeight: "700" }}> Sorry,Nothing Found </Text>
        <Text style={{ color: "grey", textAlign: "center", top: 200 }}> Check Spelling And Try Again </Text>
      </View>

    )
  }

  const getWishlist = () => {
    _makeAxiosGetRequest(endpoint.getWishlist, {}).then((res) => {
      setWishlistData(res.data.products.data)
    }).catch((error) => {
      console.log(error)
    })
  }
  useEffect(() => {
    getWishlist()
  }, [])

  const addToWishlist = async ({ productId }: { productId: any }) => {
    const body = new FormData()
    body.append('product_id', productId)

    _makeAxiosPostRequest(endpoint.wishlist, body).then((res: any) => {
      ToastAndroid.show(res.message, ToastAndroid.SHORT)
      getWishlist()
    }).catch((error) => {
      console.log(error)

    })

  }


  const CheckWishlist = ({ productId }: { productId: any }) => {
    const find = wishlistData.find((elem: any) => elem?.id === productId)
    // console.log('find===>', find)
    return find ? (<Icon name='heart' style={style.wishlisticon} size={20} color={'black'} onPress={() => addToWishlist({ productId: productId })} />) : (<Icon name='ios-heart-outline' style={style.wishlisticon} size={20} color={'black'} onPress={() => addToWishlist({ productId: productId })} />)
  }


  console.log(search)
  return (
    <View style={style.container}>
      <Header title='Search Product' onpress={()=> navigation.navigate('HomePage')} showCart={true} cartleft={130} titleStyle={{ top: 20, left: 50, fontSize: 20, color: 'black', fontWeight: '500' }} />
      <View>
        <Searchbar
          value={search}
          onChangeText={setSearch}
          icon={() => <Icon name='ios-search-outline' color='black' size={30} style={{}} />}
          onSubmitEditing={() => Search()}
          style={style.search}
          clearButtonMode='while-editing'
          placeholder='Search Here'
          clearIcon={() => <Icon name='ios-close-outline' color='black' size={32} style={{}} />}
          onClearIconPress={() => { setSearch(''), setAllProduct([]) }}
          onIconPress={() => Search()}
        />
      </View>

      {loading ? <ActivityIndicator style={{ top: 150 }} size={35} color='black' /> :
        <View style={{ top: 40, paddingBottom: 170 }}>
          {allProduct.length <= 0 ? nothingShow() :
            <FlatList
              style={{ top: 5, left: 8 }}
              data={allProduct}
              numColumns={2}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item: any) => item.id}
              renderItem={({ item, index }) => {
                return (
                  <View style={style.productdetailcon}>
                    {CheckWishlist({ productId: item?.id })}
                    <Image source={{ uri: item?.ImageSrc }} resizeMode='contain' style={style.productdetailimage} />
                    <TouchableOpacity style={style.navigatebtn} onPress={() => navigation.navigate('ExampleDetail', { id: item.id })}>
                      <Text style={style.productname} numberOfLines={1}> {item?.product_name}</Text>
                      <Text style={style.shortdesc} numberOfLines={1}> {item?.short_desc}</Text>
                      <View style={style.offerpricecontainer}>
                        <Text style={style.offerprice}> ₹{item?.offer_price}</Text>
                        <View style={style.pricecontainer}>
                          <Text style={style.price}> ₹{item?.price}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                )
              }}
            />}
        </View>}
    </View>
  )
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  search: {
    backgroundColor: '#F7F7F9',
    width: 390,
    top: 20,
    borderRadius: 10,
    color: 'black'
  },
  productdetailcon: {
    width: 190,
    height: 300,
    backgroundColor: 'white',
    borderBottomWidth: 0.5,
    borderRightWidth: 0.5
  },
  productdetailimage: {
    width: 180,
    height: 180,
  },
  navigatebtn: {
    position: "absolute",
    left: 100,
    top: 10
  },
  productname: {
    color: "black",
    top: 200,
    right: 95,
    fontWeight: '900'
  },
  shortdesc: {
    color: "black",
    fontSize: 12,
    left: -95,
    top: 200,
    marginRight: 0
  },
  offerpricecontainer: {
    flexDirection: "row",
    right: 100,
    bottom: -185,
    paddingBottom: 10
  },
  offerprice: {
    color: "black",
    left: 10,
    top: 30,
    marginLeft: 0,
    fontWeight: '900'
  },
  pricecontainer: {
    borderBottomWidth: 0.5,
    borderColor: 'grey',
    left: 80,
    top: 20
  },
  price: {
    color: "grey",
    top: 10
  },
  wishlisticon: {
    position: "absolute",
    left: 160,
    top: 10
  }
})

export default Search