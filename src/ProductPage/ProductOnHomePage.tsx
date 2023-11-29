import { View, Text, FlatList, Image, Dimensions, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/Ionicons'
import { ActivityIndicator } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import { Rating, AirbnbRating } from 'react-native-ratings'





type product = {
    id: string
    images: string[]
    image: string
    price: string | null | number
    description: string
    category: string
    rating: number
    title: string
    rate: number
    thumbnail: string
    discountPercentage: number
}

type data1 = {
    id: string
    images: string[]
    price: string | null | number
    description: string
    category: string
    rating: number
    title: string
    image: string
    discountPercentage: number

}

const ProductOnHomePage = ({ refresh, data, searchTrue }: { refresh: boolean, data: [], searchTrue: boolean }) => {
    const [allProduct, setAllProduct] = useState<product[]>([])
    const navigation = useNavigation();

    const getData = () => {
        fetch(`https://dummyjson.com/products/category/skincare`)
            .then(res => res.json())
            .then(json => {
                setAllProduct(json.products)
            })
    }
    useEffect(() => {
        getData();

    }, [refresh])

    const nothingShow = () => {
        return (
            <View style={{ height: 200 }}>
                <Image source={{ uri: 'https://media.tenor.com/a4SaQmo5EesAAAAj/iranserver-bluebot.gif' }} style={{ width: 100, height: 120, position: "absolute", top: 50, left: 120 }} />
                <Text style={{ color: "black", textAlign: "center", top: 200, fontWeight: "700" }}> Sorry,Nothing Found </Text>
                <Text style={{ color: "grey", textAlign: "center", top: 200 }}> Check Spelling And Try Again </Text>
            </View>

        )
    }

    return (
        <View style={{ flex: 1, backgroundColor: "white", width: Dimensions.get('screen').width, }}>
            {searchTrue ? <View style={{ top: 0, }}>
                {data.length <= 0 ? nothingShow()
                    : <View>
                        <FlatList
                            data={data as data1[]}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => {
                                return (
                                    <View>

                                        <Pressable onPress={() => navigation.navigate('ProductDetail', { ProductName: item.title, ProductDiscription: item.description, ProductImage: item.image, ProductRating: item.rating, ProductPrice: item.price, ProductCategory: item.category, DiscountPercentage: item.discountPercentage, ProductId: item.id })}>
                                            <View style={{ backgroundColor: "white", height: 115, width: Dimensions.get('window').width, alignItems: "center", flexDirection: 'row', marginTop: 5, borderRadius: 15, shadowColor: "black", }}>
                                                <Image source={{ uri: item.image }} resizeMode='contain' style={{ width: 100, height: 100, top: 5, marginLeft: 10 }} />
                                                <Text style={{ color: "black", fontWeight: '600', fontSize: 15, bottom: 20, textAlign: "center" }}>  {item.title.length > 30 ? item.title.substring(0, 30) + '...' : item.title}</Text>
                                            </View>
                                            <View style={{ position: "absolute", top: 70, left: 115, margin: 5 }}>
                                                <AirbnbRating
                                                    count={5}
                                                    defaultRating={item.rating.rate}
                                                    reviewSize={20}
                                                    size={15}
                                                    showRating={false}
                                                    selectedColor='green'
                                                />
                                            </View>
                                            <View style={{ bottom: 40, right: 50 }}>
                                                <Text style={{ right: -150, marginLeft: 10, bottom: 30 }}>  {item.description.length > 30 ? item.description.substring(0, 30) + '...' : item.description}</Text>
                                                <Text style={{ color: "green", textAlign: 'center', bottom: 10 }}> ${item.price ? item.price : ""}</Text>
                                            </View>
                                        </Pressable>

                                    </View>
                                )
                            }}
                        />
                    </View>}
            </View>
                :
                <View style={{ top: 0, }}>
                    <FlatList
                        data={allProduct}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => {
                            return (
                                <View>

                                    <Pressable onPress={() => navigation.navigate('ProductDetail', { ProductName: item.title, ProductDiscription: item.description, ProductImages: item.images, ProductRating: item.rating, ProductPrice: item.price, ProductCategory: item.category, DiscountPercentage: item.discountPercentage, ProductId: item.id })}>
                                        <View style={{ backgroundColor: "white", height: 130, width: Dimensions.get('window').width, alignItems: "center", flexDirection: 'row', marginTop: 5, borderRadius: 15, shadowColor: "black", }}>
                                            <Image source={{ uri: item.thumbnail }} resizeMode='contain' style={{ width: 100, height: 100, top: 5, marginLeft: 10 }} />
                                            <Text style={{ color: "black", fontWeight: '600', fontSize: 15, bottom: 35, textAlign: "center" }}>  {item.title.length > 30 ? item.title.substring(0, 30) + '...' : item.title}</Text>
                                            <View style={{ position: "absolute", top: 65, left: 115, margin: 5 }}>
                                                <AirbnbRating
                                                    count={5}
                                                    defaultRating={item.rating.rate}
                                                    reviewSize={20}
                                                    size={15}
                                                    showRating={false}
                                                    selectedColor='green'
                                                />
                                            </View>

                                        </View>
                                        <View style={{ bottom: 40, right: 50 }}>
                                            <Text style={{ right: -150, marginLeft: 10, bottom: 45 }}>  {item.description.length > 30 ? item.description.substring(0, 30) + '...' : item.description}</Text>
                                            <Text style={{ color: "green", textAlign: 'center', bottom: 10 }}> ${item.price}</Text>
                                        </View>
                                    </Pressable>

                                </View>
                            )
                        }}
                    />
                </View>
            }
            <View style={{ flex: 10 }} />
        </View>
    )
}

export default ProductOnHomePage;