import {
    View, Text, FlatList, Image, TouchableOpacity, Alert, Pressable, ScrollView, ActivityIndicator,
    RefreshControl, Dimensions, ImageBackground, Modal, ToastAndroid, TouchableWithoutFeedback, TextInput, Animated, StyleSheet, BackHandler
} from 'react-native'
import React, { useEffect, useState, useRef, useCallback } from 'react'
import { Appbar, Avatar, Badge, Divider, Searchbar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import ProductOnHomePage from '../ProductPage/ProductOnHomePage';
import firestore from '@react-native-firebase/firestore'
import { firebase } from "@react-native-firebase/auth";
import { useIsFocused } from '@react-navigation/native'
import SwiperFlatList from 'react-native-swiper-flatlist';
import axios, { Axios } from 'axios';
import Logo from '../../component/Logo';
import { _makeAxiosGetRequest, _makeAxiosPostRequest } from '../../Service/axios';
import { endpoint } from '../../Service/endpoint';
import { AirbnbRating } from 'react-native-ratings';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { horizontal } from 'react-native-swiper-flatlist/src/themes';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import NetInfo from "@react-native-community/netinfo";
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import finalPropsSelectorFactory from 'react-redux/es/connect/selectorFactory';
import SkeltonEffect from '../../component/SkelatonEffect/SkeltonEffectHomePage';
import { useSelector, useDispatch } from 'react-redux'
import { selectShowSplash, setShowSplash } from '../../redux/slice/splashScreenSlice'
type allproduct = {
    category: string
    title: string
}

type user = {
    Name: string
    Profile: string
}

type cartitem = {
    Name: string
}
type slidingBanner = {

}

type featureProduct = {
    offer_price: number
    currency_data: []
    product_name: string
    discounts: number
    ImageSrc: string
    id: number
    price: number
    symbol: string
}
type topProducts = {
    offer_price: number
    currency_data: []
    product_name: string
    discounts: number
    ImageSrc: string
    id: number
    price: number
    symbol: string

}
type trendingProduct = {
    offer_price: number
    currency_data: []
    product_name: string
    discounts: number
    ImageSrc: string
    id: number
    price: number
    symbol: string

}
type category = {
    offer_price: number
    currency_data: []
    product_name: string
    discounts: number
    ImageSrc: string
    id: number
    price: number
    symbol: string

}
const HomePage = ({ navigation, route, navigation: { goBack, canGoBack } }: { navigation: any, route: any }) => {
    const isFocused = useIsFocused();
    const flatListRef = useRef<any>();
    const searchRef = useRef<any>();
    const ScrollRef = useRef<any>(null);
    const [allProduct, setAllProduct] = useState<allproduct[]>([]);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false)
    const [cartItem, setCartItem] = useState<cartitem[]>([])
    const [search, setSearch] = useState<string>('')
    const [searchProduct, setSearchProduct] = useState([])
    const [searchCondition, setSearchCondition] = useState<boolean>(false)
    const [userId, setUserId] = useState<string>('')
    const [offSet, setOffSet] = useState<number>(0);
    const [activeIndex, setActiveIndex] = useState<any>(0)
    const [category, setCategory] = useState<category[]>([]);
    const [slidingBanner, setSlidingBanner] = useState<slidingBanner[]>([]);
    const [featureProduct, setFeatureProduct] = useState<featureProduct[]>([])
    const [topProducts, setTopProducts] = useState<topProducts[]>([]);
    const [trendingProducts, setTrendingProducts] = useState<trendingProduct[]>([]);
    const [loader, setLoader] = useState(false);
    const [brand, setBrands] = useState([])
    const [discountOffer, setDiscountOffer] = useState([]);
    const [nearByVendors, setNearByVendors] = useState([]);
    const [wishlistData, setWishlistData] = useState([]);
    const [cartList, setCartList] = useState([]);
    const [notification, setNotification] = useState(0);
    const [isConnect, setIsConected] = useState<boolean>(false)
    const fadeAnim = useRef(new Animated.Value(200)).current;
    const [skeleton, setSkeleton] = useState(false)
    const [location, setLocation] = useState('')
    const [wishlistCount, setWishListCount] = useState()
    const [onEnd, setOnEnd] = useState(false)
    const [imageLoad, setImageLoad] = useState(false)
    const [recentProduct, setRecentProduct] = useState([]);
    const dispatch = useDispatch();

    const showSplash = useSelector(selectShowSplash)


    const getCartProduct = async () => {
        const body = new FormData()
        body.append('session_id', null)
        body.append('user_id', userId)
        _makeAxiosPostRequest(endpoint.cart, body).then((res) => {
            setCartList(res.data)
        }).catch((error) => { console.log('cart============>', error.response.data) })
    }
    useEffect(() => {
        getHomePageData();
        getSlidingBanner();
        getCategory();
        getFeaturedProducts();
        getTopProducts();
        getTrendingProducts();
        // getVendor();
        getWishlist();
        getLoaction();
        getWishlist()
        getUserId();
        getCartProduct();
        getAllNotifications();
        const Unsubcribe: any = NetInfo.addEventListener((state: any) => {
            // console.log('connection', state.type)
            // console.log('isconected?', state.isConnected)
            setIsConected(state.isConnected)
        })


        const ISConnect = () => {
            if (isConnect == false) {
                StartAnimation()
            } else { null }
        }
        const unsubcribe = navigation.addListener('focus', () => {
            scrolltoTop();
        });
        return () => {
            Unsubcribe();
            unsubcribe
            ISConnect()
        }
    }, [])

    const StartAnimation = () => {
        Animated.timing(fadeAnim, {
            toValue: 20,
            useNativeDriver: false,
            duration: 1500,
        }).start()
    }

    const getUserId = async () => {
        const id: any = await AsyncStorage.getItem('USERID')
        const userid = JSON.parse(id)
        // console.log(userid)
        setUserId(userid)
    }

    const Onrefresh = () => {
        getHomePageData();
        getSlidingBanner();
        setSearch('');
        getCategory();
        getFeaturedProducts();
        getTopProducts();
        getTrendingProducts();
        // getVendor();
        getWishlist();
        getAllNotifications();
    }

    const refreshOnfocus = () => {
        getWishlist();
        getAllNotifications();
        getCartProduct();
    }

    const getSlidingBanner = async () => {
        // setSkeleton(true)

        _makeAxiosGetRequest(endpoint.getslidingBanner, {}).then((res) => {
            setSlidingBanner(res.data.slider)
            // setSkeleton(false)

        }).catch((error) => {
            console.log(error)
            setSkeleton(false)

        })
    }

    const getCategory = async () => {
        // setSkeleton(true)

        _makeAxiosGetRequest(endpoint.getCategory, {})
            .then((res) => {
                // console.log('category', res.data)
                setCategory(res.data)
                // setSkeleton(false)

            }).catch((err) => {
                console.log('first', err)
                setSkeleton(false)
            })
    }

    const scrolltoTop = () => {
        if (ScrollRef.current) {
            ScrollRef.current.scrollTo({ x: 1, y: 1, animated: true });
            refreshOnfocus()
        }
    };

    const getTopProducts = async () => {
        // setSkeleton(true)
        _makeAxiosGetRequest(endpoint.getTopProducts, {}).then((res) => {
            const data = res.data.data
            setTopProducts(data)
            // console.log('top=====>', res)
            // setSkeleton(false)

        }).catch((err) => {
            console.log('error', err)
            setSkeleton(false)

        })
    }


    const getFeaturedProducts = async () => {
        // setSkeleton(true)

        _makeAxiosGetRequest(endpoint.getFeatureProduct, {}).then((res) => {
            setFeatureProduct(res.data.data)
            // setSkeleton(false)

        }).catch((err) => {
            console.log(err)
            setSkeleton(false)

        })

    }
    const getTrendingProducts = async () => {
        // setSkeleton(true)

        _makeAxiosGetRequest(endpoint.getTrendingProduct, {}).then((res) => {
            // console.log('trending', res.data.data)
            const data = res.data.data
            setTrendingProducts(data.reverse())
            // setSkeleton(false)
        }).catch((err) => {
            console.log(err)
            Alert.alert(err.message)
            setSkeleton(false)

        })
    }

    const getHomePageData = () => {
        setSkeleton(true)
        _makeAxiosGetRequest(endpoint.HomePage, {}).then((res) => {
            setBrands(res.data.brand)
            setDiscountOffer(res.data.OfferZone)
            setRecentProduct(res.data.recentProduct)
            // setSkeleton(false)

        }).catch((error) => {
            console.log(error)
            setSkeleton(false)

        })
    }

    // console.log('discount====>', discountOffer)

    const getLoaction = async () => {
        const locat: any = await AsyncStorage.getItem('Loacation')
        const location = JSON.parse(locat)
        setLocation(location)
    }
    // const getVendor = async () => {
    //     // setSkeleton(true)
    //     const body = new FormData()
    //     body.append('location_lat', location?.location_lat)
    //     body.append('location_long', location?.location_long)
    //     body.append('city', 'udaipur')
    //     body.append('state', 'rajasthan')
    //     _makeAxiosPostRequest(endpoint.getByVendor, body).then((res) => {
    //         setNearByVendors(res.data.vendors)
    //         // setSkeleton(false)
    //     }).catch((err) => {
    //         console.log(err)
    //         setSkeleton(false)
    //     })
    // }

    const getAllNotifications = () => {
        _makeAxiosGetRequest(endpoint.myNotification, {}).then((res) => {
            // console.log(res.data)
            setNotification(res.data.unread_count)
            setSkeleton(false)
        }).catch((error) => {
            console.log(error)
        })
    }

    const getWishlist = () => {
        _makeAxiosGetRequest(endpoint.getWishlist, {}).then((res: any) => {
            // console.log('wishlistdata=========>', res.data.products.data)
            setWishListCount(res?.data?.count)
            setWishlistData(res.data.products.data)
        }).catch((error) => {
            console.log(error)
        })
    }


    const displayCategory = () => {
        return (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{}}>
                <View style={{ left: 5, padding: 10 }}>
                    <TouchableOpacity onPress={() => navigation.navigate('Wishlist')}>
                        <Image source={require('../../component/IconImage/collage.png')} resizeMode='contain' style={style.discatimage} />
                    </TouchableOpacity>
                    <Text style={style.discattitle}>  All Category </Text>
                </View>
                <FlatList
                    style={{ left: 5 }}
                    data={category}
                    keyExtractor={(item: any) => item?.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item, index }: { item: any, index: any }) => {
                        return (
                            <View>
                                <View style={{ margin: 5, }}>
                                    <TouchableOpacity onPress={() => navigation.navigate('ExampleWomenCloths', { id: item.id, title: item.name })} style={style.discatdetailcon}>
                                        <Image source={{ uri: item.ImageSrc }} resizeMode='contain' style={style.discatdetailimage} />
                                    </TouchableOpacity>
                                    <Text style={style.discatdetailname}> {item.name}</Text>
                                </View>
                            </View>
                        )
                    }}
                />
            </ScrollView>
        )
    }


    const freshArivals = () => {
        return (
            <View>
                <View style={{ flexDirection: "row", }}>
                    <Text style={style.featuretext1}> Fresh Arrivals </Text>
                    <TouchableOpacity style={[style.featuretext2]} onPress={() => navigation.navigate('ExampleFreshArrivalAllProduct')} >
                        <Text style={{ color: "black", fontSize: 20, padding: 0 }} > View All </Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={recentProduct}
                    horizontal
                    style={{ top: 5 }}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item: any) => item.id}
                    renderItem={({ item, index }: { item: any, index: any }) => {
                        return (
                            <Pressable onPress={() => navigation.navigate('ExampleDetail', { id: item.id })} style={style.renfeaprocon}>
                                <Image source={{ uri: item?.ImageSrc }} resizeMode='stretch' style={{ width: 190, height: 200 }} />
                                <Text style={style.renfeaproname}>{item?.product_name?.length >= 20 ? item?.product_name.substring(0, 19) + '...' : item?.product_name}</Text>
                                <View style={style.renfeaprodetail}>
                                    <Text style={[style.renfeaproofferprice, { top: 12, fontWeight: '500' }]} numberOfLines={1}> {item?.short_desc}</Text>
                                    <Text style={[style.renfeaproofferprice, { top: 15 }]}> {item?.currency_data?.symbol + ' ' + item?.offer_price}</Text>
                                </View>

                            </Pressable>
                        )

                    }}
                />
            </View>
        )
    }


    const allTopProducts = () => {


        return (
            <View>
                <View style={{ flexDirection: "row", padding: 10, borderWidth: 0.5, borderColor: 'grey' }}>
                    <Text style={style.topproducttext1}> Top Products</Text>
                    <TouchableOpacity style={[style.topproducttext2,]}>
                        <Text style={{ fontSize: 20, color: 'black', }} onPress={() => navigation.navigate('ExampleTopAllProduct')}> View All </Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={topProducts}
                    numColumns={2}
                    style={{ top: 5 }}
                    onEndReached={() => setOnEnd(true)}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item: any) => item.id}
                    renderItem={({ item, index }: { item: any, index: any }) => {
                        return (
                            <View style={style.rentopprocon}>
                                <TouchableOpacity onPress={() => navigation.navigate('ExampleDetail', { id: item.id })}>
                                    <Image source={{ uri: item?.ImageSrc }} resizeMode='cover' style={{ width: Dimensions.get('screen').width / 2 - 2, height: 200 }} />
                                    <Text style={style.rentopproname}>{item?.product_name?.length >= 20 ? item?.product_name.substring(0, 19) + '...' : item?.product_name}</Text>
                                    <Text numberOfLines={1} style={[style.rentopproname, { color: "grey" }]}>{item?.short_desc}</Text>
                                    <View style={style.rentopprocon1}>
                                        <Text style={style.rentopproofferprice}> {item?.currency_data?.symbol + ' ' + item?.offer_price}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>)
                    }}
                />
            </View>
        )
    }
    const featureProducts = () => {
        return (
            <View>
                <View style={{ flexDirection: "row", padding: 10, borderWidth: 0.5, borderColor: 'grey', top: 5 }}>
                    <Text style={style.topproducttext1}>Feature Product </Text>
                    <TouchableOpacity style={{ left: 140, top: 5 }} onPress={() => navigation.navigate('ExampleFeatureAllProduct')}>
                        <Text style={{ fontSize: 18, color: "black", fontWeight: '800', }} > View All </Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={featureProduct}
                    numColumns={2}
                    style={{ left: 8, top: 10 }}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item: any) => item.id}
                    renderItem={({ item, index }: { item: any, index: any }) => {
                        return (

                            <View style={{ borderRightWidth: 0.5, backgroundColor: 'white', width: Dimensions.get('screen').width / 2, paddingBottom: 10, }}>
                                <TouchableOpacity onPress={() => navigation.navigate('ExampleDetail', { id: item.id })}>
                                    <Image source={{ uri: item?.ImageSrc }} resizeMode='stretch' style={{ width: Dimensions.get('screen').width / 2 - 2, height: 200, }} />
                                    <Text style={style.rentopproname}>{item?.product_name?.length >= 20 ? item?.product_name.substring(0, 19) + '...' : item?.product_name}</Text>
                                    <Text numberOfLines={1} style={[style.rentopproname, { color: "grey", right: 50 }]}> {item?.short_desc}</Text>
                                    <View style={style.rentopprocon1}>
                                        <Text style={style.rentopproofferprice}> {item?.currency_data?.symbol + ' ' + item?.offer_price}</Text>
                                    </View>
                                </TouchableOpacity>

                            </View>)
                    }}
                />
            </View>)
    }

    const allTrendingProducts = () => {

        return (
            <View>
                <View style={{ flexDirection: "row", padding: 10, borderWidth: 0.5, borderColor: "grey", bottom: 0, top: 5 }}>
                    <Text style={style.trendingproducttext1}> Trending Products</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('ExampleTrendingAllProduct')} style={style.trendingproducttext2} >
                        <Text style={{ color: 'black', fontSize: 20 }} > View All </Text>

                    </TouchableOpacity>
                </View>
                <FlatList
                    data={trendingProducts}
                    horizontal
                    style={{ top: 5 }}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item: any) => item.id}
                    renderItem={({ item, index }: { item: any, index: any }) => {
                        return (
                            <View style={style.rendertrendingproductcontainer}>
                                <TouchableOpacity onPress={() => navigation.navigate('ExampleDetail', { id: item.id })}>
                                    <Image source={{ uri: item?.ImageSrc }} resizeMode='stretch' style={{ width: 200, height: 200 }} />
                                    <Text style={style.rentreproname}> {item?.product_name?.length >= 20 ? item?.product_name.substring(0, 19) + '...' : item?.product_name}</Text>
                                    <Text style={[style.rentreproname, { color: "grey" }]} numberOfLines={1}> {item?.short_desc}</Text>
                                    <View style={style.rentrecon}>
                                        <Text style={style.rentreproofferprice}> {item?.currency_data?.symbol + ' ' + item?.offer_price}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        )

                    }}
                />
            </View>
        )
    }

    const brands = () => {
        return (
            <View>
                <View style={{ flexDirection: "row" }}>
                    <Text style={style.brandtext}> Brands</Text>
                </View>
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={brand}
                    keyExtractor={(item: any) => item.id}
                    renderItem={({ item, index }) => {
                        return (
                            <TouchableOpacity style={style.renderbrandcontainer} onPress={() => navigation.navigate('ExampleProductByBrand', { productId: item.id, Brandname: item.name })}>
                                <Image source={{ uri: item.imageUrl }} style={style.renderbrandimage} resizeMode='contain' />
                                <View style={style.renderbrandnamecontainer}>
                                    <Text style={style.renderbrandname}> {item.name}</Text>
                                </View>
                            </TouchableOpacity>
                        )
                    }}
                />
            </View>
        )
    }
    const offerZone = () => {
        if (discountOffer.length === 0) {
            <Text style={{ color: 'black', fontWeight: '700' }}> Nothig Found !!</Text>
        } else {

        }
        return (
            <View style={{ justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
                <FlatList
                    numColumns={2}
                    style={{ top: 0, borderColor: "black", borderWidth: 0.5, width: 380, }}
                    data={discountOffer}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item: any) => item.id}
                    renderItem={({ item, index }: { item: any, index: any }) => {
                        return (
                            <TouchableOpacity style={style.renderoffercontainer} onPress={() => navigation.navigate('ExampleProductByDiscount', { start_discount: item.start_discount, end_discount: item.end_discount, title: item.title, })}>

                                <Text style={style.renderoffertitle}>{item.title}</Text>

                                {/* <View style={{ borderLeftWidth: 0.5, height: 30, right: 15, bottom: 10 }} /> */}
                            </TouchableOpacity>
                        )
                    }}
                />
            </View>
        )
    }
    const renderslider = ({ item, index }: { item: any, index: any }) => {
        return (
            <View style={{ margin: 0 }}>
                <View>
                    <Image
                        //  onLoad={() => {
                        //     const AllImageLoad = slidingBanner.every((item: any) => item.loaded)
                        //     if (AllImageLoad) {
                        //         setImageLoad(true)
                        //     } else { setImageLoad(false) }
                        //     item.loaded = true;
                        // }}
                        source={{ uri: item.ImageSrc }} style={style.sliderImage} resizeMode='stretch' />
                </View>
            </View>
        )
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
            <View style={style.headerConatiner}>
                <View style={style.headerView}>
                    <Logo top={-0} left={10} right={0} width={150} height={50} />
                    <TouchableOpacity onPress={() => navigation.navigate('Notification')} style={style.notificationIconView}>
                        <Icon name='notifications-outline' color={'black'} size={25} style={{ padding: 3, left: 0 }} />
                        <Badge style={style.notificationIcon} visible={notification === 0 ? false : true} >{notification}</Badge>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('ExampleWishlist')} style={[style.wishlistIconView]}>
                        <Icon name='heart-outline' color={'black'} size={25} style={{ left: 0, padding: 3 }} />
                        <Badge style={style.cartBadge} visible={wishlistCount === 0 ? false : true} >{wishlistCount}</Badge>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('ShoppingCart')} style={style.cartIconView}>
                        <Icon name='ios-cart-outline' color={'black'} size={25} style={{ left: 0, padding: 3 }} />
                        <Badge style={style.cartBadge} visible={cartList.length === 0 ? false : true} >{cartList?.length}</Badge>
                    </TouchableOpacity>
                </View>
            </View>
            {skeleton ? (<SkeltonEffect />) : (<ScrollView showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refresh} onRefresh={() => Onrefresh()} />} contentContainerStyle={{ paddingBottom: 10,top:5
             }} ref={ScrollRef}>
                <View style={style.container}>
                    <TouchableOpacity onPress={() => navigation.navigate('ExampleSearch')} style={style.searchContainer}>
                        <Icon name='search' color={'black'} size={30} style={{ margin: 10, top: 0 }} />
                        <Text style={{ top: 15, fontSize: 15, color: 'black' }}> Search for Products </Text>
                    </TouchableOpacity>
                    <View style={style.displaycategory}>
                        {displayCategory()}
                    </View>
                    <View style={style.sliderContainer}>
                        <SwiperFlatList
                            showsHorizontalScrollIndicator={false}
                            data={slidingBanner}
                            pagingEnabled={true}
                            keyExtractor={item => item.id}
                            autoplay
                            autoplayLoop
                            onScroll={(e: any) => { setActiveIndex((e.nativeEvent.contentOffset.x / Dimensions.get('screen').width).toFixed(0)) }}
                            autoplayDelay={3}
                            renderItem={renderslider}
                        />
                        <View style={style.sliderDot}>
                            {slidingBanner.map((item, index) => {
                                return (
                                    <View style={[style.dot, { backgroundColor: activeIndex == index ? '#27AAE1' : "#DAD3CF", }]}>
                                    </View>
                                )
                            })
                            }
                        </View>
                    </View>

                    <View style={style.offercontainer}>
                        {offerZone()}
                    </View>
                    <View style={{ paddingBottom: 30, backgroundColor: 'white', shadowColor: "black", shadowOffset: { width: 1, height: 1 }, shadowOpacity: 1, shadowRadius: 1, elevation: 2 }}>
                        <View style={style.featureproductcontainer} >
                            {freshArivals()}
                        </View >
                        <View style={style.brandcontainer}>
                            {brands()}
                        </View>
                        <View style={style.topproductcontainer}>

                            {allTopProducts()}

                        </View>
                        <View style={style.trendingproductcontainer}>
                            {allTrendingProducts()}
                        </View>
                        <View style={style.featureproductcontainer}>
                            {featureProducts()}
                        </View>

                    </View>

                </View>
                {loader ? <View>
                    <Modal
                        visible={loader}
                        transparent={true}
                        onRequestClose={() => setLoader(false)}
                    >
                        <View style={style.loadermodalcontainer}>
                            <Image style={style.loadermodalimage} resizeMode='contain' source={{ uri: 'https://media.tenor.com/vp3V50Hs-B8AAAAj/loading-waiting.gif' }} />
                            <Text style={style.loadermodaltext}> Please Wait....</Text>
                        </View>
                    </Modal>
                </View> : null}

            </ScrollView>)
            }
            {
                isConnect == false ?
                    <View style={style.netinfocontainer}>
                        <Text style={style.netinfotext}> Check Internet Connection... </Text>
                    </View>
                    : null
            }
        </View >

    )
}
const style = StyleSheet.create({
    headerConatiner: {
        backgroundColor: "white",
        shadowColor: 'black',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 1,
        shadowRadius: 1,
        elevation: 2,
        height: 60,
        width: '101%',
        top: 3
    },
    headerView: {
        flexDirection: 'row',
        bottom: 1,
        top: 0,
        margin: 5,
        backgroundColor:'white'

    },
    notificationIconView: {
        backgroundColor: 'white',
        right: 40,
        width: 30,
        height: 30,
        borderRadius: 50,
        top: 10,
        shadowColor: 'black',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 1,
        shadowRadius: 1,
        elevation: 2
    },
    notificationIcon: {
        backgroundColor: '#27AAE1',
        left: 5,
        bottom: 35,
        color: "white",
    },
    cartIconView: {
        right: 15,
        backgroundColor: 'white',
        borderRadius: 40,
        height: 30,
        width: 30,
        top: 10,
        shadowColor: 'black',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 1,
        shadowRadius: 1,
        elevation: 2
    },
    cartBadge: {
        backgroundColor: "#27AAE1",
        left: 5,
        bottom: 35,
        color: "white",
    },
    wishlistIconView: {
        right: 28,
        backgroundColor: 'white',
        borderRadius: 40,
        height: 30,
        width: 30,
        top: 10,
        shadowColor: 'black',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 1,
        shadowRadius: 1,
        elevation: 2
    },
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    searchContainer: {
        width: '95%',
        height: 48,
        backgroundColor: '#EDEDED',
        left: 10,
        top: 10,
        flexDirection: 'row',
        borderRadius: 10
    },
    searchcloseIcon: {
        margin: 10,
        top: 0,
        left: 0
    },
    displaycategory: {
        top: 12
    },

    sliderContainer: {
        top: 20,
    },
    sliderImage: {
        width: Dimensions.get('screen').width,
        height: 280,
        borderRadius: 0,
        bottom: 0,
    },
    sliderDot: {
        flexDirection: "row",
        marginTop: -20,
        borderRadius: 10,
        left: 180
    },
    dot: {
        width: 7,
        height: 7,
        borderRadius: 10,
        marginLeft: 10,
        left: -10
    },
    offercontainer: {
        width: Dimensions.get('screen').width,
        height: 200,
        top: 80,
        left: 2.5
    },
    offertext: {
        color: "black",
        fontWeight: '700',
        fontSize: 18,
        margin: 5
    },
    brandcontainer: {
        backgroundColor: "white",
        top: 10,
        height: 250
    },
    brandtext: {
        color: "black",
        fontWeight: '700',
        fontSize: 18,
        margin: 5
    },
    featureproductcontainer: {
        backgroundColor: "white",
        width: Dimensions.get('screen').width,
    },
    featuretext1: {
        color: "black",
        fontWeight: '700',
        fontSize: 18,
        margin: 5
    },
    featuretext2: {
        color: "black",
        fontWeight: '700',
        margin: 5,
        fontSize: 18,
        left: 150
    },
    topproductcontainer: {
        backgroundColor: "white",
        width: Dimensions.get('screen').width,
        bottom: 0,
        shadowColor: 'black',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 1,
        shadowRadius: 1,
        elevation: 2,
        paddingBottom: 20,
    },
    topproducttext1: {
        color: "black",
        fontWeight: '700',
        fontSize: 18,
        top: 0,
    },
    topproducttext2: {
        color: "black",
        fontWeight: '700',
        margin: 5,
        fontSize: 18,
        left: 150
    },
    trendingproductcontainer: {
        width: Dimensions.get('screen').width,
        height: 330,
        top: -25,
        shadowColor: 'black',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 1,
        shadowRadius: 1,
        elevation: 5,
        backgroundColor: "white"
    },
    trendingproducttext1: {
        color: "black",
        fontWeight: '700',
        fontSize: 18,
        margin: 5
    },
    trendingproducttext2: {
        color: "black",
        fontWeight: '700',
        margin: 5,
        fontSize: 18,
        left: 110
    },
    vendorcontainer: {
        backgroundColor: "white",
        width: Dimensions.get('screen').width,
        height: 330,
        top: 0
    },
    vendortext1: {
        color: "black",
        fontWeight: '700',
        fontSize: 18,
        margin: 5
    },
    vendortext2: {
        color: "black",
        fontWeight: '700',
        margin: 5,
        fontSize: 18,
        left: 150,

    },
    loadermodalcontainer: {
        backgroundColor: "white",
        width: 140,
        height: 100,
        top: 280,
        left: 125,
        borderRadius: 10,
        shadowColor: "black",
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 1,
        shadowRadius: 1,
        elevation: 5
    },
    loadermodalimage: {
        width: 50,
        height: 50,
        left: 40,
        top: 20,
        tintColor: "#A49456"
    },
    loadermodaltext: {
        color: "black",
        left: 15,
        top: 20
    },
    netinfocontainer: {
        backgroundColor: "red",
        top: 740,
        width: '90%',
        height: 40,
        borderRadius: 5,
        position: "absolute",
        paddingBottom: 20,
        left: 15
    },
    netinfotext: {
        color: 'white',
        fontWeight: "700",
        top: 10
    },
    renderoffercontainer: {
        backgroundColor: '#27AAE1',
        height: 40,
        borderRadius: 2,
        margin: 5,
        left: 0,
        width: '47%'

    },
    renderoffertitle: {
        color: "white",
        fontWeight: '900',
        fontSize: 15,
        textAlign: "center",
        top: 10,
        left: 0,

    },
    renderbrandcontainer: {
        backgroundColor: 'white',
        shadowColor: 'black',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 1,
        shadowRadius: 10,
        elevation: 10,
        margin: 5,
        bottom: 0,
        width: 150,
    },
    renderbrandimage: {
        width: '98%',
        height: 170,
        bottom: 10,
        left: 5
    },
    renderbrandnamecontainer: {
        backgroundColor: "white",
        bottom: 0
    },
    renderbrandname: {
        color: "black",
        textAlign: "center",
        bottom: 20
    },
    rendertrendingproductcontainer: {
        backgroundColor: "white",
        width: 200,
        paddingBottom: 20,
        borderRightWidth: 0.5,
        borderBottomWidth: 0.5,
    },
    rendertrendingproductimage: {
        width: 200,
        height: 200,
        left: 15,
        top: 10
    },
    rentreprodiscon: {
        width: 50,
        height: 20,
        position: "absolute",
        backgroundColor: "#A49456",
        margin: 5,
        right: 160
    },
    rentreproname: {
        color: "black",
        top: 10,
        fontWeight: '800',
        left: 5,
    },
    rentrecon: {
        flexDirection: "row",
        top: 10,
        right: 15
    },
    rentreproofferprice: {
        color: "black",
        fontWeight: '900',
        fontSize: 16,
        left: 15
    },
    rentrepropricecon: {
        borderBottomWidth: 1,
        borderColor: 'black',
        left: 20,
        bottom: 8
    },
    rentreproprice: {
        color: "#676767",
        fontWeight: '600',
        fontSize: 13,
        top: 11
    },
    rentreprodiscount: {
        color: '#6EC5A2',
        fontSize: 15,
        fontWeight: 'bold',
        left: 30,
        top: 0
    },
    renvencon: {
        margin: 5,
        backgroundColor: "white",
        width: 220,
        height: 260,
        shadowColor: "black",
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 2,
        shadowRadius: 5,
        elevation: 5,
        marginRight: 10
    },
    renvenbusinessname: {
        color: "black",
        fontSize: 18,
        top: 10
    },
    renvenrating: {
        top: 10,
        right: 50
    },
    rentopprocon: {
        backgroundColor: "white",
        paddingBottom: 30,
        borderRightWidth: 0.5,
        width: Dimensions.get('screen').width / 2

    },
    rentopproimage: {
        width: 200,
        height: 200,
        left: 10,
        top: 10
    },
    rentopprodiscon: {
        width: 50,
        height: 20,
        position: "absolute",
        backgroundColor: "#A49456",
        margin: 5,
        right: 160
    },
    rentopproname: {
        color: "black",
        top: 10,
        fontWeight: '800',
        left: 8,
    },
    rentopprocon1: {
        flexDirection: "row",
        top: 10,
        right: 15
    },
    rentopproofferprice: {
        color: "black",
        fontWeight: '900',
        fontSize: 16,
        left: 15
    },
    rnetoppropricecon: {
        borderBottomWidth: 1,
        borderColor: 'black',
        left: 20,
        bottom: 8
    },
    rentopproprice: {
        color: "#676767",
        fontWeight: '600',
        fontSize: 13,
        top: 11
    },
    rentopprodiscount: {
        color: '#6EC5A2',
        fontSize: 15,
        fontWeight: 'bold',
        left: 30,
        top: 0
    },
    renfeaprocon: {
        backgroundColor: "white",
        width: 190,
        paddingBottom: 25,
        borderRightWidth: 0.5,
        borderBottomWidth: 0.5,
        margin: 1
    },
    renfeaproimage: {
        width: 200,
        height: 200,
        left: 0,
        top: 10
    },
    renfeaprodiscon: {
        width: 50,
        height: 20,
        position: "absolute",
        backgroundColor: "#A49456",
        margin: 5,
        right: 160
    },
    renfeaproname: {
        color: "black",
        top: 10,
        fontWeight: '800',
        left: 5,
    },
    renfeaprodetail: {
        top: -5,
        right: 15
    },
    renfeaproofferprice: {
        color: "black",
        fontWeight: '900',
        fontSize: 16,
        left: 15,
    },
    renfeapropricecon: {
        borderBottomWidth: 1,
        borderColor: 'black',
        left: 20,
        bottom: 8
    },
    renfeaproprice: {
        color: "#676767",
        fontWeight: '600',
        fontSize: 13,
        top: 11
    },
    renfeaprodiscount: {
        color: '#6EC5A2',
        fontSize: 15,
        fontWeight: 'bold',
        left: 30,
        top: 0
    },
    discatimagecon: {
        borderRadius: 50,
        width: 60,
        height: 60,
        shadowColor: "black",
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 1,
        shadowRadius: 1,
        elevation: 5,
        backgroundColor: "white",
        marginBottom: 10
    },
    discatimage: {
        width: 62,
        height: 62,
        left: 2,
        borderRadius: 50,
        shadowColor: "black",
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 1,
        shadowRadius: 1,
        elevation: 5,
        backgroundColor: "white",
        marginBottom: 3,
        bottom: 5

    },
    discattitle: {
        color: "black",
        top: -5,
        fontWeight: '800',
        fontSize: 9,
        textAlign: "center"
    },
    discatdetailcon: {
        borderRadius: 50,
        width: 60,
        height: 60,
        shadowColor: "black",
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 1,
        shadowRadius: 1,
        elevation: 3,
        backgroundColor: "white",
        left: 5
    },
    discatdetailimage: {
        borderRadius: 50,
        width: 60,
        height: 60,
    },
    discatdetailname: {
        color: "black",
        top: 5,
        fontWeight: '800',
        fontSize: 9,
        left: 0,
        textAlign: "center"
    }


})

export default HomePage
