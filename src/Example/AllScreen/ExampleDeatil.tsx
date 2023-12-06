import { View, Text, ScrollView, Dimensions, TouchableOpacity, Alert, ToastAndroid, BackHandler, Modal, Pressable, TextInput, Share, RefreshControl, Animated } from 'react-native'
import React, { useEffect, useRef, useState, } from 'react'
import axios from 'axios'
import Icon from 'react-native-vector-icons/Ionicons';
import { StatusBar } from 'react-native';
import { Image } from 'react-native';
import { FlatList } from 'react-native';
import { AirbnbRating } from 'react-native-ratings';
import RenderHTML from 'react-native-render-html';
import { _makeAxiosPostRequest, _makeAxiosGetRequest } from '../../Service/axios';
import { endpoint } from '../../Service/endpoint';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Avatar, Badge } from 'react-native-paper';
import SkelatonEffectProductDetail from '../../component/SkelatonEffect/SkelatonEffectProductDetail';
import RBSheet from 'react-native-raw-bottom-sheet';
import notifee, { AndroidImportance, AndroidStyle } from '@notifee/react-native';
import Header from '../../component/Header';

// import DisplayNotification from '../../component/DisplayNotification';
type products = {
    product_images: any
    id: any
    ImageSrc: string
    vendor: []
    OptionKey: []
    price: number
    offer_price: number
    OneStar: number
    ThreeStar: number
    TwoStar: number
    FourStar: number
    FiveStar: number
    rating: number
    total_review: number
    short_desc: any
}


type similarProduct = {
    rating: any
    discount: any
    price: any
    currency_data: any
    offer_price: any
    product_name: any
    ImageSrc: any
    id: any
}
const ExampleDeatil = ({ route, navigation }: { route: any, navigation: any }) => {
    const [product, setProduct] = useState<product>();
    const [image, setImage] = useState<number>()
    const [loading, setLoading] = useState(false)
    const [color, setColor] = useState<string>('')
    const [size, setSize] = useState('');
    const { id } = route.params
    const [price, setPrice] = useState<string>('');
    const [offer_Price, setOffer_price] = useState('');
    const [tocken, setTocken] = useState('');
    const [userId, setUserId] = useState('');
    const [wishlistData, setWishlistData] = useState([]);
    const [similarProducts, setSimilarProducts] = useState<similarProduct>([]);
    const [colorAttribute, setColorAttribute] = useState('');
    const [sizeAttribute, setSizeAttribute] = useState('');
    const [attributeColorPrice, setAttributeColorPrice] = useState('');
    const [attributeSizePrice, setAttributeSizePrice] = useState('');
    const [cartList, setCartList] = useState([]);
    const [pincode, setPincode] = useState('');
    const [estimateDeliveryDate, setEstimateDeliveryDate] = useState('')
    const [quantity, setQuantity] = useState(1)
    const [openImageModal, setOpenImageModal] = useState<boolean>(false)
    const [activeIndex, setActiveIndex] = useState<any>(0)
    const [translateX] = useState(new Animated.Value(0));
    const [openSizeChartModal, setOpenSizeChartModal] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const openBottomsheet: any = useRef();





    const getProductDetail = async () => {
        setLoading(true)
        const GetProductByIdUrl = `${endpoint.productById}/${id}`
        _makeAxiosGetRequest(GetProductByIdUrl, {}).then((res) => {
            // console.log('productDetail', res.data.product),
            setProduct(res.data.product)
            setSimilarProducts(res.data.products)
            setLoading(false)
        }).catch((error) => {
            console.log(error)
            setLoading(false)
            Alert.alert(error.response.data.message)

        })
    }
    useEffect(() => {
        getProductDetail()
        getCartProduct();
        getTocken();
        getUserId();
        getWishlist()

    }, [])
    const OnRefresh = () => {
        getCartProduct()
        getProductDetail();
        getTocken()
        getUserId()
        getWishlist()
    }
    const getCartProduct = async () => {
        const data = {
            'session_id': null,
            'user_id': userId
        }
        _makeAxiosPostRequest(endpoint.cart, data).then((res) => {
            // console.log(res.data)

            setCartList(res.data)
        }).catch((error) => { console.log('cart============>', error.response.data) })
    }

    const getUserId = async () => {
        const id: any = await AsyncStorage.getItem('USERID')
        const userid = JSON.parse(id)
        // console.log(userid)
        setUserId(userid)
    }

    const getTocken = async () => {
        const token: any = await AsyncStorage.getItem('ACCESS_TOKEN')
        const Token = JSON.parse(token)
        // console.log('tocken', tocken)
        setTocken(Token)
    }
    // console.log('active index----------->', activeIndex)
    const addToCart = () => {
        openBottomsheet.current.close()
        setLoading(true)

        const body = new FormData()
        body.append('session_id', userId)
        body.append('vendor_id', product?.vendor?.id)
        body.append('product_id', product?.id)
        body.append('quantity', quantity.toString())
        body.append('orignal_price', product?.price)
        body.append('offer_price', product?.offer_price)
        body.append('product_option[0][attr_type]', sizeAttribute)
        body.append('product_option[0][value]', size)
        body.append('product_option[0][price]', attributeSizePrice)
        body.append('product_option[1][attr_type]', colorAttribute)
        body.append('product_option[1][value]', color)
        body.append('product_option[1][price]', attributeColorPrice)
        _makeAxiosPostRequest(endpoint.getCart, body).then((res) => {
            // console.log(res)
            setLoading(false)
            getCartProduct()
            ToastAndroid.show('Add to item', ToastAndroid.SHORT)
            DisplayNotification()
        }).catch((err) => {
            setLoading(false)
            console.log(err.response.data.errors)
            Alert.alert(err.response.data.errors)

        })

    }
    const DisplayNotification = async () => {
        await notifee.requestPermission()
        const channelId = await notifee.createChannel({
            id: 'default',
            name: 'Default Channel',
            sound: 'default',
            importance: AndroidImportance.HIGH,
            badge: true,
            // vibration: false,

        });



        await notifee.displayNotification({
            title: 'Cart Update',
            body: `${product?.product_name} Add in cart`,
            android: {
                channelId,
                sound:'default',
                style: { type: AndroidStyle.BIGPICTURE, picture: product?.ImageSrc },
                pressAction: {
                    id: 'default',

                },
                largeIcon: require('../../component/IconImage/fashionLeoLogo.png'),
            },
        });
    }
    const html = product?.long_desc

    const productImages = () => {
        return (
            <View style={{ top: 35, margin: 0 }}>
                <FlatList
                    data={product?.product_images}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={item => item.id}
                    renderItem={({ item, index }) => {
                        return (
                            <View style={{ margin: 5 }}>
                                <TouchableOpacity onPress={() => { setImage(index), setOpenImageModal(true) }}>
                                    <Image source={{ uri: item?.ImageSrc }} style={{ width: 80, height: 80 }} resizeMode='contain' />
                                </TouchableOpacity>
                            </View>
                        )
                    }}
                />
            </View>
        )
    }

    const productSizes = () => {
        return (
            <View style={{ bottom: 15, margin: 10 }}>
                <FlatList
                    data={product?.OptionKey?.Size}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item, index }) => {
                        return (
                            <View style={{ width: 50, height: 40, backgroundColor: size == item.values ? '#27AAE1' : "white", borderRadius: 10, borderColor: '#CECDAF', borderWidth: 1, margin: 5 }}>
                                <TouchableOpacity onPress={() => { setSize(item.values), setAttributeSizePrice(item.price), setSizeAttribute(item.attribute) }}>
                                    <Text style={{ color: size == item.values ? "white" : 'black', textAlign: "center", right: 5, top: 9 }}> {item?.values}</Text>

                                </TouchableOpacity>
                            </View>
                        )
                    }}
                />
            </View>
        )
    }
    const productColor = () => {
        return (
            <View style={{ bottom: 15, margin: 10, left: 10 }}>
                <FlatList
                    data={product?.OptionKey?.Colour}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item, index }) => {
                        return (
                            <View style={{ height: 40, backgroundColor: color == item.values ? '#27AAE1' : "white", borderRadius: 10, borderColor: '#CECDAF', borderWidth: 1, margin: 5 }}>
                                <TouchableOpacity onPress={() => { setColor(item.values), setAttributeColorPrice(item.price), setColorAttribute(item.attribute) }}>
                                    <Text style={{ color: color == item.values ? "white" : 'black', textAlign: "center", right: 5, top: 0, padding: 10 }}> {item?.values}</Text>

                                </TouchableOpacity>
                            </View>
                        )
                    }}
                />
            </View>
        )
    }
    const start = ({ size, right, left, bottom, top }: { size: number, right: number, left: number, bottom: number, top: number }) => {
        return (
            <View style={{ position: "absolute", top: top, left: left, right: right, bottom: bottom }}>
                <AirbnbRating
                    count={1}
                    showRating={false}
                    size={size}
                    selectedColor='#30B57E'
                />
            </View>
        )
    }

    const similarProduct = () => {
        return (
            <View>
                {similarProducts?.length == 0 ? (
                    null
                ) : (<FlatList
                    data={similarProducts}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item?.category_id}
                    renderItem={({ item, index }) => {
                        return (
                            <View style={{ backgroundColor: "white", width: 180, borderBottomWidth: 0.5, borderLeftWidth: 0.5, borderRightWidth: 0.5, paddingBottom: 20 }}>
                                <TouchableOpacity onPress={() => navigation.push('ExampleDetail', { id: item.id })}>
                                    <Image source={{ uri: item?.ImageSrc }} resizeMode='stretch' style={{ width: 180, height: 150, top: 10 }} />
                                    <Text style={{ color: 'black', fontSize: 13, top: 20, left: 8, fontWeight: '800' }}> {item?.brand}</Text>
                                    <View style={{ paddingBottom: 10, width: 180, left: 10, top: 10 }}>
                                        <Text style={{ color: "black", top: 10, fontSize: 12, margin: 3, right: 3 }}>{item?.product_name}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', left: 5, top: 10 }}>
                                        <Text style={{ color: "black", marginRight: 5, fontWeight: '800' }}> {item?.currency_data?.symbol + item?.offer_price}</Text>
                                    </View>
                                </TouchableOpacity>

                            </View>
                        )
                    }}
                />)}
            </View>
        )
    }

    const getWishlist = () => {
        _makeAxiosGetRequest(endpoint.getWishlist, {}).then((res) => {
            // console.log('wishlistdata=========>', res.data.products.data)
            setWishlistData(res.data.products.data)
        }).catch((error) => {
            console.log(error)
            Alert.alert(error.response.data.message)

        })
    }
    const CheckWishlist = () => {
        const find = wishlistData.find((elem: any) => elem?.id === product?.id)
        // console.log('find===>', find)
        return find ? (<Icon name='heart' color={'black'} style={{ left: 5, position: "absolute", top: 6 }} size={25} onPress={() => Alert.alert('Product Alerady Add In WishList')} />) : (<Icon name='heart-outline' color={'black'} style={{ left: 5, position: "absolute", top: 6 }} size={25} onPress={() => addToWishlist()} />)
    }

    const addToWishlist = async () => {

        setLoading(true)
        const data = {
            product_id: product?.id
        }
        _makeAxiosPostRequest(endpoint.wishlist, data).then((res) => {
            // console.log(res.data.data)
            setLoading(false)
            getWishlist()
            // DisplayNotification({ title: 'Added to Wishlist', body: "Item Added in wishlist" })

        }).catch((error) => {
            console.log(error)
            setLoading(false)
            Alert.alert(error.response.data.message)


        })

    }
    const CheckWishlistSimilarProduct = ({ id }: { id: any }) => {
        const find = wishlistData.find((elem: any) => elem?.id == id)
        // console.log('find===>', find)
        return find ? (<Icon name='heart' color={'black'} style={{ left: 50, top: 10 }} size={25} onPress={() => Alert.alert('Product Alerady Add In WishList')} />) : (<Icon name='heart-outline' color={'black'} style={{ left: 50, top: 10 }} size={25} onPress={() => addToWishlist()} />)

    }
    const checkCourierservice = () => {
        setLoading(true)
        const data = {
            pincode: pincode,
            vendor_id: product?.vendor?.id
        }
        _makeAxiosPostRequest(endpoint.check_courier_service, data).then((res) => {
            console.log(res)
            setEstimateDeliveryDate(res?.pricing?.data?.available_courier_companies[0])
            setLoading(false)
        }).catch((error) => {
            setLoading(false)
            console.log(error.response.data.errors)
            Alert.alert(error.response.data.errors)
        })
    }


    const share = async () => {
        try {
            const result = await Share.share({
                message: "Check out this AmazingProduct",
                title: product?.product_name,
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    ToastAndroid.show('Shared', ToastAndroid.SHORT)
                } else {
                    ToastAndroid.show('Shared', ToastAndroid.SHORT)
                }
            } else if (result.action === Share.dismissedAction) {
                ToastAndroid.show('Shared Cancel', ToastAndroid.SHORT)

            }
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <View style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
            {/* <View style={{ flexDirection: "row", backgroundColor: 'white', height: 55 }}>
                <View style={{ backgroundColor: "white", shadowColor: 'black', shadowOffset: { width: 1, height: 1 }, shadowOpacity: 1, shadowRadius: 1, elevation: 5, borderRadius: 50, left: 10, width: 35, height: 35, top: 10 }}>
                    <Icon name='chevron-back-outline' color={'#27AAE1'} size={30} style={{}} onPress={() => navigation.goBack()} />
                </View>
                <Text style={{ color: "#27AAE1", fontSize: 18, textAlign: "center", left: 80, top: 10 }}> Product Detail </Text>
                <Icon name='search-outline' color={'#27AAE1'} size={30} style={{ left: 130, top: 10 }} />
                <Pressable style={{ left: 150, top: 15 }} onPress={() => navigation.navigate('ShoppingCart')} >
                    <Badge style={{ position: "absolute", left: 15, bottom: 45, backgroundColor: "#27AAE1" }} size={20} disabled={cartList?.length === 0 ? true : false}>{cartList?.length}</Badge>
                    <Icon name='cart-outline' color={'#27AAE1'} size={30} style={{ left: 0 }} />
                </Pressable>

            </View> */}
            <Header title='Product Detail ' cartleft={-10} searchLeft={3} onpress={() => navigation.goBack()} showShadow={true} />
            <ScrollView contentContainerStyle={{ backgroundColor: 'white', paddingBottom: 120, top: 2 }} refreshControl={<RefreshControl refreshing={refresh} onRefresh={OnRefresh} />}>
                {loading ? (<SkelatonEffectProductDetail />) : (<>
                    <View>
                        {product?.product_images?.length === 0 ?
                            (<View>
                                <Image source={{ uri: product?.ImageSrc }} resizeMode='contain' style={{ width: 250, height: 260, top: 30, left: 60 }} />
                            </View>) :
                            (<FlatList
                                data={product?.product_images}
                                horizontal
                                pagingEnabled
                                showsHorizontalScrollIndicator={false}
                                keyExtractor={item => item.id}
                                renderItem={({ item, index }) => {
                                    return (
                                        <View style={{}}>
                                            <View>
                                                <Image source={{ uri: item?.ImageSrc }} style={{ width: Dimensions.get('screen').width, height: 500 }} resizeMode='contain' />
                                            </View>
                                        </View>
                                    )
                                }}
                            />)}
                    </View>
                    {productImages()}
                    <View style={{ padding: 10, backgroundColor: "white", borderRadius: 10, top: 40, left: 5, shadowColor: "black", shadowOffset: { width: 1, height: 1 }, shadowOpacity: 1, shadowRadius: 1, elevation: 3, paddingBottom: 20 }}>
                        <Text style={{ color: "black", fontWeight: '900', margin: 10, right: 5 }}> {product?.brand} {product?.product_name}</Text>
                        <Text style={{ color: "black", margin: 1, fontSize: 15, bottom: 5 }}> {product?.sku_no}</Text>
                        <Text style={{ color: "black", margin: 1, fontSize: 15, bottom: 3 }}> {product?.short_desc}</Text>
                        <View style={{ flexDirection: "row", right: 10 }}>
                            <Text style={{ color: "black", fontWeight: '900', fontSize: 17, left: 15 }}> {offer_Price == '' ? product?.currency_data?.symbol + ' ' + product?.offer_price : product?.currency_data?.symbol + ' ' + offer_Price}</Text>
                            <View style={{ borderBottomWidth: 1, borderColor: 'black', left: 20, bottom: 10 }}>
                                <Text style={{ color: "black", fontWeight: '600', fontSize: 13, left: 0, top: 10 }}> {price == '' ? product?.currency_data?.symbol + ' ' + product?.price : product?.currency_data?.symbol + ' ' + price}</Text>
                            </View>
                            <Text style={{ color: '#6EC5A2', fontSize: 15, fontWeight: 'bold', left: 30, top: 0 }}> {product?.discounts}% off</Text>
                        </View>
                        <Text style={{ color: 'black', fontSize: 13, top: 10 }}> *12% off upto Rs.100 on online orders of Rs.1999 and above</Text>
                        <Text style={{ color: 'black', fontSize: 13, top: 10 }}> *15% off upto Rs.200 on online orders of Rs.2999 and above</Text>

                    </View>
                    <View style={{ backgroundColor: "white", borderRadius: 10, top: 50, left: 5, shadowColor: "black", shadowOffset: { width: 1, height: 1 }, shadowOpacity: 1, shadowRadius: 1, elevation: 3, paddingBottom: 20 }}>
                        <View style={{ flexDirection: "row" }}>
                            <Text style={{ color: 'black', margin: 5, fontSize: 15, top: 10 }}> Size Chart & Measurement Images </Text>
                            <TouchableOpacity onPress={() => setOpenSizeChartModal(true)} style={{ backgroundColor: '#27AAE1', borderRadius: 10, margin: 5, top: 8, left: 20 }}>
                                <Text style={{ fontSize: 13, color: 'white', padding: 7 }}> Size Chart</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {product?.OptionKey?.length === 0 ? null :
                        <View style={{ padding: 10, height: product?.OptionKey?.Colour == undefined || product?.OptionKey?.Size == undefined ? 120 : 200, backgroundColor: "white", borderRadius: 10, top: 60, left: 5, shadowColor: "black", shadowOffset: { width: 1, height: 1 }, shadowOpacity: 1, shadowRadius: 1, elevation: 3 }}>
                            {product?.OptionKey?.Size == undefined ? null :
                                <View style={{ position: "absolute", top: 10, left: 15 }}>
                                    <Text style={{ color: "black", fontWeight: '900', margin: 10, left: 5, bottom: 5 }}> Sizes </Text>
                                    {productSizes()}
                                </View>}

                            {product?.OptionKey?.Colour === undefined ? null :
                                <View style={{ position: "absolute", top: product?.OptionKey?.Size == undefined ? 0 : 100 }}>
                                    <Text style={{ color: "black", fontWeight: '900', margin: 10, left: 15, bottom: 5 }}> Color </Text>
                                    {productColor()}
                                </View>}

                        </View>}
                    <View style={{ padding: 10, height: 190, backgroundColor: "white", borderRadius: 10, top: 75, left: 5, shadowColor: "black", shadowOffset: { width: 1, height: 1 }, shadowOpacity: 1, shadowRadius: 1, elevation: 3 }}>
                        <View style={{ height: 40, flexDirection: 'row', width: 350, top: 5, left: 0, }}>
                            <TextInput onSubmitEditing={() => checkCourierservice()} placeholder='check Pincode' keyboardType='numeric' style={{ width: 250, borderWidth: 1, borderColor: 'black', }} value={pincode} onChangeText={setPincode} />
                            <TouchableOpacity onPress={() => checkCourierservice()} style={{ backgroundColor: "#27AAE1", left: 0 }}>
                                <Text style={{ padding: 10, fontSize: 15, color: 'white' }}> Check </Text>
                            </TouchableOpacity>
                        </View>
                        {estimateDeliveryDate == '' ? null : <Text style={{ position: 'absolute', top: 55, color: "black", fontSize: 15, marginLeft: 20, fontWeight: '900' }}> Delivery is available and expected date is {estimateDeliveryDate?.etd} </Text>}
                        <Text style={{ color: 'black', fontSize: 12, top: 50, left: 0 }}> Please enter PIN CODE to check delivery & services</Text>
                        <View style={{ flexDirection: "row", marginTop: 50 }}>
                            <Text style={{ color: 'black' }}> 1.</Text>
                            <Text style={{ color: 'black' }}> Usually deliverable in 7 days.</Text>
                        </View>
                        <View style={{ flexDirection: "row", marginTop: 8 }}>
                            <Text style={{ color: 'black' }}> 2.</Text>
                            <Text style={{ color: 'black' }}> pay on delivery is available.</Text>
                        </View>
                        <View style={{ flexDirection: "row", marginTop: 8, paddingBottom: 10 }}>
                            <Text style={{ color: 'black' }}> 3.</Text>
                            <Text style={{ color: 'black' }}>Hassle free 7 days return.</Text>
                        </View>
                    </View>
                    <View style={{ padding: 10, backgroundColor: "white", borderRadius: 10, top: 95, left: 5, shadowColor: "black", shadowOffset: { width: 1, height: 1 }, shadowOpacity: 1, shadowRadius: 1, elevation: 3, paddingBottom: 20 }}>
                        <Text style={{ color: "black", fontWeight: '900', margin: 10, bottom: 10 }}> Sold by </Text>
                        <View style={{ flexDirection: 'row', bottom: 10 }}>
                            <Avatar.Image size={60} source={{ uri: product?.vendor?.vendor?.businessLogoSrc }} style={{ backgroundColor: 'white' }} />
                            <Text style={{ color: "black", left: 6, top: 20 }}> {product?.vendor?.vendor?.business_name}</Text>
                        </View>
                        <TouchableOpacity onPress={() => navigation.navigate('ExampleProductByVendor', { vendorId: product?.vendor?.id })} style={{ position: "absolute", top: 50, left: 280, backgroundColor: "#27AAE1", borderRadius: 6, borderColor: 'black', borderWidth: 1 }}>
                            <Text style={{ padding: 8, color: "white" }}> View Store </Text>
                        </TouchableOpacity>
                        <View>
                            <View style={{ flexDirection: 'row', top: 0 }}>
                                <Text style={{ color: "black", fontSize: 20, left: 60 }}> {product?.total_rating}</Text>
                                <Text style={{ color: "black", fontSize: 20, left: 150 }}> {product?.total_follow}</Text>
                                <Text style={{ color: "black", fontSize: 20, left: 235 }}> {product?.total_product}</Text>
                            </View>
                            <View style={{ flexDirection: "row", bottom: 10 }}>
                                <Text style={{ color: "black", fontSize: 15, left: 40, top: 20, fontWeight: '500' }}> Ratings</Text>
                                <Text style={{ color: "black", fontSize: 15, left: 80, top: 20, fontWeight: '500' }}> Follower</Text>
                                <Text style={{ color: "black", fontSize: 15, left: 115, top: 20, fontWeight: "500" }}> Products</Text>

                            </View>
                        </View>

                    </View>
                    <View style={{ padding: 10, height: 210, backgroundColor: "white", borderRadius: 10, top: 115, left: 5, shadowColor: "black", shadowOffset: { width: 1, height: 1 }, shadowOpacity: 1, shadowRadius: 1, elevation: 3 }}>
                        <Text style={{ color: "black", fontWeight: '900', margin: 10 }}> Product Rating & Reviews </Text>
                        <Text style={{ color: "#30B57E", fontSize: 60 }}> {Math.round(product?.rating) === null ? 0 : Math.round(product?.rating)}</Text>
                        {start({ size: 30, top: 83, left: 0, bottom: 0, right: 250 })}
                        <Text style={{ left: 10 }}> {Math.round(product?.rating) + ' ' + 'Rating' + '\n' + '     ' + '&' + '\n' + product?.total_review + 'Review'}</Text>
                        <View style={{ position: "absolute", left: 130, top: 40 }}>
                            <View style={{ flexDirection: "row" }}>
                                <Text style={{ right: 30 }}>Five </Text>
                                {start({ size: 12, right: 180, left: 0, bottom: 0, top: 2 })}
                                <View style={{ width: 160, height: 8, backgroundColor: "silver", top: 8, borderRadius: 5, left: 4 }} />
                                <Text style={{ left: 11 }}> {product?.FiveStar}</Text>
                            </View>
                            <View style={{ flexDirection: "row", marginTop: 5 }}>
                                <Text style={{ right: 30 }}>Four </Text>
                                {start({ size: 12, right: 180, left: 0, bottom: 0, top: 2 })}
                                <View style={{ width: 160, height: 8, backgroundColor: "silver", top: 8, borderRadius: 5 }} />
                                <Text style={{ left: 9 }}> {product?.FourStar}</Text>
                            </View>
                            <View style={{ flexDirection: "row", marginTop: 5 }}>
                                <Text style={{ right: 30 }}>Three </Text>
                                {start({ size: 12, right: 180, left: 0, bottom: 0, top: 2 })}
                                <View style={{ width: 160, height: 8, backgroundColor: "silver", top: 8, borderRadius: 5, right: 8 }} />
                                <Text style={{ left: 0 }}> {product?.ThreeStar}</Text>
                            </View>
                            <View style={{ flexDirection: "row", marginTop: 5 }}>
                                <Text style={{ right: 30 }}>Two </Text>
                                {start({ size: 12, right: 180, left: 0, bottom: 0, top: 2 })}
                                <View style={{ width: 160, height: 8, backgroundColor: "silver", top: 8, borderRadius: 5 }} />
                                <Text style={{ left: 10 }}> {product?.TwoStar}</Text>
                            </View>
                            <View style={{ flexDirection: "row", marginTop: 5 }}>
                                <Text style={{ right: 30 }}>One </Text>
                                {start({ size: 12, right: 180, left: 0, bottom: 0, top: 2 })}
                                <View style={{ width: 160, height: 8, backgroundColor: "silver", top: 8, borderRadius: 5 }} />
                                <Text style={{ left: 10 }}> {product?.OneStar}</Text>
                            </View>
                        </View>
                        <View style={{ width: 355, height: 2, backgroundColor: '#E6E6E6', left: 5, top: 5 }} />
                    </View>

                    <View style={{ padding: 20, backgroundColor: "white", borderRadius: 8, top: 125, left: 5, shadowColor: "black", shadowOffset: { width: 1, height: 1 }, shadowOpacity: 1, shadowRadius: 1, elevation: 3 }}>
                        <Text style={{ color: "black", fontWeight: '900', margin: 10 }}> Product Details </Text>
                        <RenderHTML
                            source={{ html: html }}
                        />
                    </View>
                    <View style={{ padding: 10, height: 80, backgroundColor: "white", borderRadius: 8, top: 110, left: 5, shadowColor: "black", shadowOffset: { width: 1, height: 1 }, shadowOpacity: 1, shadowRadius: 1, elevation: 3, marginTop: 20 }}>
                        <Text style={{ color: "black", fontWeight: '900', margin: 10, top: 20, fontSize: 18 }}> NeedHelp ? </Text>
                        <View style={{ flexDirection: "row", position: "absolute", top: 30, left: 200, width: 160, backgroundColor: "#27AAE1", borderRadius: 10 }}>
                            <Icon name='chatbubbles' color={'white'} size={25} style={{ margin: 5, left: 5 }} />
                            <Text style={{ padding: 10, left: 10, color: "white", fontWeight: "500" }}>Chat With Us</Text>
                        </View>
                    </View>
                    <View style={{ padding: 10, height: 400, backgroundColor: "white", borderRadius: 8, top: 120, left: 5, shadowColor: "black", shadowOffset: { width: 1, height: 1 }, shadowOpacity: 1, shadowRadius: 1, elevation: 3 }}>
                        <Text style={{ color: "black", fontWeight: '900', margin: 10, top: 0, fontSize: 18 }}> Similar Products </Text>
                        {similarProduct()}
                    </View>
                </>)
                }
            </ScrollView>

            <View style={{ flexDirection: "row", position: "absolute", bottom: -5, backgroundColor: "white", height: 90, left: 0, width: Dimensions.get('screen').width }}>
                <View style={{ left: 30, top: 20 }}>
                    <TouchableOpacity >
                        <View style={{ width: 35, height: 35, backgroundColor: 'white', shadowColor: 'black', shadowOffset: { width: 1, height: 1 }, shadowOpacity: 1, shadowRadius: 1, elevation: 5, borderRadius: 60 }}>
                            {CheckWishlist()}
                        </View>
                    </TouchableOpacity>
                    <Text style={{ color: "black", right: 10 }}> Wishlist </Text>
                </View>
                <TouchableOpacity onPress={() => share()} style={{ left: 20, marginLeft: 50, top: 20 }}>
                    <View style={{ width: 35, height: 35, backgroundColor: 'white', shadowColor: 'black', shadowOffset: { width: 1, height: 1 }, shadowOpacity: 1, shadowRadius: 1, elevation: 5, borderRadius: 60 }}>
                        <Icon name='share-social' color={'black'} size={25} style={{ padding: 4.5 }} />
                    </View>
                    <Text style={{ color: "black", right: 10 }}> Share </Text>
                </TouchableOpacity>
                <View style={{ marginLeft: 50, flexDirection: "row", width: 150, borderRadius: 8, backgroundColor: "#27AAE1", height: 45, top: 25 }}>
                    <Icon name='cart-outline' color={'white'} size={25} style={{ top: 9, left: 5 }} />
                    <Text style={{ color: "white", fontSize: 15, top: 11, left: 20 }} onPress={() => product?.OptionKey?.length === 0 ? openBottomsheet.current.open() : color || size === '' ? Alert.alert('Please Select size or color') : openBottomsheet.current.open()}> Add to cart </Text>
                </View>
            </View>
            <View>
                <RBSheet
                    ref={openBottomsheet}
                    height={650}
                    customStyles={{ container: { borderTopLeftRadius: 25, borderTopRightRadius: 25 }, draggableIcon: { backgroundColor: "black" } }}
                >
                    <View>
                        <View style={{ flexDirection: 'row', borderBottomWidth: 0.5, height: 65 }}>
                            <Text style={{ color: 'black', fontSize: 18, fontWeight: '900', top: 20, left: 15 }}> Add to Cart</Text>
                            <Icon name='close' size={35} color={'black'} style={{ left: 225, top: 15 }} onPress={() => openBottomsheet.current.close()} />
                        </View>
                        <View style={{ flexDirection: 'row', top: 50, }}>
                            <Text style={{ color: 'black', fontSize: 15, fontWeight: '900', left: 15, top: 6 }}> Select Quantity</Text>
                            <View style={{ left: 110, flexDirection: "row" }}>
                                <Text style={{ color: 'black', fontSize: 15, fontWeight: '600', top: 8 }}> Qty</Text>
                                <TouchableOpacity onPress={() => quantity === 1 ? null : setQuantity(quantity - 1)} style={{ width: 30, height: 30, backgroundColor: "#F5F5F5", top: 5, left: 20, borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }}>
                                    <Text style={{ color: "black", fontSize: 20, fontWeight: '500', top: -10, left: 6 }}>_</Text>
                                </TouchableOpacity>
                                <View style={{ height: 30, width: 40, backgroundColor: 'white', left: 20, top: 5, borderTopWidth: 2, borderBottomWidth: 2, borderColor: '#F5F5F5' }}>
                                    <Text style={{ color: 'black', left: 10, top: 3 }}>{quantity}</Text>
                                </View>
                                <TouchableOpacity onPress={() => quantity === 10 ? ToastAndroid.show('Max 10 Qty is allowed at one time', ToastAndroid.SHORT) : setQuantity(quantity + 1)} style={{ width: 30, height: 30, backgroundColor: "#F5F5F5", top: 5, left: 20, borderTopRightRadius: 10, borderBottomRightRadius: 10 }}>
                                    <Text style={{ color: "black", fontSize: 20, fontWeight: '500', top: 0, left: 6 }}>+</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{ flexDirection: "row", top: 90 }}>
                            <Text style={{ fontSize: 16, color: 'black', fontWeight: '900', left: 15 }}> Total Price </Text>
                            <Text style={{ fontSize: 16, color: 'black', fontWeight: '900', left: 210 }}> {product?.currency_data?.symbol + product?.offer_price * quantity}</Text>
                        </View>
                        <TouchableOpacity style={{ marginLeft: 30, flexDirection: "row", width: '85%', borderRadius: 8, backgroundColor: "#27AAE1", height: 45, top: 135 }} onPress={() => addToCart()}>
                            <Text style={{ color: "white", fontSize: 18, top: 11, left: 120 }} onPress={() => openBottomsheet.current.open()}> Continue</Text>
                        </TouchableOpacity>
                    </View>
                </RBSheet>
            </View>
            <Modal
                visible={openImageModal}
                onRequestClose={() => setOpenImageModal(false)}
                animationType='fade'
            >
                <View style={{ flex: 1, backgroundColor: 'black' }}>
                    <View style={{ left: 340, margin: 6 }}>
                        <Icon name='close' color={'white'} size={35} style={{}} onPress={() => setOpenImageModal(false)} />
                    </View>
                    <Text style={{ color: 'white', top: 30, fontSize: 20, left: 160 }}> {parseInt(activeIndex) + 1}/{product?.product_images?.length}</Text>

                    <View style={{ marginTop: 50 }}>
                        <FlatList
                            data={product?.product_images}
                            horizontal
                            pagingEnabled
                            onScroll={(e: any) => { setActiveIndex((e.nativeEvent.contentOffset.x / Dimensions.get('screen').width).toFixed(0)) }}
                            initialScrollIndex={image}
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={item => item.id}
                            renderItem={({ item, index }) => {
                                return (
                                    <View style={{ margin: 0 }}>
                                        <Animated.View
                                            style={{
                                                shadowColor: 'black',
                                                shadowOffset: { width: 0, height: 0 },
                                                shadowOpacity: activeIndex === index ? 0.5 : 0,
                                                shadowRadius: 10,
                                                elevation: activeIndex === index ? 10 : 0,
                                                transform: [{ scale: activeIndex === index ? 1.05 : 1 }],
                                                paddingBottom: 50
                                            }}
                                        >
                                            <Image source={{ uri: item?.ImageSrc }} style={{ width: Dimensions.get('screen').width, height: 500 }} resizeMode='contain' />
                                        </Animated.View>
                                    </View>
                                )
                            }}
                        />
                    </View>
                </View>
            </Modal>
            <View>
                <Modal
                    visible={openSizeChartModal}
                    onRequestClose={() => setOpenSizeChartModal(false)}
                >
                    <ScrollView contentContainerStyle={{ backgroundColor: 'white', paddingBottom: 30 }}>
                        <Icon name='close' size={35} style={{ left: 350, }} color={'black'} onPress={() => setOpenSizeChartModal(false)} />
                        <Text style={{ textAlign: "center", color: 'black', fontSize: 20, fontWeight: '900' }}> Size Chart </Text>
                        <View style={{}}>
                            <Image source={{ uri: product?.size_chart?.chart }} style={{ width: Dimensions.get('screen').width - 40, height: 300, resizeMode: 'contain', left: 20 }} />
                        </View>
                        <View style={{ top: 50, justifyContent: "center", alignItems: 'center' }}>
                            <Image source={{ uri: product?.size_chart?.measure }} style={{ width: Dimensions.get('screen').width - 40, height: 300, resizeMode: 'contain' }} />
                        </View>
                    </ScrollView>
                </Modal>
            </View>
        </View>
    )
}

export default ExampleDeatil