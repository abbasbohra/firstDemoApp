import { View, Text, FlatList, Image, Dimensions, Pressable, ActivityIndicator, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/Ionicons'
import { AirbnbRating } from 'react-native-ratings'




type product = {
    id: string
    images: string[]
    price: string | null | number
    description: string
    category: string[]
    rating: number
    title: string
    thumbnail: string
    discountPercentage: number
}

type product1 = {
    id: string
    images: string[]
    price: string | null | number
    description: string
    category: string[]
    rating: number
    title: string
    thumbnail: string
    discountPercentage: number
}


const FootwearList = ({ navigation }: { navigation: any }) => {
    const [menProduct, setMensProduct] = useState<product[]>([])
    const [womenProduct, setWomensProduct] = useState<product1[]>([])
    const [allProduct, setAllProduct] = useState<string>('women')
    const [loading, setLoading] = useState<boolean>(false)



    const getData = () => {
        setLoading(true)
        fetch(`https://dummyjson.com/products/category/mens-shoes`)
            .then(res => res.json())
            .then(json => {
                setMensProduct(json.products)
                setLoading(false)
            })
    }
    const getData2 = () => {
        setLoading(true)
        fetch(`https://dummyjson.com/products/category/womens-shoes`)
            .then(res => res.json())
            .then(json => {
                setWomensProduct(json.products)
                setLoading(false)
            })
    }

    useEffect(() => {
        getData();
        getData2();
    }, [])

    // console.log('shows',allProduct)

    return (
        <View style={{ flex: 1, backgroundColor: "white", width: Dimensions.get('screen').width, height: Dimensions.get('screen').height }}>
            <View style={{ flexDirection: 'row' }}>
                <Icon name='ios-arrow-back-outline' color={'black'} size={40} style={{ backgroundColor: "white", borderRadius: 50, top: 10, left: 20, }} onPress={() => navigation.goBack()} />
                <Text style={{ top: 20, left: 50, fontSize: 20, color: "black", fontWeight: '800' }}> Footwear {allProduct}'s  </Text>
                <Icon name='ios-options-outline' color={'black'} size={35} style={{ top: 15, left: allProduct == 'women' ? 100 : 130, }} />
            </View>
            <View style={{ flexDirection: 'row' }}>
                <Pressable onPress={() => setAllProduct('women')} style={{ top: 20, padding: 2, width: 180, }}>
                    <View style={{ backgroundColor: 'white', shadowColor: 'black', shadowOffset: { width: 1, height: 1 }, shadowOpacity: 1, shadowRadius: 1, elevation: 10, left: 10, borderRadius: 8, margin: 5 }}>
                        <Text style={{ color: "black", left: 5, margin: 5 }}> Womens Watches</Text>
                    </View>
                </Pressable>
                <Pressable onPress={() => setAllProduct('Men')} style={{ top: 20, padding: 2, }}>
                    <View style={{ backgroundColor: 'white', width: 150, shadowColor: 'black', shadowOffset: { width: 1, height: 1 }, shadowOpacity: 1, shadowRadius: 1, elevation: 10, left: 10, borderRadius: 8, margin: 5 }}>
                        <Text style={{ color: "black", left: 10, margin: 5 }}> Mens Watches</Text>
                    </View>
                </Pressable>
            </View>

            {allProduct == 'Men' ? <View style={{ flex: 30 }}>
                {loading ? <ActivityIndicator style={{ justifyContent: "center", alignItems: "center", top: 150 }} size={35} color='black' /> : <View style={{ top: 20, }}>
                    <FlatList
                        data={menProduct}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => {
                            return (
                                <View>
                                    <Pressable onPress={() => navigation.navigate('ProductDetail', { ProductName: item.title, ProductDiscription: item.description, ProductImages: item.images, ProductRating: item.rating, ProductPrice: item.price, ProductCategory: item.category, DiscountPercentage: item.discountPercentage,ProductId:item.id })}>

                                        <View style={{ backgroundColor: "white", height: 130, width: Dimensions.get('window').width, alignItems: "center", flexDirection: 'row', marginTop: 10, shadowColor: "black", shadowOffset: { width: 100, height: 100 }, shadowRadius: 5, shadowOpacity: 1, elevation: 5 }}>
                                            <Image source={{ uri: item.thumbnail }} resizeMode='contain' style={{ width: 100, height: 100, top: -10, marginLeft: 10 }} />
                                            <Text style={{ color: "black", fontWeight: '600', fontSize: 15, bottom: 40, textAlign: "center" }}>  {item.title.length > 30 ? item.title.substring(0, 30) + '...' : item.title}</Text>
                                        </View>
                                        <Icon name='heart-outline' color='black' size={20} style={{ position: "absolute", top: 15, left: 350 }} />
                                        <View style={{ position: "absolute", top: 70, left: 115, margin: 5 }}>
                                            <AirbnbRating

                                                count={5}
                                                defaultRating={item.rating}
                                                reviewSize={20}
                                                size={15}
                                                showRating={false}
                                                selectedColor='green'
                                            />
                                        </View>
                                        <View style={{ bottom: 60, right: 50 }}>
                                            <Text style={{ right: -150, marginLeft: 10, bottom: 30 }}>  {item.description.length > 30 ? item.description.substring(0, 30) + '...' : item.description}</Text>
                                            <Text style={{ color: "green", textAlign: 'center', bottom: 10 }}> ${item.price}</Text>
                                        </View>
                                    </Pressable>

                                </View>
                            )
                        }}
                    />
                </View>}
            </View> : <View style={{ flex: 30 }}>
                {loading ? <ActivityIndicator style={{ justifyContent: "center", alignItems: "center", top: 150 }} size={35} color='black' /> : <View style={{ top: 30, }}>
                    <FlatList
                        data={womenProduct}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => {
                            return (
                                <View>
                                    <Pressable onPress={() => navigation.navigate('ProductDetail', { ProductName: item.title, ProductDiscription: item.description, ProductImages: item.images, ProductRating: item.rating, ProductPrice: item.price, ProductCategory: item.category, DiscountPercentage: item.discountPercentage ,ProductId:item.id})}>

                                        <View style={{ backgroundColor: "white", height: 130, width: Dimensions.get('window').width, alignItems: "center", flexDirection: 'row', marginTop: 10, shadowColor: "black", shadowOffset: { width: 100, height: 100 }, shadowRadius: 5, shadowOpacity: 1, elevation: 10 }}>
                                            <Image source={{ uri: item.thumbnail }} resizeMode='contain' style={{ width: 100, height: 100, top: -10, marginLeft: 10 }} />
                                            <Text style={{ color: "black", fontWeight: '600', fontSize: 15, bottom: 40, textAlign: "center" }}>  {item.title.length > 30 ? item.title.substring(0, 30) + '...' : item.title}</Text>
                                        </View>
                                        <Icon name='heart-outline' color='black' size={20} style={{ position: "absolute", top: 15, left: 350 }} />

                                        <View style={{ bottom: 60, right: 50 }}>
                                            <Text style={{ right: -150, marginLeft: 10, bottom: 30 }}>  {item.description.length > 30 ? item.description.substring(0, 30) + '...' : item.description}</Text>
                                            <Text style={{ color: "green", textAlign: 'center', bottom: 0 }}> ${item.price}</Text>
                                            <View style={{ bottom: 40, left: 20, marginLeft: 10, }}>
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

                                </View>
                            )
                        }}
                    />
                </View>}
            </View>}
            <View style={{ flex: 2.7 }} />
        </View>
    )
}

export default FootwearList