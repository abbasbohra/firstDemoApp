import { View, Text, FlatList, Image, Dimensions, Pressable, ActivityIndicator, RefreshControl } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import Icon from 'react-native-vector-icons/Ionicons'
import { useIsFocused } from '@react-navigation/native'
import { Rating, AirbnbRating } from 'react-native-ratings'
import { Searchbar } from 'react-native-paper'


type product = {
    id: string
    images: string[]
    image: string[]
    price: number
    description: string
    category: string[]
    rating: number
    title: string
    thumbnail: string
    discountPercentage: number

}






const WomensclothList = ({ navigation }: { navigation: any }) => {
    const [allProduct, setAllProduct] = useState<product[]>([])
    const [womenDress, setWomenDress] = useState<product[]>([])
    const [mixAllProduct, setMixAllProduct] = useState<product[]>([]);
    const [loading, setLoading] = useState<boolean>(false)
    const [refreshing, setRefreshing] = useState<boolean>(false)
    const IsFocused = useIsFocused();
    const [search, setSearch] = useState<string>('')
    const [onEnd, setOnEnd] = useState<boolean>(false);
    const [showMore, setShowMore] = useState<boolean>(false)
    const searhRef = useRef<any>();

    console.log(loading)



    const getData = () => {
        setLoading(true)
        fetch(`https://fakestoreapi.com/products/category/women's clothing`)
            .then(res => res.json())
            .then(json => {
                console.log('product', json)
                setAllProduct(json)
                setLoading(false)
            })
    }
    const getData2 = () => {
        setLoading(true)
        fetch(`https://dummyjson.com/products/category/womens-dresses`)
            .then(res => res.json())
            .then(json => {
                setWomenDress(json.products)
                console.log(json.products)
                setLoading(false)
            })
    }

    useEffect(() => {
        getData();
        getData2();
    }, [IsFocused])

    const onPressMore = () => {
        setOnEnd(false)
        setShowMore(true)
        setMixAllProduct(allProduct.concat(womenDress))
        // setTimeout(() => {
        //     setOnEnd(false)
        // }, 5000)
    }




    const onSearch = () => {
        const find = mixAllProduct.filter((item) =>
            item.title.match(search)
        )
        setMixAllProduct(find)
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
                <Text style={{ top: 20, left: 50, fontSize: 20, color: "black", fontWeight: '800' }}> Women's cloths </Text>
                <Icon name='ios-options-outline' color={'black'} size={35} style={{ top: 15, left: 130, }} />
            </View>
            <View>
                <Searchbar ref={searhRef} style={{ top: 30, backgroundColor: "#F2F3F4", borderRadius: 5, width: 360, left: 15 }} placeholder='search here' icon={() => <Icon name='ios-search-outline' color={'black'} size={25} style={{ top: 0 }} />} value={search} onChangeText={(setSearch)} onChange={() => onSearch()} onIconPress={() => onSearch()} clearIcon={() => <Icon name='ios-close' color='black' size={35} style={{}} onPress={() => { searhRef.current.clear(), setMixAllProduct(allProduct.concat(womenDress)) }} />} clearButtonMode='always' />
            </View>
            {showMore ?
                <View style={{ flex: 25, top: 20 }}>
                    {loading ? <ActivityIndicator style={{ justifyContent: "center", alignItems: "center", top: 150 }} size={35} color='black' /> :
                        <View style={{ top: 10 }}>
                            {mixAllProduct.length <= 0 ?
                                nothingShow()
                                : <FlatList
                                    data={mixAllProduct}
                                    keyExtractor={item => item.id}
                                    renderItem={({ item }) => {
                                        return (
                                            <View>
                                                <Pressable onPress={() => navigation.navigate('ProductDetail', { ProductName: item.title, ProductDiscription: item.description, ProductImage: item.image, ProductRating: item.rating, ProductPrice: item.price, ProductCategory: item.category, ProductImages: item.images, DiscountPercentage: item.discountPercentage, ProductId: item.id })}>

                                                    <View style={{ backgroundColor: "white", height: 130, width: Dimensions.get('window').width, alignItems: "center", flexDirection: 'row', marginTop: 10, shadowColor: "black", shadowOffset: { width: 100, height: 100 }, shadowRadius: 5, shadowOpacity: 1, elevation: 5 }}>
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
                                                        <Text style={{ right: -150, marginLeft: 10, bottom: 30 }}>  {item.description.length > 30 ? item.description.substring(0, 30) + '...' : item.description}</Text>
                                                        <Text style={{ color: "green", textAlign: 'center', bottom: 10 }}> ${item.price}</Text>
                                                    </View>
                                                </Pressable>

                                            </View>
                                        )
                                    }}
                                />}
                        </View>}
                </View> : <View style={{ flex: 25 }}>
                    {loading ? <ActivityIndicator style={{ justifyContent: "center", alignItems: "center", top: 150 }} size={35} color='black' /> : <View style={{ top: 10, }}>
                        <FlatList
                            data={allProduct}
                            onEndReached={() => setOnEnd(true)}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => {
                                return (
                                    <View>
                                        <Pressable onPress={() => navigation.navigate('ProductDetail', { ProductName: item.title, ProductDiscription: item.description, ProductImage: item.image, ProductRating: item.rating, ProductPrice: item.price, ProductCategory: item.category, ProductImages: item.images, DiscountPercentage: item.discountPercentage, ProductId: item.id })}>

                                            <View style={{ backgroundColor: "white", height: 130, width: Dimensions.get('window').width, alignItems: "center", flexDirection: 'row', marginTop: 10, shadowColor: "black", shadowOffset: { width: 100, height: 100 }, shadowRadius: 5, shadowOpacity: 1, elevation: 5 }}>
                                                {item.image == null ? <Image source={{ uri: item.images[0] }} resizeMode='contain' style={{ width: 100, height: 100, top: 5, marginLeft: 10 }} /> : <Image source={{ uri: item.image }} resizeMode='contain' style={{ width: 100, height: 100, top: 5, marginLeft: 10 }} />}
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
                                                <Text style={{ right: -150, marginLeft: 10, bottom: 30 }}>  {item.description.length > 30 ? item.description.substring(0, 30) + '...' : item.description}</Text>
                                                <Text style={{ color: "green", textAlign: 'center', bottom: 10 }}> ${item.price}</Text>
                                            </View>
                                        </Pressable>

                                    </View>
                                )
                            }}
                        />
                    </View>}
                </View>
            }
            {onEnd ? <View style={{ justifyContent: "center", alignItems: "center", alignContent: "center", height: 50, flexDirection: 'row' }}>
                <Icon name='ios-refresh-outline' color='black' size={35} style={{}} onPress={() => onPressMore()} />
                <Text style={{ color: "black", fontSize: 15 }} onPress={() => onPressMore()}> Load More </Text>
            </View> : null}
            <View style={{ flex: 0.5 }} />
        </View>
    )
}

export default WomensclothList