import React, { useEffect, useState } from 'react'
import { View, Text, Image, TouchableOpacity, Modal, Alert, ToastAndroid, StyleSheet, ScrollView, FlatList, Dimensions, Share } from 'react-native'
import RBSheet from 'react-native-raw-bottom-sheet'
import { Avatar } from 'react-native-paper'
import Icon from 'react-native-vector-icons/Ionicons'
import auth from '@react-native-firebase/auth'
import Feather from 'react-native-vector-icons/Feather'
import firestore from '@react-native-firebase/firestore'
import { firebase } from '@react-native-firebase/auth'
import { useIsFocused, } from '@react-navigation/native'
import Header from '../../component/Header'
import { BlurView } from '@react-native-community/blur'
import Pinchable from 'react-native-pinchable'
import { logIn, logOut } from '../../redux/slice/LoginScreenSlice'
import { useDispatch } from 'react-redux'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { _makeAxiosGetRequest, _makeAxiosPostRequest } from '../../Service/axios'
import { endpoint } from '../../Service/endpoint'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import Fontisto from 'react-native-vector-icons/Fontisto'
import { ConditionsOptions, ManageAccountOptions, ManageSettingOptions, OptionsData } from '../../component/ProfileOptions/Option'
import { setShowLogin } from '../../redux/slice/LoginScreenSlice'
import SkelatonEffectProfile from '../../component/SkelatonEffect/SkelatonEffectProfile'
type user = {
  Name: string
  Email: string
  profile: string
}



const Profile = ({ navigation }: { navigation: any }) => {
  const [user, setUser] = useState<user>([])
  const [openProfilePic, setOpenProfilePic] = useState<boolean>(false)
  const [userImage, setUserImage] = useState<string>('')
  const isFocused = useIsFocused();
  const [manageAccountVisivble, setManageAccountVisible] = useState(false)
  const [manageSettingVisible, setManagaSettingVisible] = useState(false)
  const [openInviteFreindModal, setOpenInviteModalModal] = useState(false)
  const [openDeleteAccountModal, setOpenDeleteAccountModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [cmsDetail, setCmsDetail] = useState([]);
  const dispatch = useDispatch()


  const getDetail = () => {
    setLoading(true)
    _makeAxiosGetRequest(endpoint.myProfile, {}).then((res) => {
      // console.log(res)
      setUser(res.data.user)
      // ToastAndroid.show(res?.message, ToastAndroid.SHORT)
    }).catch((err) => {
      console.log(err)
    })
  }
  useEffect(() => {
    getDetail()
    getProfilePic()
    getLoaction()
    getCmsDetail()
  }, [isFocused])


  const getProfilePic = async () => {
    const pic: any = await AsyncStorage.getItem('UserImage')
    const userimage = JSON.parse(pic)
    setUserImage(userimage)
  }
  console.log('userimage==========>', userImage)

  const getLoaction = async () => {
    const locat: any = await AsyncStorage.getItem('Loacation')
    const location = JSON.parse(locat)
    // console.log('location===========>', location)
  }



  const deleteAccount = () => {
    _makeAxiosPostRequest(endpoint.deleteAccount).then((res: any) => {
      console.log(res.data)
      setOpenDeleteAccountModal(false)
      dispatch(logOut(false))
      AsyncStorage.clear()
      navigation.navigate('Auth')
      ToastAndroid.show(res.message, ToastAndroid.SHORT)
    }).catch((error) => {
      console.log(error.Response.data)
    })
  }

  const share = async () => {
    try {
      const result = await Share.share({
        message: 'Download fashion-leo https://play.google.com/store/apps/details?id=com.fashionleo',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {

        } else {

        }
      } else if (result.action === Share.dismissedAction) {

      }

    } catch (error: any) {
      Alert.alert(error.message);
    }
  };

  const LOGOUT = () => {
    dispatch(logOut(false))
    AsyncStorage.clear()
    navigation.navigate('Auth')
  }

  const getCmsDetail = () => {
    _makeAxiosGetRequest(endpoint.cms, {}).then((res) => {
      // console.log('res=====>', res.data.cms)
      setCmsDetail(res.data.cms)
      setLoading(false)
    }).catch((error) => {
      console.log(error)
    })
  }

  return (
    <View style={style.container}>
      <Header title='My Account' showShadow={true} searchLeft={5} cartleft={-10} onpress={() => navigation.navigate('HomePage')} />
      {loading ? (

        <SkelatonEffectProfile />

      ) :
        (< ScrollView contentContainerStyle={{ top: 1, paddingBottom: 30 }} showsVerticalScrollIndicator={false}>
          <View style={{ backgroundColor: "white" }}>
            <Text style={{ color: 'black', margin: 10, fontSize: 20, fontWeight: '900' }}> {user?.name?.toUpperCase()}</Text>
            <Icon name='pencil' style={{ position: "absolute", top: 12, left: 320 }} size={22} color={'#27AAE1'} onPress={() => navigation.navigate('EditProfile')} />
            <View style={{ paddingBottom: 30, bottom: 0 }}>
              <View style={{ paddingBottom: 0, top: 10 }}>
                <FlatList
                  data={OptionsData}
                  showsVerticalScrollIndicator={false}
                  keyExtractor={(item) => item.id}
                  numColumns={2}
                  renderItem={({ item, index }) => {
                    return (
                      <View>
                        <TouchableOpacity onPress={() => item.navigationScreen == '' ? null : navigation.navigate(item.navigationScreen)} style={{ flexDirection: 'row', borderWidth: 1, borderColor: 'silver', width: 190, height: 40, margin: 8 }}>
                          <View style={{ width: 30, height: 30, margin: 5 }}>
                            <Image source={item.icon} style={{ width: 25, height: 25, tintColor: "#27AAE1" }} />
                          </View>
                          <Text style={{ color: "black", fontSize: 15, fontWeight: '800', top: 3, margin: 5, }}> {item.Name}</Text>

                        </TouchableOpacity>
                        <View style={{ width: 20, height: 20, position: "absolute", left: 170, top: 15 }}>
                          <Image source={item.rightIcon} style={{ width: 15, height: 15, top: 5, }} />
                        </View>
                      </View>
                    )
                  }}
                />
              </View>
            </View>
          </View>
          <View style={{ top: 1, backgroundColor: 'white', paddingBottom: 0 }}>
            <TouchableOpacity onPress={() => manageAccountVisivble ? setManageAccountVisible(false) : setManageAccountVisible(true)}>
              <Feather name='edit' color={'#27AAE1'} size={30} style={{ position: "absolute", margin: 10 }} />
              <Text style={{ color: 'black', fontSize: 15, margin: 15, left: 30, fontWeight: '800' }}> Manage Account</Text>
              <Icon name={manageAccountVisivble ? 'chevron-up' : 'chevron-down'} style={{ position: "absolute", margin: 10, left: 330 }} size={30} color={'black'} />
            </TouchableOpacity>

            {manageAccountVisivble ?
              <View style={{ paddingBottom: 15, top: 10 }}>
                <FlatList
                  data={ManageAccountOptions}
                  showsVerticalScrollIndicator={false}
                  keyExtractor={(item) => item.id}
                  numColumns={2}
                  renderItem={({ item, index }) => {
                    return (
                      <View>
                        <TouchableOpacity onPress={() => item.navigationScreen == '' ? null : navigation.navigate(item.navigationScreen)} style={{ borderWidth: 1, borderColor: 'silver', width: 180, height: 70, margin: 8 }}>
                          <View style={{ width: 30, height: 30, margin: 5, left: 75, top: 5, alignItems: "center" }}>
                            <Image source={item.icon} style={{ width: 21, height: 21, tintColor: "#27AAE1" }} />
                          </View>
                          <Text style={{ color: "black", fontSize: 15, fontWeight: '800', margin: 5, bottom: 13, textAlign: 'center' }}> {item.Name}</Text>

                        </TouchableOpacity>
                      </View>
                    )
                  }}
                />
              </View> : null}
          </View>
          <View style={{ backgroundColor: "white", top: 2, paddingBottom: manageSettingVisible ? 20 : 0 }}>
            <TouchableOpacity onPress={() => manageSettingVisible ? setManagaSettingVisible(false) : setManagaSettingVisible(true)}>
              <Text style={{ color: 'black', margin: 15, fontSize: 20, fontWeight: '800', left: 30 }}> Setting </Text>
              <Feather name='settings' style={{ position: "absolute", margin: 15 }} size={27} color={'#27AAE1'} />
              <Icon name='chevron-down' style={{ position: "absolute", margin: 10, left: 330 }} size={30} color={'black'} />
            </TouchableOpacity>

            {manageSettingVisible ? <View style={{ paddingBottom: 20 }}>
              <FlatList
                data={ManageSettingOptions}
                showsVerticalScrollIndicator={false}
                numColumns={2}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => {
                  return (
                    <View>
                      <TouchableOpacity onPress={() => item.Name === 'Delete Account' ? setOpenDeleteAccountModal(true) : item.navigationScreen == '' ? null : navigation.navigate(item.navigationScreen)} style={{ flexDirection: 'row', borderWidth: 1, borderColor: 'silver', width: 185, margin: 5 }}>
                        <View style={{ width: 30, height: 30, margin: 5 }}>
                          <Image source={item.icon} style={{ width: 25, height: 25, tintColor: "#27AAE1" }} />
                        </View>
                        <Text style={{ color: "black", fontSize: 15, fontWeight: '800', top: 3, margin: 5, right: 3 }}> {item.Name}</Text>

                      </TouchableOpacity>
                      <View style={{ width: 20, height: 20, position: "absolute", left: 170, top: 15 }}>
                        <Image source={item.rightIcon} style={{ width: 15, height: 15, top: 5, }} />
                      </View>
                    </View>
                  )
                }}
              />
              <TouchableOpacity onPress={() => setOpenInviteModalModal(true)} style={{ width: '90%', flexDirection: "row", borderWidth: 0.5, top: 15, height: 40, left: 20 }}>
                <MaterialCommunityIcon name='card-account-details' color={'#27AAE1'} size={25} style={{ margin: 5 }} />
                <Text style={{ color: 'black', fontSize: 18, left: 20, margin: 5 }}> Invite a Freind & Earn</Text>
                <Icon name='chevron-forward' color={'black'} size={25} style={{ left: 90, top: 7 }} />

              </TouchableOpacity >
            </View> : null}
          </View>
          <View style={{ paddingBottom: 40, top: 3.5, backgroundColor: "white" }}>
            <FlatList
              data={cmsDetail}
              keyExtractor={(item: any) => item.id}
              showsVerticalScrollIndicator={false}
              renderItem={({ item, index }) => {
                return (
                  <TouchableOpacity onPress={() => navigation.navigate('ExampleCmsDetail', { item: item })} style={{ margin: 10, top: 10, left: 10, flexDirection: "row" }}>
                    <View style={{ width: 20, height: 20, top: 5 }}>
                      <Image source={require('../../component/IconImage/information-button.png')} style={{ width: 15, height: 15, tintColor: "#27AAE1" }} />
                    </View>
                    <Text style={{ color: 'black', fontSize: 15, fontWeight: '800' }}> {item.title}</Text>
                  </TouchableOpacity>
                )
              }}
            />
            <TouchableOpacity style={{ flexDirection: "row", borderBottomWidth: 0.5, borderTopWidth: 0.5, bottom: -10, borderColor: 'silver' }}>
              <Icon name='person-sharp' color={'#27AAE1'} size={20} style={{ left: 26, top: 10 }} />
              <Text style={{ color: 'black', fontSize: 15, padding: 10, left: 23, fontWeight: '800' }}>Switch to Seller</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => LOGOUT()} style={{ flexDirection: "row", borderWidth: 2, bottom: -20, borderColor: '#27AAE1', width: '90%', justifyContent: "center", alignItems: "center", left: 20 }}>
              <Text style={{ color: 'black', fontSize: 15, padding: 10, left: 0, fontWeight: '900' }}>LOG OUT </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>)}
      <View style={{ justifyContent: "center", alignItems: 'center' }}>
        <Modal
          visible={openInviteFreindModal}
          onRequestClose={() => setOpenInviteModalModal(false)}
          transparent={true}
        >
          <BlurView blurType='thinMaterial' style={{ justifyContent: 'center', alignItems: 'center', top: 0, height: 845, width: 375, left: 10 }}>
            <View style={{ backgroundColor: 'white', borderRadius: 10, }}>
              <Icon name='close-sharp' color={'silver'} size={25} style={{ left: 350 }} onPress={() => setOpenInviteModalModal(false)} />
              <View style={{ alignItems: 'center', justifyContent: 'center', top: 250, left: 25 }}>
                <Image source={require('../../component/IconImage/sharemedia.jpg')} style={{ width: 250, height: 250 }} />
              </View>
              <View style={{ top: 200, alignItems: "center" }}>
                <Text style={{ color: 'black', fontSize: 23, fontWeight: '900', left: 25 }}> Invite Your Freind </Text>
                <Text style={{ color: "silver", fontSize: 15, fontWeight: '700', textAlign: "center", marginLeft: 50, top: 20 }}>Invite your freind to use this amazing Portal! </Text>
              </View>
              <View style={{ top: 280, alignItems: 'center', justifyContent: 'center', alignContent: "center" }}>
                <TouchableOpacity style={{ width: '95%', backgroundColor: '#27AAE1', borderRadius: 25, left: 20 }} onPress={() => share()}>
                  <Text style={{ color: 'white', padding: 10, textAlign: 'center', fontSize: 20, fontWeight: '900' }}> Share this Link </Text>
                </TouchableOpacity>
              </View>
            </View>
          </BlurView>
        </Modal>
      </View>

      <View>
        <Modal
          visible={openDeleteAccountModal}
          onRequestClose={() => setOpenDeleteAccountModal(false)}
          transparent={true}
        >
          <BlurView blurType='chromeMaterialLight' style={{ width: '90%', height: '70%', justifyContent: "center", alignItems: 'center', left: 15, top: 130, }}>

            <View style={{ width: '90%', height: '70%', left: 15, top: 130, backgroundColor: 'white', borderRadius: 20 }}>
              <Icon name='close-sharp' style={{ left: 310, top: 10 }} size={30} color={'black'} onPress={() => setOpenDeleteAccountModal(false)} />
              <Text style={{ color: 'red', fontWeight: '700', fontSize: 20, top: 25, textAlign: 'center' }}> Delete Account *</Text>
              <Text style={{ top: 50, color: 'black', fontSize: 15, fontWeight: '400', margin: 5, left: 15 }}>By deleting your account the following information will be deleted and cannot be undone -</Text>
              <View style={{ top: 50, left: 15 }}>
                <Text style={{ color: 'black', fontWeight: "400", fontSize: 15 }}> {'1. Personal Details'}</Text>
                <Text style={{ color: 'black', fontWeight: "400", fontSize: 15 }}> {'1. Seller Profile (if available)'}</Text>
                <Text style={{ color: 'black', fontWeight: "400", fontSize: 15 }}> {'1. Personal Documents'}</Text>
                <Text style={{ color: 'black', fontWeight: "400", fontSize: 15 }}> {'1. Addresses'}</Text>
                <Text style={{ color: 'black', fontWeight: "400", fontSize: 15 }}> {'1. Bank Details'}</Text>
              </View>
              <Text style={{ top: 80, color: 'black', fontSize: 15, width: 370 }}>Please click on <Text style={{ fontWeight: '900' }}>Confirm to delete</Text> your account now</Text>
              <View style={{ flexDirection: "row", top: 230 }}>
                <TouchableOpacity style={{ width: '45%', backgroundColor: '#27AAE1', borderRadius: 16, left: 10 }} onPress={() => setOpenDeleteAccountModal(false)}>
                  <Text style={{ color: "white", textAlign: 'center', padding: 10, fontWeight: 'bold', fontSize: 15 }}> Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ width: '45%', backgroundColor: '#27AAE1', borderRadius: 16, left: 20 }} onPress={() => deleteAccount()}>
                  <Text style={{ color: "white", textAlign: 'center', padding: 10, fontWeight: 'bold', fontSize: 15 }}> Confirm </Text>
                </TouchableOpacity>
              </View>
            </View>

          </BlurView>
        </Modal>
      </View>
    </View >
  )
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5"
  },

  headertitle: {
    top: 20,
    left: 100,
    fontSize: 20,
    color: 'black',
    fontWeight: '500'
  },

  profileimagecontainer: {
    backgroundColor: "white",
    top: 90,
    width: 130,
    left: 130,
    borderRadius: 5,
    shadowColor: "#545EB5",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 1,
    elevation: 5
  },
  profileimage: {
    backgroundColor: 'transparent',
    top: 0,
    left: 5,
    width: 100,
    height: 100,
    margin: 10,
    borderRadius: 5
  },
  username: {
    textAlign: 'center',
    color: 'black',
    fontSize: 20
  },
  useremail: {
    color: "grey",
    textAlign: 'center'
  },
  optioncontainer: {
    backgroundColor: "white",
    top: 130,
    height: 450,
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    shadowColor: "black",
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 10,
    shadowRadius: 5,
    elevation: 20,
  },
  editbtncontainer: {
    flexDirection: 'row',
    top: 40,
  },
  editlefticon: {
    left: 30,
    bottom: 0
  },
  editrighticon: {
    bottom: 2,
    left: 350,
    position: "absolute"
  },
  edittext: {
    color: "black",
    fontWeight: '700',
    left: 45,
    top: 4
  },
  shoppingbtncontainer: {
    flexDirection: 'row',
    top: 60,
  },
  shoppinglefticon: {
    left: 30,
    bottom: 0
  },
  shoppingrighticon: {
    bottom: 2,
    left: 353,
    position: "absolute"
  },
  shoppingtext: {
    color: "black",
    fontWeight: '700',
    left: 45,
    top: 4
  },
})


export default Profile