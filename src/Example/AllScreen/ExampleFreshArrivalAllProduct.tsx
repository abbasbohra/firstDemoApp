import { View, Text, FlatList, TouchableOpacity, ToastAndroid, Image, ImageBackground, Dimensions } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import Icon from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { _makeAxiosGetRequest, _makeAxiosPostRequest } from '../../Service/axios'
import { endpoint } from '../../Service/endpoint'
import RBSheet from 'react-native-raw-bottom-sheet'
import Header from '../../component/Header'
import SkelatonEffectProductPage from '../../component/SkelatonEffect/SkelatonEffectProductPage'
type products = {
  ImageSrc: string
  product_name: string
  short_desc: string
  price: number
  discounts: number
  offer_price: number
  rating: number
  id: number
}





const ExampleFreshArrivalAllProduct = ({ navigation }: { navigation: any }) => {
  const [products, setProducts] = useState<products[]>([]);
  const [wishlistData, setWishlistData] = useState([]);
  const [loading, setLoading] = useState(false)
  const OpenBottomsheet = useRef<any>();


  const getFeaturedProducts = async () => {
    setLoading(true)
    _makeAxiosGetRequest(endpoint.getNewArivals, {}).then((res) => {
      setProducts(res.data.data)
      setLoading(false)
    }).catch((err) => {

      setLoading(false)
      console.log(err)
    })
  }

  useEffect(() => {
    getFeaturedProducts()
    getWishlist()

  }, [])

  const getWishlist = () => {
    // setLoading(true)
    _makeAxiosGetRequest(endpoint.getWishlist, {}).then((res) => {
      // console.log('wishlistdata=========>', res.data.products.data)
      setWishlistData(res.data.products.data)
      // setLoading(false)
    }).catch((error) => {
      // setLoading(false)
      console.log(error)
    })
  }

  const CheckWishlist = ({ productId }: { productId: any }) => {
    const find = wishlistData.find((elem: any) => elem?.id === productId)
    // console.log('find===>', find)
    return find ? (<Icon name='heart' color={'black'} style={{ left: 160, position: "absolute", top: 0 }} size={25} onPress={() => addToWishlist({ productId: productId })} />) : (<Icon name='heart-outline' color={'black'} style={{ left: 160, position: "absolute", top: 0 }} size={25} onPress={() => addToWishlist({ productId: productId })} />)
  }
  const addToWishlist = async ({ productId }: { productId: any }) => {
    const data = {
      product_id: productId
    }
    _makeAxiosPostRequest(endpoint.wishlist, data).then((res: any) => {
      // console.log(res.data.data)
      ToastAndroid.show(res.message, ToastAndroid.SHORT)
      getWishlist()
    }).catch((error) => {
      console.log(error)

    })

  }


  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ height: 80, }}>
        <Header title='Fresh Arrivals' showShadow={false} searchLeft={-10} cartleft={-10} onpress={() => navigation.goBack()} />
        <View style={{ flexDirection: 'row', borderTopWidth: 0.5, borderBottomWidth: 0.5, borderColor: 'black', top: -10, }}>
          <View style={{ flexDirection: "row", top: 0, left: 50, padding: 10 }}>
            <MaterialCommunityIcons name='sort' size={25} style={{ textAlign: "center" }} color={'black'} />
            <Text style={{ color: "black", top: 2.5 }}> SORT </Text>
          </View>
          <View style={{ borderLeftWidth: 0.5, left: 106, borderColor: 'black' }} />
          <TouchableOpacity onPress={() => OpenBottomsheet.current.open()} style={{ flexDirection: 'row', top: 0, width: 150, left: 120 }}>
            <MaterialCommunityIcons name='filter-variant' size={25} style={{ textAlign: "center", top: 10, left: 50 }} color={'black'} />
            <Text style={{ color: "black", top: 12.5, left: 50 }}> SORT </Text>
          </TouchableOpacity>
        </View>
      </View>
      {loading ? (
        <SkelatonEffectProductPage />
      ) : products.length === 0 ? (
        <View style={{ justifyContent: "center", alignContent: "center", alignItems: "center", top: 150 }}>
          <Image source={{ uri: 'https://i.ibb.co/3d2D2BS/no-product-found.png' }} resizeMode='contain' style={{ width: 300, height: 300 }} />
        </View>
      ) : (<View style={{ paddingBottom: 100 }}>
        <FlatList
          style={{ top: 20, }}
          data={products}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item: any) => item.id}
          renderItem={({ item, index }) => {
            return (
              <View style={{ backgroundColor: 'white', borderBottomWidth: 0.5, borderRightWidth: 0.5 ,paddingBottom:20,width: Dimensions.get('screen').width/2}}>
                <ImageBackground source={{ uri: item.ImageSrc }} resizeMode='stretch' style={{width: Dimensions.get('screen').width/2-2, height: 190, }}>
                  {CheckWishlist({ productId: item?.id })}
                </ImageBackground>
                <TouchableOpacity style={{ left: 0, top: 10,}} onPress={() => navigation.navigate('ExampleDetail', { id: item.id })}>
                  {/* <View style={{width:}}>

                  </View> */}
                  <Text style={{ color: "black", top: 0, right: 0, fontWeight: '900' }} numberOfLines={1}> {item.product_name}</Text>
                  <Text style={{ color: "black", fontSize: 12, left: 0, top: 0, marginRight: 0 }} numberOfLines={1}> {item?.short_desc}</Text>
                  <View style={{ flexDirection: "row", right: 0, bottom: 0, paddingBottom: 10 }}>
                    <Text style={{ color: "black", top: 0, marginLeft: 0, fontWeight: '900' }}> ₹{item.offer_price}</Text>
                    <View style={{ borderBottomWidth: 0.5, borderColor: 'grey', left: 80, top: -10 }}>
                      <Text style={{ color: "grey", top: 10 }}> ₹{item.price}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            )
          }}
        />
      </View>)}
      <RBSheet
        ref={OpenBottomsheet}
        closeOnDragDown={true}
        animationType='fade'
        height={500}
        customStyles={{ container: { borderTopLeftRadius: 40, borderTopRightRadius: 40 }, draggableIcon: { backgroundColor: 'white' } }}
      >
        <View>
          <View style={{ flexDirection: 'row', top: 0 }}>
            <Text style={{ color: 'black', fontWeight: '900', fontSize: 17, margin: 5 }}> SORT</Text>
            <Icon name='close' color={'black'} size={30} style={{ left: 280 }} onPress={() => OpenBottomsheet.current.close()} />
          </View>
          <View style={{ borderBottomWidth: 0.5, borderColor: 'silver', top: 20 }} />
          <View style={{ top: 40 }}>
            <View style={{ flexDirection: 'row', margin: 8 }}>
              <Text style={{ color: 'black', fontSize: 15 }}> New Arrivals</Text>
              <Icon name='radio-button-off' color={'black'} size={25} style={{ left: 250 }} />
            </View>
            <View style={{ flexDirection: 'row', margin: 8 }}>
              <Text style={{ color: 'black', fontSize: 15 }}> Most Popular</Text>
              <Icon name='radio-button-off' color={'black'} size={25} style={{ left: 248 }} />
            </View>
            <View style={{ flexDirection: 'row', margin: 8 }}>
              <Text style={{ color: 'black', fontSize: 15 }}> {`Price(Low to High)`}</Text>
              <Icon name='radio-button-off' color={'black'} size={25} style={{ left: 210 }} />
            </View>
            <View style={{ flexDirection: 'row', margin: 8 }}>
              <Text style={{ color: 'black', fontSize: 15 }}> {`Price(High to Low)`}</Text>
              <Icon name='radio-button-off' color={'black'} size={25} style={{ left: 210 }} />
            </View>
            <View style={{ flexDirection: 'row', margin: 8 }}>
              <Text style={{ color: 'black', fontSize: 15 }}> {`Rating(High to Low)`}</Text>
              <Icon name='radio-button-off' color={'black'} size={25} style={{ left: 200 }} />
            </View>
          </View>
        </View>
      </RBSheet>
    </View>
  )
}

export default ExampleFreshArrivalAllProduct