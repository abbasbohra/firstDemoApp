import { View, Text, ImageBackground, ScrollView, ToastAndroid, Image, FlatList, Dimensions, ActivityIndicator, Modal, Alert } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import Icon from 'react-native-vector-icons/Ionicons'
import { Rating, AirbnbRating } from 'react-native-ratings'
import { Badge, Chip, Divider, } from 'react-native-paper'
import firestore from '@react-native-firebase/firestore'
import { firebase } from "@react-native-firebase/auth";
import uuid from 'react-native-uuid'
import Pinchable from 'react-native-pinchable';

type caritem = {
    CartUid: string
    ProductId: string
    ProductQty: number
}



const PoductDetail = ({ navigation, route }: { navigation: any, route: any }) => {
    const [cartItemData, setCartItemData] = useState<caritem[]>([]);
    const [productQty, setProductQty] = useState<number>(1);
    const [size, setSize] = useState<number>(20)
    const { ProductName } = route.params
    const { ProductId } = route.params
    const { ProductDiscription } = route.params
    const { ProductImage } = route.params
    const { ProductRating } = route.params
    const { ProductPrice } = route.params
    const { ProductCategory } = route.params
    const { ProductImages } = route.params
    const { DiscountPercentage } = route.params
    const [focus, setFocus] = useState<number>(0)
    const [loading, setLoading] = useState<boolean>(false)
    const [visible, setVisible] = useState(false)

    // console.log('productid', ProductId)
    useEffect(() => {
        if (productQty <= 0) {
            setProductQty(1)
        } else { setProductQty(productQty) }
    })

    // console.log('cartid', cartItemData)


    const addItem = () => {

        const find = cartItemData.find(item => item.ProductId === ProductId)
        // console.log('find', find)
        if (find) {
            setLoading(true)
            console.log('check', find)
            setProductQty(find.ProductQty + 1)
            console.log('qty', productQty)
            firestore().collection('cartItem').doc(find.CartUid).update({
                ProductQty: find.ProductQty + 1,
            }).then(() => {
                getCartItem();
                setLoading(false)
                ToastAndroid.show('Qty Add', ToastAndroid.SHORT)
            }).catch((error) => {
                console.log(error)
                setLoading(false)
            })
        } else {
            setLoading(true)
            const id: any = uuid.v4()
            // console.log(id)
            const user = firebase.auth().currentUser?.uid
            const ProductImg = ProductImages == null ? ProductImage : ProductImages[0]
            const ProductRat = ProductRating.rate == null ? ProductRating : ProductRating.rate
            const ProductDiscounts = DiscountPercentage == undefined ? 15 : DiscountPercentage
            firestore().collection('cartItem').doc(id).set({
                ProductImage: ProductImg,
                ProductPrice: ProductPrice,
                ProductName: ProductName,
                ProductSize: size,
                ProductQty: productQty,
                uid: user,
                CartUid: id,
                ProductCategory: ProductCategory,
                ProductRating: ProductRat,
                ProductDiscription: ProductDiscription,
                ProductDiscount: ProductDiscounts,
                ProductId: ProductId
            }).then(() => {
                getCartItem();
                setLoading(false)
                ToastAndroid.show('Item Added To Cart', ToastAndroid.SHORT)
            }).catch((error) => {
                console.log(error)
                setLoading(false)
            })
        }
    }
    const getCartItem = async () => {
        try {
            const documentSnapShot = await firestore().collection('cartItem').where('uid', '==', firebase.auth().currentUser?.uid).get()
            const data: any = documentSnapShot.docs.map(doc => doc.data())
            // console.log('cartitem', data)
            setCartItemData(data)
        } catch (error) {
            console.log(error)
        }

    }
    useEffect(() => {
        getCartItem();
    }, [])
    const deliveryDay = () => {
        const day = new Date().getDay() + 1
        const date = new Date().getDate() + Math.round(Math.random() * 23)
        const month = new Date().getMonth() + 1
        const Dates = day == 0 ? 'sun' : day == 1 ? 'Mon' : day == 2 ? "Tues" : day == 3 ? "Wed" : day == 4 ? "Thu" : day == 5 ? "Fri" : day == 6 ? "Sat" : day == 7 ? 'sun' : null
        const Months = month == 0 ? 'Jan' : month == 2 ? 'Feb' : month == 3 ? 'Mar' : month == 4 ? 'Apri' : month == 5 ? 'May' : month == 6 ? 'June' : month == 7 ? 'July' : month == 8 ? 'Aug' : month == 9 ? 'Sept' : month == 10 ? 'Oct' : month == 11 ? 'Nov' : month == 12 ? 'Dec' : null
        return (
            <View>
                <Text style={{ color: "black", top: 10, fontWeight: "500" }}> Delivery by  {Dates} / {date} {Months}</Text>
            </View>
        )

    }

    const getPhotos = () => {
        if (ProductImages != null) {
            return (
                <View>
                    <FlatList
                        data={ProductImages}
                        showsHorizontalScrollIndicator={false}
                        horizontal
                        pagingEnabled={true}
                        onScroll={(e) => { setFocus((e.nativeEvent.contentOffset.x / Dimensions.get('screen').width).toFixed(0)) }}
                        // key={Math.round(Math.random() * 10)}
                        renderItem={({ item, index }) => {
                            return (
                                <View>
                                    <Pinchable>
                                        <Image source={{ uri: item }} resizeMode='contain' style={{ width: Dimensions.get('screen').width - 10, height: 200, borderRadius: 20, backgroundColor: 'white', margin: 5 }} />
                                    </Pinchable>
                                </View>

                            )
                        }}
                    />
                    <View style={{ alignContent: 'center', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', bottom: 10, margin: 10 }}>
                        {ProductImages.map((item: any, index: any) => {
                            return (
                                <View style={{ backgroundColor: focus == index ? '#5B66B8' : "#DAD3CF", height: 10, width: 10, borderRadius: 20, margin: 5 }}>

                                </View>
                            )
                        })}
                    </View>
                </View>
            )


        } else {
            return (
                <Pinchable>
                    <Image source={{ uri: ProductImage }} resizeMode='contain' style={{ width: 200, height: 200, borderRadius: 20, left: 80, margin: 10, backgroundColor: 'white' }} />
                </Pinchable>
            )
        }
    }
    console.log('current state of visible', visible)
    return (
        <ScrollView
            onScroll={(event) => {
                if (event.nativeEvent.contentOffset.y >= ((Dimensions.get('screen').height / 50))) {
                    setVisible(true)
                } else { setVisible(false) }
            }}
            onScrollEndDrag={(event) => {
                if (event.nativeEvent.contentOffset.y >= 173) {
                    setVisible(false)
                } else { false }
            }}
        >
            <View style={{ flex: 1, backgroundColor: "white", height: ProductDiscription.length > 700 ? 1300 : 1150 }}>
                <View style={{ flexDirection: "row" }}>
                    <View style={{ backgroundColor: "white", borderRadius: 30, top: 15, left: 15 }}>
                        <Icon name='ios-arrow-back-outline' color='black' size={35} style={{}} onPress={() => navigation.navigate('Home')} />
                    </View>
                    <Icon name='cart' color='#5B66B8' size={35} style={{ top: 15, left: 295 }} onPress={() => navigation.navigate('Shopping')} />
                    <Badge style={{ backgroundColor: "#5B66B8", left: 285, bottom: 10, color: "white", right: 15, }} size={25} visible={cartItemData.length <= 0 ? false : true}> {cartItemData.length}</Badge>
                </View>
                <View style={{ top: 40, }}>
                    {getPhotos()}
                </View>
                <View style={{ backgroundColor: "white", flex: 10, top: 40, borderTopLeftRadius: 50, borderTopRightRadius: 50, borderWidth: 0.5, borderColor: "grey", height: ProductDiscription.length > 200 ? 700 : 650 }}>
                    <View style={{ top: 60, left: 10 }}>
                        <Text> {ProductName.length > 50 ? ProductName.substring(0, 48) + '\n' + ' ' + ProductName.substring(48) : ProductName}</Text>
                        <View style={{ left: 120, top: 10 }}>
                            <AirbnbRating
                                count={5}
                                defaultRating={ProductRating.rate == null ? ProductRating : ProductRating.rate}
                                reviewSize={20}
                                size={15}
                                showRating={false}
                            />
                            <Text style={{ left: 185 }}> {ProductRating.rate == null ? ProductRating : ProductRating.rate}</Text>
                        </View>
                    </View>
                    <View style={{ top: 70, left: 8 }}>
                        <Text style={{ fontSize: 23, color: "red" }}> ${ProductPrice}</Text>
                        {deliveryDay()}
                    </View>
                    <Divider style={{ backgroundColor: "grey", top: 90 }} />
                    {ProductCategory == `men's clothing` || ProductCategory == `women's clothing` || ProductCategory == `womens-dresses` || ProductCategory == `mens-shirts` ? <View style={{ flexDirection: 'row', top: 100 }}>
                        <Text style={{ color: "black", fontSize: 15, top: 5 }}> Available Size : </Text>
                        <View style={{ width: 40, backgroundColor: size == 20 ? '#5B66B8' : "white", borderRadius: 10, height: 30, top: 5, left: 5, borderColor: '#5B66B8', borderWidth: 1 }}>
                            <Text style={{ color: size == 20 ? 'white' : "black", textAlign: "center", top: 4, right: 2 }} onPress={(text) => setSize(20)}> 20 </Text>
                        </View>
                        <View style={{ width: 40, backgroundColor: size == 24 ? '#5B66B8' : "white", borderRadius: 10, height: 30, top: 5, left: 10, borderColor: '#5B66B8', borderWidth: 1 }}>
                            <Text style={{ color: size == 24 ? 'white' : "black", textAlign: "center", top: 4, right: 2 }} onPress={() => setSize(24)}> 24 </Text>
                        </View>
                        <View style={{ width: 40, backgroundColor: size == 26 ? '#5B66B8' : "white", borderRadius: 10, height: 30, top: 5, left: 15, borderColor: '#5B66B8', borderWidth: 1 }}>
                            <Text style={{ color: size == 26 ? 'white' : "black", textAlign: "center", top: 4, right: 2 }} onPress={() => setSize(26)}> 26 </Text>
                        </View>
                        <View style={{ width: 40, backgroundColor: size == 28 ? '#5B66B8' : "white", borderRadius: 10, height: 30, top: 5, left: 20, borderColor: '#5B66B8', borderWidth: 1 }}>
                            <Text style={{ color: size == 28 ? 'white' : "black", textAlign: "center", top: 4, right: 2 }} onPress={() => setSize(28)}> 28 </Text>
                        </View>
                        <View style={{ width: 40, backgroundColor: size == 30 ? '#5B66B8' : "white", borderRadius: 10, height: 30, top: 5, left: 25, borderColor: '#5B66B8', borderWidth: 1 }}>
                            <Text style={{ color: size == 30 ? 'white' : "black", textAlign: "center", top: 4, right: 2 }} onPress={() => setSize(30)}> 30 </Text>
                        </View>
                    </View> : ProductCategory == 'womens-shoes' || ProductCategory == 'mens-shoes' ?
                        <View style={{ flexDirection: 'row', top: 100 }}>
                            <Text style={{ color: "black", fontSize: 15, top: 5 }}> Available Size : </Text>
                            <View style={{ width: 30, backgroundColor: size == 6 ? '#5B66B8' : "white", borderRadius: 10, height: 30, top: 5, left: 5, marginLeft: 10, borderColor: '#5B66B8', borderWidth: 1 }}>
                                <Text style={{ color: size == 6 ? 'white' : "black", top: 4, right: -5 }} onPress={() => setSize(6)}> 6 </Text>
                            </View>
                            <View style={{ width: 30, backgroundColor: size == 8 ? '#5B66B8' : "white", borderRadius: 10, height: 30, top: 5, left: 10, marginLeft: 10, borderColor: '#5B66B8', borderWidth: 1 }}>
                                <Text style={{ color: size == 8 ? 'white' : "black", top: 4, right: -5 }} onPress={() => setSize(8)}> 8 </Text>
                            </View>
                            <View style={{ width: 30, backgroundColor: size == 10 ? '#5B66B8' : "white", borderRadius: 10, height: 30, top: 5, left: 15, marginLeft: 10, borderColor: '#5B66B8', borderWidth: 1 }}>
                                <Text style={{ color: size == 10 ? 'white' : "black", top: 4, right: -2 }} onPress={() => setSize(10)}> 10 </Text>
                            </View>
                            <View style={{ width: 30, backgroundColor: size == 12 ? '#5B66B8' : "white", borderRadius: 10, height: 30, top: 5, left: 20, marginLeft: 10, borderColor: '#5B66B8', borderWidth: 1 }}>
                                <Text style={{ color: size == 12 ? 'white' : "black", top: 4, right: -2 }} onPress={() => setSize(12)}> 12</Text>
                            </View>
                        </View>
                        : null}
                    <View style={{ top: 130, borderBottomWidth: 0.5 }}>
                        <Text style={{ top: -20, left: 10, color: "black", fontWeight: '800' }}> Description</Text>
                        <Text style={{ marginLeft: 10 }}>{ProductDiscription}</Text>
                    </View>

                    <View style={{ top: 150 }}>
                        <Text style={{ textAlign: "center", color: "grey", fontSize: 18 }}> Overall Rating</Text>
                        <Text style={{ color: "black", fontWeight: "bold", fontSize: 18, textAlign: "center", margin: 5 }}> {ProductRating.rate == null ? ProductRating : ProductRating.rate}</Text>

                        <AirbnbRating
                            count={5}
                            defaultRating={ProductRating.rate == null ? ProductRating : ProductRating.rate}
                            reviewSize={25}
                            size={25}
                            showRating={false}
                            reviews={['ok', 'good', 'bad']}
                            reviewColor='pink' />
                        <Text style={{ color: "grey", textAlign: "center", margin: 5 }}> {`Based on ${Math.round(Math.random() * 200)} reviews`}</Text>
                        <View style={{ top: 20 }}>
                            <View style={{ flexDirection: "row" }}>
                                <Text style={{ color: "black", fontSize: 15 }}> Excellent  </Text>
                                <View style={{ width: 250, height: 9, borderRadius: 10, backgroundColor: "#F0F0F1", top: 10, left: 50 }}>
                                    <View style={{ width: ProductRating || ProductRating.rate > 5 ? 200 : 180, height: 9, borderRadius: 10, backgroundColor: "#01B472", }} />
                                </View>

                            </View>
                            <View style={{ flexDirection: "row", marginTop: 10 }}>
                                <Text style={{ color: "black", fontSize: 15 }}> Good  </Text>
                                <View style={{ width: 250, height: 9, borderRadius: 10, backgroundColor: "#F0F0F1", top: 10, left: 76 }}>
                                    <View style={{ width: ProductRating || ProductRating.rate > 4 ? 170 : 150, height: 9, borderRadius: 10, backgroundColor: "#A0D217", }} />
                                </View>

                            </View>
                            <View style={{ flexDirection: "row", marginTop: 10 }}>
                                <Text style={{ color: "black", fontSize: 15 }}> Average  </Text>
                                <View style={{ width: 250, height: 9, borderRadius: 10, backgroundColor: "#F0F0F1", top: 10, left: 56 }}>
                                    <View style={{ width: ProductRating || ProductRating.rate > 3 ? 150 : 130, height: 9, borderRadius: 10, backgroundColor: "#FECB17", }} />
                                </View>

                            </View>
                            <View style={{ flexDirection: "row", marginTop: 10 }}>
                                <Text style={{ color: "black", fontSize: 15 }}> Below Average </Text>
                                <View style={{ width: 250, height: 9, borderRadius: 10, backgroundColor: "#F0F0F1", top: 10, left: 12 }}>
                                    <View style={{ width: ProductRating || ProductRating.rate > 2 ? 130 : 110, height: 9, borderRadius: 10, backgroundColor: "#E79414", }} />
                                </View>

                            </View>
                            <View style={{ flexDirection: "row", marginTop: 10 }}>
                                <Text style={{ color: "black", fontSize: 15 }}> Poor  </Text>
                                <View style={{ width: 250, height: 9, borderRadius: 10, backgroundColor: "#F0F0F1", top: 10, left: 85 }}>
                                    <View style={{ width: ProductRating || ProductRating.rate > 1 ? 150 : 50, height: 9, borderRadius: 10, backgroundColor: "#E63023", }} />
                                </View>

                            </View>
                        </View>

                    </View>
                    {visible ? <View style={{ bottom: ProductDiscription.length > 700 ? 100 : 100 }}>
                        <View style={{ top: 300, backgroundColor: '#5B66B8', width: 268, left: 25, borderRadius: 5 }}>
                            <Text style={{ textAlign: 'center', fontSize: 20, color: "white", margin: 5 }} onPress={() => addItem()}> Add to cart  </Text>
                        </View>
                        <View style={{ top: 265, flexDirection: "row", left: 310, backgroundColor: "#F7F9F9", width: 70, height: 35, borderRadius: 10 }}>
                            <Text style={{ color: "black", left: 10, top: 8 }}> {productQty}</Text>
                            <Icon name='ios-chevron-up' color='black' size={20} style={{ left: productQty?.length > 2 ? 30 : 20 }} onPress={() => setProductQty(productQty + 1)} />
                            <Icon name='ios-chevron-down' color='black' size={20} style={{ left: productQty?.length > 2 ? 10 : 0, top: 18 }} onPress={() => setProductQty(productQty - 1)} />
                        </View>
                    </View>
                        : null}
                </View>

            </View>
            <Modal
                visible={loading}
                transparent={true}
                onRequestClose={() => setLoading(false)}
            >
                <View style={{ width: 150, height: 150, top: 200, left: 120, backgroundColor: "white", borderRadius: 20, shadowColor: "black", shadowOffset: { width: 1, height: 1 }, shadowOpacity: 1, shadowRadius: 1, elevation: 5 }}>
                    <Image source={{ uri: 'https://media.tenor.com/8Bt28MKNs7sAAAAj/shopping-cart-ecomm.gif' }} style={{ width: 95, height: 110, top: 0, left: 15 }} />
                </View>
            </Modal>
        </ScrollView >
    )
}

export default PoductDetail