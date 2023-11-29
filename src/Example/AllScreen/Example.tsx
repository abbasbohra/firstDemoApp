import { View, Text, FlatList, Image, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { AirbnbRating } from 'react-native-ratings'
import Icon from 'react-native-vector-icons/Ionicons'

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




const Example = ({ navigation }: { navigation: any }) => {
    const [products, setProducts] = useState<products[]>([]);
    const [loading, setLoading] = useState(false)



    const getApiData = async () => {
        setLoading(true)
        try {
            await axios.post('https://fashion-leo.servepratham.com/api/v2/user/category/product').then(response => {
                // console.log('res', response.data.data.products.data)
                const data = response.data.data.products.data
                setProducts(data)
            }).then(() => {
                setLoading(false)
            })
        } catch (error: any) {
            if (error.AxiosError === 'Network Error') {
                Alert.alert('Network Down')
                console.log('error true')
            }
            console.log(error)
        }
    }
    useEffect(() => {
        getApiData()
        getByProducts();
    }, [])
    console.log(loading)

    const getByProducts = async () => {
        try {
            await axios.post('https://fashion-admin.servepratham.com/api/v2/user/category/product').then(respone => {
                // console.log('get by Products', respone.data.data)
            })
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: "white" }}>
            <FlatList
                style={{ top: 20 }}
                data={products}
                keyExtractor={(item: any) => item.id}
                renderItem={({ item, index }) => {
                    return (
                        <View style={{ margin: 5 }}>
                            <Icon name='ios-heart-outline' style={{ position: "absolute", left: 350, top: 5 }} size={20} />
                            <Image source={{ uri: item.ImageSrc }} resizeMode='contain' style={{ width: 100, height: 110 }} />
                            {/* <TouchableOpacity onPress={() => navigation.navigate('ExampleDetail', { id: item.id })}> */}
                            <TouchableOpacity style={{ position: "absolute", left: 100, top: 10 }} onPress={() => navigation.navigate('ExampleDetail', { id: item.id })}>
                                <Text style={{ color: "black" }}> {item.product_name}</Text>
                                <Text style={{ color: "black", fontSize: 12, left: 1 }}> {item.short_desc}</Text>
                                <View style={{ flexDirection: "row", right: 15, bottom: 23 }}>
                                    <Text style={{ color: "grey", left: 20, top: 30 }}> {item.price}</Text>
                                    <Text style={{ color: "green", left: 10, top: 30, marginLeft: 20 }}> {item.offer_price}</Text>
                                    <Text style={{ color: "green", left: 20, top: 30 }}> {item.discounts}% Discount Applied</Text>
                                </View>
                                <View style={{ borderBottomWidth: 0.5, borderColor: "black", width: 40, top: -2, left: 5 }} />
                                <View style={{ position: "absolute", bottom: -30 }}>
                                    <AirbnbRating
                                        count={5}
                                        defaultRating={item.rating == 0 ? 1 : item.rating}
                                        size={15}
                                        showRating={false}
                                        selectedColor='green'
                                    />
                                </View>

                            </TouchableOpacity>
                            {/* </TouchableOpacity> */}

                        </View>
                    )
                }}
            />
        </View>
    )
}

export default Example