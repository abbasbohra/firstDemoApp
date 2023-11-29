import { View, Text, ScrollView, Image, Pressable, Dimensions, FlatList, TouchableOpacity, StyleSheet, BackHandler, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { _makeAxiosGetRequest } from '../../Service/axios'
import { endpoint } from '../../Service/endpoint'
import Header from '../../component/Header'
import MenuDrawer from 'react-native-side-drawer'
import SkelatonEffectWishlist from '../../component/SkelatonEffect/SkelatonEffectWishlist'





const Wishlist = ({ navigation }: { navigation: any }) => {

  const [category, setCategory] = useState([]);
  const [childern, setChildern] = useState('');
  const [categoryId, setCategoryId] = useState(1);
  const [loading, setLoading] = useState(false)
  const [saveIndex, setSaveIndex] = useState<any>()


  const getCategory = async () => {
    setLoading(true)
    _makeAxiosGetRequest(endpoint.getCategory, {})
      .then((res) => {
        // console.log('category======> w', res.data)
        setCategory(res.data)
        setChildern(res.data[0]?.childrens)
        setLoading(false)
      }).catch((err) => {
        // console.log('first', err)
        setLoading(false)
      })
  }
  useEffect(() => {
    getCategory();
  }, [])
  return (
    <View style={styles.container}>
      <Header title='Category' onpress={() => navigation.navigate('HomePage')} showShadow={true} searchLeft={5} cartleft={-10} titleStyle={{ top: 20, left: 100, fontSize: 20, color: 'black', fontWeight: '500' }} />
      {loading ? (<SkelatonEffectWishlist />) :
        <View style={{ flexDirection: "row" }}>
          <View style={styles.categorycontainer}>
            <FlatList
              style={{}}
              showsVerticalScrollIndicator={false}
              data={category}
              keyExtractor={(item: any) => item.id}
              renderItem={({ item, index }: { item: any, index: any }) => {
                return (
                  <TouchableOpacity onPress={() => { setChildern(item?.childrens), setCategoryId(item?.id) }} style={{ backgroundColor: categoryId === item.id ? "white" : undefined, borderBottomWidth: 0.5 }}>
                    <Text style={[styles.categoryname, { color: categoryId === item?.id ? 'red' : "black", }]}> {item.name}</Text>
                  </TouchableOpacity>
                )
              }}
            />
          </View>
          <View style={styles.childerncontainer}>
            {/* <View style={{ height: 680 }} > */}
            {childern === undefined ? (
              <View style={{ alignItems: 'center' }}>
                <Image source={{ uri: 'https://img.freepik.com/free-vector/no-data-concept-illustration_114360-626.jpg?size=626&ext=jpg&ga=GA1.2.1988008418.1674194839&semt=ais' }} resizeMode='contain' style={{ width: 250, height: 250, top: 200, left: 20, alignItems: 'center' }} />
                <Text style={{ color: "black", top: 150, textAlign: "center", }}> Category not found!!! </Text>
              </View>
            ) : (<FlatList
              data={childern}
              refreshControl={<RefreshControl onRefresh={() => getCategory()} refreshing={loading} />}
              style={{}}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item: any) => item.id}
              renderItem={({ item, index }: { item: any, index: any }) => {
                return (
                  <View style={{ left: 0, }}>
                    <Text style={styles.childertitle}> {item.name}</Text>
                    <View style={{}}>
                      <FlatList
                        data={item?.childrens}
                        numColumns={2}
                        style={{}}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(item: any) => item.id}
                        renderItem={({ item, index }: { item: any, index: any }) => {
                          return (
                            <View style={[{ margin: 5, top: 5 },]}>
                              <TouchableOpacity onPress={() => navigation.navigate('ExampleWomenCloths', { id: categoryId, title: item.name, get_sub_categoryid: item.id })} style={[{},]}>
                                <Image source={{ uri: item.ImageSrc }} resizeMode='contain' style={[styles.childerimage, styles.shadow]} />

                                <Text style={styles.childername}> {item.name.length >= 10 ? item?.name.substring(0, 11) + '\n' + item.name.substring(11) : item?.name}</Text>
                              </TouchableOpacity>
                            </View>
                          )
                        }}
                      />
                    </View>
                  </View>
                )
              }}
            />)}
            {/* </View> */}
          </View>
        </View>}
    </View>
  )
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "black",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 1,
    elevation: 5
  },
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  categorycontainer: {
    width: 120,
    height: Dimensions.get('screen').height,
    backgroundColor: '#E8E8E8',
    top: 2
  },
  categoryname: {
    fontWeight: '500',
    bottom: 0,
    fontSize: 12,
    padding: 15,
    textAlign: "center",
    fontFamily: "Alexandria-VariableFont_wght"
  },
  childerncontainer: {
    height: Dimensions.get('screen').height - 160,
    backgroundColor: "white",
    width: 275,
    left: 0,
    top: 2
  },
  childertitle: {
    color: "black",
    top: 5,
    fontWeight: '900',
    fontSize: 15,
    textAlign: "center",
    padding: 5,
    right: 55,
    marginLeft: 10
  },
  childerimage: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: 'white'
  },
  childername: {
    color: "black",
    top: -5,
    fontWeight: '800',
    fontSize: 11,
    textAlign: "center",
    padding: 5,
  }
})

export default Wishlist