import { View, Text, FlatList, Image, Dimensions, Pressable, ActivityIndicator, TouchableOpacity } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import Icon from 'react-native-vector-icons/Ionicons'
import RBSheet from 'react-native-raw-bottom-sheet'
import { Divider } from 'react-native-paper'
import { AirbnbRating } from 'react-native-ratings'
import firestore from '@react-native-firebase/firestore'
import { firebase } from '@react-native-firebase/auth'
import uuid from 'react-native-uuid'

type allproduct = {
    id: string
    images: string[]
    price: string | null | number
    description: string
    category: string[]
    rating: number
    title: string
    brand: string
    thumbnail: string
    discountPercentage: number


}






const SmartphoneList = ({ navigation }: { navigation: any }) => {
    const [allProduct, setAllProduct] = useState<allproduct[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [selectBrand, setSelectBrand] = useState<string>('');
    // const [search, setSearch] = useState();
    const filterSheet = useRef<any>();
    const getData = () => {
        setLoading(true)
        fetch(`https://dummyjson.com/products/category/smartphones`)
            .then(res => res.json())
            .then(json => {
                setAllProduct(json.products)
                // console.log(allProduct)
                setLoading(false)
            })
    }

    const getData1 = () => {
        setLoading(true)
        fetch(`https://dummyjson.com/products/categories`)
            .then(res => res.json())
            .then(json => {
                console.log(json)
                setLoading(false)
            })
    }

    useEffect(() => {
        getData();
        getData1()
    }, [])

    // console.log('shows',allProduct)
    const onSearch = ({ brand }: { brand: string }) => {
        setSelectBrand(brand)
        // getData()
        const find = allProduct.filter((elem) =>
            elem.brand == brand
        )
        setAllProduct(find)
        console.log(find, brand)
        console.log('brand', find)
        filterSheet.current.close();
    }
    const nothingShow = () => {
        return (
            <View style={{ height: 200 }}>
                <Image source={{ uri: 'https://media.tenor.com/a4SaQmo5EesAAAAj/iranserver-bluebot.gif' }} style={{ width: 100, height: 120, position: "absolute", top: 50, left: 120 }} />
                <Text style={{ color: "black", textAlign: "center", top: 200, fontWeight: "700" }}> Sorry,Nothing Found </Text>
                <Text style={{ color: "grey", textAlign: "center", top: 200 }}> Check Spelling And Try Again </Text>
            </View>

        )
    }



    const saveToWishlist = ({ items }: { items: any }) => {
        console.log('productid', items.title)
        const id: any = uuid.v4()
        firestore().collection('WishList').doc(id).set({
            ProductName: items.title,
            ProductDiscription: items.description,
            ProductImages: items.images,
            ProductThumbnail: items.thumbnail,
            ProductPrice: items.price,
            uid: firebase.auth().currentUser?.uid,
            CartUid: id,
            ProductCategory: items.category,
            ProductRating: items.rating,
            ProductDiscount: items.discountPercentage,
            ProductId: items.id
        }).then(() => {
            console.log('save to wishlist')
        })
    }
    return (
        <View style={{ flex: 1, backgroundColor: "white", width: Dimensions.get('screen').width, height: Dimensions.get('screen').height }}>
            <View style={{ flexDirection: 'row' }}>
                <Icon name='ios-arrow-back-outline' color={'black'} size={40} style={{ backgroundColor: "white", borderRadius: 50, top: 10, left: 20, }} onPress={() => navigation.goBack()} />
                <Text style={{ top: 20, left: 50, fontSize: 20, color: "black", fontWeight: '800' }}> SmartPhone </Text>
                <Icon name='ios-options-outline' color={'black'} size={35} style={{ top: 15, left: 170, }} onPress={() => { getData(), filterSheet.current.open() }} />
            </View>
            {loading ? <ActivityIndicator style={{ justifyContent: "center", alignItems: "center", top: 150 }} size={35} color='black' /> : <View style={{ top: 70, flex: 30 }}>
                {allProduct.length <= 0 ?
                    nothingShow()
                    : <FlatList
                        data={allProduct}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => {
                            return (
                                <View>
                                    <Pressable onPress={() => navigation.navigate('ProductDetail', { ProductName: item.title, ProductDiscription: item.description, ProductImages: item.images, ProductRating: item.rating, ProductPrice: item.price, ProductCategory: item.category, DiscountPercentage: item.discountPercentage, ProductId: item.id })}>

                                        <View style={{ backgroundColor: "white", height: 130, width: Dimensions.get('window').width, alignItems: "center", flexDirection: 'row', marginTop: 10, shadowColor: "black", shadowOffset: { width: 100, height: 100 }, shadowRadius: 5, shadowOpacity: 1, elevation: 10 }}>
                                            <Image source={{ uri: item.thumbnail }} resizeMode='contain' style={{ width: 100, height: 100, top: -15, marginLeft: 10 }} />
                                            <Text style={{ color: "black", fontWeight: '600', fontSize: 15, bottom: 35, textAlign: "center", paddingLeft: 10 }}>  {item.title.length > 30 ? item.title.substring(0, 30) + '...' : item.title}</Text>
                                        </View>
                                        <View style={{ bottom: 60, right: 50, paddingLeft: 5 }}>
                                            <Text style={{ right: -150, marginLeft: 10, bottom: 30 }}>  {item.description.length > 30 ? item.description.substring(0, 30) + '...' : item.description}</Text>
                                            <Text style={{ color: "green", textAlign: 'center', bottom: 0 }}> ${item.price}</Text>
                                            <View style={{ bottom: 50, left: 20, marginLeft: 10, }}>
                                                <AirbnbRating

                                                    count={5}
                                                    defaultRating={item.rating}
                                                    reviewSize={20}
                                                    size={15}
                                                    showRating={false}
                                                    selectedColor='green'
                                                />
                                            </View>
                                        </View>
                                    </Pressable>
                                    <Icon name='heart-outline' color='black' size={20} style={{ position: "absolute", bottom: 140, left: 350 }} onPress={() => saveToWishlist({ items: item })} />

                                </View>
                            )
                        }}
                    />}
            </View>}
            <View style={{ flex: 2.7 }} />
            <RBSheet
                height={Dimensions.get('screen').height}
                keyboardAvoidingViewEnabled
                ref={filterSheet}
            >
                <View style={{ flex: 1, backgroundColor: "white" }}>
                    <View style={{ flexDirection: "row" }}>
                        <View style={{ backgroundColor: "white", margin: 13, borderRadius: 50, height: 40, width: 40, shadowColor: "black", shadowOffset: { width: 1, height: 1 }, shadowOpacity: 1, shadowRadius: 1, elevation: 5 }}>
                            <Icon name='arrow-back-outline' color='black' size={35} style={{ padding: 5, bottom: 3, right: 2.5 }} onPress={() => filterSheet.current.close()} />
                        </View>
                        <Text style={{ color: "black", textAlign: "center", fontSize: 20, top: 18, left: 10, fontWeight: '700' }}> Filter </Text>
                        <Text style={{ top: 20, fontSize: 18, left: 140, color: "#9FA3D3" }} onPress={() => (getData(), filterSheet.current.close())}> Clear all </Text>
                    </View>
                    <Divider style={{ backgroundColor: "black" }} />
                    <View style={{ top: 20, left: 20 }}>

                        <Text style={{ color: "black", fontWeight: '700', fontSize: 18 }}> Brands:</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <View>
                                <TouchableOpacity style={{ flexDirection: "row", backgroundColor: 'white', margin: 10, shadowColor: "black", shadowOffset: { width: 1, height: 1 }, shadowOpacity: 1, shadowRadius: 1, elevation: 3, borderRadius: 5, borderColor: selectBrand === 'Samsung' ? '#BFC2E3' : 'white', borderWidth: selectBrand == 'Samsung' ? 1.8 : 0 }} onPress={() => { onSearch({ brand: 'Samsung' }) }}>
                                    <Icon name={selectBrand == 'Samsung' ? 'checkmark-circle' : 'radio-button-off'} color={selectBrand == 'Samsung' ? '#545EB5' : 'black'} size={18} style={{ margin: 5 }} />
                                    <Text style={{ color: "black", margin: 5, right: 3 }}> Samsung </Text>
                                </TouchableOpacity>
                            </View>
                            <View>
                                <TouchableOpacity style={{ flexDirection: "row", backgroundColor: 'white', margin: 10, shadowColor: "black", shadowOffset: { width: 1, height: 1 }, shadowOpacity: 1, shadowRadius: 1, elevation: 3, borderRadius: 5, borderColor: selectBrand === 'Apple' ? '#BFC2E3' : 'white', borderWidth: selectBrand == 'Apple' ? 1.8 : 0 }} onPress={() => { onSearch({ brand: 'Apple' }) }}>
                                    <Icon name={selectBrand == 'Apple' ? 'checkmark-circle' : 'radio-button-off'} color={selectBrand == 'Apple' ? '#545EB5' : 'black'} size={18} style={{ margin: 5 }} />
                                    <Text style={{ color: "black", margin: 5, right: 3 }}> Iphone </Text>
                                </TouchableOpacity>
                            </View>
                            <View>
                                <TouchableOpacity style={{ flexDirection: "row", backgroundColor: 'white', margin: 10, shadowColor: "black", shadowOffset: { width: 1, height: 1 }, shadowOpacity: 1, shadowRadius: 1, elevation: 3, borderRadius: 5, borderColor: selectBrand === 'OPPO' ? '#BFC2E3' : 'white', borderWidth: selectBrand == 'OPPO' ? 1.8 : 0 }} onPress={() => { onSearch({ brand: 'OPPO' }) }}>
                                    <Icon name={selectBrand == 'OPPO' ? 'checkmark-circle' : 'radio-button-off'} color={selectBrand == 'OPPO' ? '#545EB5' : 'black'} size={18} style={{ margin: 5 }} />
                                    <Text style={{ color: "black", margin: 5, right: 3 }}> Oppo </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity style={{ flexDirection: "row", backgroundColor: 'white', margin: 10, shadowColor: "black", shadowOffset: { width: 1, height: 1 }, shadowOpacity: 1, shadowRadius: 1, elevation: 3, borderRadius: 5, borderColor: selectBrand === 'Huawei' ? '#BFC2E3' : 'white', borderWidth: selectBrand == 'Huawei' ? 1.8 : 0 }} onPress={() => { onSearch({ brand: 'Huawei' }) }}>
                                <Icon name={selectBrand == 'Huawei' ? 'checkmark-circle' : 'radio-button-off'} color={selectBrand == 'Huawei' ? '#545EB5' : 'black'} size={18} style={{ margin: 5 }} />
                                <Text style={{ color: "black", margin: 5, right: 3 }}> Huawei </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </RBSheet>
        </View>
    )
}

export default SmartphoneList;