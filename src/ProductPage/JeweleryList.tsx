import { View, Text, FlatList, Image, Dimensions, Pressable, ActivityIndicator, TouchableOpacity } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import Icon from 'react-native-vector-icons/Ionicons'
import { Rating, AirbnbRating } from 'react-native-ratings'
import { Searchbar } from 'react-native-paper'





type product = {
    id: string
    images: string[]
    price: string | null | number
    description: string
    category: string[]
    rating: number[]
    title: string
    image: string
    thumbnail: string
    discountPercentage: number

}




const ElectronicList = ({ navigation }: { navigation: any }) => {
    const [allProduct, setAllProduct] = useState<product[]>([])
    const [product1, setProduct1] = useState<product[]>([])
    const [product2, setProduct2] = useState<product[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [onEnd, setOnEnd] = useState<boolean>(product1.length > 5 ? false : true)
    const [showMore, setShowMore] = useState<boolean>(false)
    const [search, setSearch] = useState<string>('')
    const searhRef = useRef<any>();

    const getData = () => {
        setLoading(true)
        fetch('https://fakestoreapi.com/products/category/jewelery')
            .then(res => res.json())
            .then(json => {
                setProduct1(json)
                console.log(allProduct)
                setLoading(false)
            })
    }
    const getData1 = () => {
        setLoading(true)
        fetch('https://dummyjson.com/products/category/womens-jewellery')
            .then(res => res.json())
            .then(json => {
                setProduct2(json.products)
                console.log(json.products)
                setLoading(false)
            })
    }

    useEffect(() => {
        getData();
        getData1();
    }, [])

    const onPressMore = () => {
        setOnEnd(false)
        setShowMore(true)
        setAllProduct(product1.concat(product2))
    }
    const onSearch = () => {
        const find = allProduct.filter((item) =>
            item.title.match(search)
        )
        setAllProduct(find)
        console.log(find)
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

    return (
        <View style={{ flex: 1, backgroundColor: "white", width: Dimensions.get('screen').width, height: Dimensions.get('screen').height }}>
            <View style={{ flexDirection: 'row' }}>
                <Icon name='ios-arrow-back-outline' color={'black'} size={40} style={{ backgroundColor: "white", borderRadius: 50, top: 10, left: 20, }} onPress={() => navigation.goBack()} />
                <Text style={{ top: 20, left: 50, fontSize: 20, color: "black", fontWeight: '800' }}> jewelery Product </Text>
                <Icon name='ios-options-outline' color={'black'} size={35} style={{ top: 15, left: 100, }} />
            </View>
            <View>
                <Searchbar ref={searhRef} style={{ top: 20, backgroundColor: "#F2F3F4", borderRadius: 5, width: 360, left: 15 }} placeholder='search here' icon={() => <Icon name='ios-search-outline' color={'black'} size={25} style={{ top: 0 }} />} value={search} onChangeText={(setSearch)} onChange={() => onSearch()} onIconPress={() => onSearch()} clearIcon={() => <Icon name='ios-close' color='black' size={35} style={{}} onPress={() => { searhRef.current.clear(), setAllProduct(product1.concat(product2)) }} />} clearButtonMode='always' />
            </View>
            {showMore ?
                <View style={{ top: 30, flex: 30 }}>
                    {loading ? <ActivityIndicator style={{ justifyContent: "center", alignItems: "center", top: 150 }} size={35} color='black' /> :
                        <View>
                            {allProduct.length <= 0 ?
                                nothingShow()
                                : <FlatList
                                    data={allProduct}
                                    keyExtractor={item => item.id}
                                    renderItem={({ item }) => {
                                        return (
                                            <View>
                                                <Pressable onPress={() => navigation.navigate('ProductDetail', { ProductName: item.title, ProductDiscription: item.description, ProductImage: item.image, ProductRating: item.rating, ProductPrice: item.price, ProductCategory: item.category, ProductImages: item.images, DiscountPercentage: item.discountPercentage, ProductId: item.id })}>

                                                    <View style={{ backgroundColor: "white", height: 130, width: Dimensions.get('window').width, alignItems: "center", flexDirection: 'row', marginTop: 10, shadowColor: "black", shadowOffset: { width: 100, height: 100 }, shadowRadius: 5, shadowOpacity: 1, elevation: 10 }}>
                                                        {item.image == null ? <Image source={{ uri: item.thumbnail }} resizeMode='contain' style={{ width: 100, height: 100, top: 5, marginLeft: 10 }} /> : <Image source={{ uri: item.image }} resizeMode='contain' style={{ width: 100, height: 100, top: 5, marginLeft: 10 }} />}
                                                        <Text style={{ color: "black", fontWeight: '600', fontSize: 15, bottom: 20, textAlign: "center" }}>  {item.title.length > 30 ? item.title.substring(0, 30) + '...' : item.title}</Text>
                                                    </View>
                                                    <View style={{ position: "absolute", top: 85, left: 115, margin: 5 }}>
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
                                                        <Text style={{ left: 145, marginLeft: 10, bottom: 30 }}>  {item.description.length > 30 ? item.description.substring(0, 30) + '...' : item.description}</Text>
                                                        <Text style={{ color: "green", textAlign: 'center', }}> ${item.price}</Text>
                                                    </View>
                                                </Pressable>

                                            </View>
                                        )
                                    }}
                                />}
                        </View>
                    }
                </View> : <View style={{ top: 20, flex: 30 }}>
                    {loading ? <ActivityIndicator style={{ justifyContent: "center", alignItems: "center", top: 150 }} size={35} color='black' /> :

                        <FlatList
                            data={product1}
                            onEndReached={() => setOnEnd(true)}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => {
                                return (
                                    <View>
                                        <Pressable onPress={() => navigation.navigate('ProductDetail', { ProductName: item.title, ProductDiscription: item.description, ProductImage: item.image, ProductRating: item.rating, ProductPrice: item.price, ProductCategory: item.category, ProductId: item.id })}>

                                            <View style={{ backgroundColor: "white", height: 130, width: Dimensions.get('window').width, alignItems: "center", flexDirection: 'row', marginTop: 10, shadowColor: "black", shadowOffset: { width: 100, height: 100 }, shadowRadius: 5, shadowOpacity: 1, elevation: 10 }}>
                                                <Image source={{ uri: item.image }} resizeMode='contain' style={{ width: 100, height: 100, top: 5, marginLeft: 10 }} />
                                                <Text style={{ color: "black", fontWeight: '600', fontSize: 15, bottom: 20, textAlign: "center" }}>  {item.title.length > 30 ? item.title.substring(0, 30) + '...' : item.title}</Text>
                                            </View>
                                            <View style={{ position: "absolute", top: 85, left: 115, margin: 5 }}>
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
                                                <Text style={{ left: 145, marginLeft: 10, bottom: 30 }}>  {item.description.length > 30 ? item.description.substring(0, 30) + '...' : item.description}</Text>
                                                <Text style={{ color: "green", textAlign: 'center', }}> ${item.price}</Text>
                                            </View>
                                        </Pressable>

                                    </View>
                                )
                            }}
                        />
                    }
                </View>}
            {onEnd ? <View style={{ flex: 3, backgroundColor: "white", justifyContent: 'center', alignContent: "center", alignItems: "center", flexDirection: "row" }}>
                <TouchableOpacity onPress={() => onPressMore()} style={{ flexDirection: "row" }}>
                    <Icon name='ios-refresh-outline' color='black' size={35} style={{}} />
                    <Text style={{ color: "black", fontSize: 15, top: 7 }}> Load More </Text>
                </TouchableOpacity>

            </View> : null}
        </View>
    )
}

export default ElectronicList