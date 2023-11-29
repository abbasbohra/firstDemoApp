import { View, Text, FlatList, ActivityIndicator, Pressable, Switch } from 'react-native'
import React, { useEffect, useState } from 'react'
import { _makeAxiosGetRequest } from '../../Service/axios'
import { endpoint } from '../../Service/endpoint'
import Header from '../../component/Header'
import Icon from 'react-native-vector-icons/Ionicons'
import { useIsFocused } from '@react-navigation/native'
import { } from 'react-native'
import LottieView from 'lottie-react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'


const Notifucations = ({ navigation }: { navigation: any }) => {

    const [notification, setNotification] = useState('');
    const [notificatinOn, setNotificationOn] = useState(true)
    const isFocused = useIsFocused();
    const [loading, setLoading] = useState(false)

    const readNotification = () => {
        _makeAxiosGetRequest(endpoint.readNotification, {}).then((res) => {
            // console.log(res?.data)
        }).catch((error) => {
            console.log(error)
        })
    }

    useEffect(() => {
        readNotification()
    }, [isFocused])

    const getAllNotifications = () => {
        setLoading(true)
        _makeAxiosGetRequest(endpoint.myNotification, {}).then((res) => {
            // console.log(res?.data)
            setNotification(res?.data?.my_notifications.data)
            setLoading(false)
        }).catch((error) => {
            setLoading(false)
            console.log(error)
        })
    }

    useEffect(() => {
        getAllNotifications();
    }, [])

    const formateDate = ({ date }: { date: any }) => {
        const originalDate = date
        const FormateDate = new Date(originalDate)
        const options: any = { year: 'numeric', month: 'short', day: 'numeric' };
        const ForamtedDate = FormateDate.toLocaleDateString('en-US', options);
        return (
            <View>
                <Text style={{ color: 'black', fontWeight: '600' }}> {ForamtedDate}</Text>
            </View>
        )
    }

    useEffect(() => {
        if (notificatinOn) {
            getAllNotifications()
        } else { setNotification('') }
    }, [notificatinOn])


    useEffect(() => {
        const loadNotificationState = async () => {
            try {
                const storedNotificationOn = await AsyncStorage.getItem('notificationOn');
                setNotificationOn(storedNotificationOn === 'true');
            } catch (error) {
                console.log(error);
            }
        };

        loadNotificationState();
    }, []);



    const toggleNotification = (newValue: boolean) => {
        console.log(newValue)
        const saveNotificationState = async () => {
            try {
                await AsyncStorage.setItem('notificationOn', JSON.stringify(newValue));
                setNotificationOn(newValue);
            } catch (error) {
                console.log(error);
            }
        };

        saveNotificationState();
    };

    return (
        <View style={{ flex: 1, backgroundColor: "white" }}>
            <Header title='Notification' onpress={() => navigation.navigate('Home')} searchLeft={5} showShadow={true} cartleft={-10} titleStyle={{ top: 20, left: 90, fontSize: 20, color: 'black', fontWeight: '500' }} />
            <View style={{ backgroundColor: "#F5F5F5" }}>
                <View style={{ flexDirection: 'row', padding: 10 }}>
                    <Text style={{ fontSize: 18, color: 'black', fontWeight: '800' }}> Notifications</Text>
                    <Switch value={notificatinOn} trackColor={notificatinOn ? '#27AAE1' : 'grey'} thumbColor={notificatinOn ? '#27AAE1' : 'grey'} onValueChange={toggleNotification} />
                </View>
            </View>
            {loading ? (
                <View style={{ justifyContent: "center", alignContent: "center", alignItems: "center", top: 310 }}>
                    <LottieView style={{ width: 150, height: 150 }} source={require('../../component/Animations/Animation - 1699005800056.json')} autoPlay loop />
                </View>
            ) : notificatinOn && notification.length > 0 ? (< View style={{ paddingBottom: 120, top: 10 }}>
                <FlatList
                    data={notification}
                    keyExtractor={(item: any) => item}
                    renderItem={({ item, index }: { item: any, index: any }) => {
                        return (
                            <Pressable onPress={() => navigation.navigate('TrackOrder', { orderId: item?.data?.other_id })} style={{ margin: 5, backgroundColor: 'white', shadowColor: 'black', shadowOffset: { width: 1, height: 1 }, shadowOpacity: 1, shadowRadius: 1, elevation: 3, paddingBottom: 15 }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Icon name='radio-button-on' style={{ position: 'absolute', marginLeft: 10, marginTop: 5 }} color={'black'} size={25} />
                                    <Text style={{ color: 'black', fontSize: 15, fontWeight: '800', textAlign: 'center', left: 50, top: 10 }}>{item?.data?.title}</Text>
                                </View>
                                <View style={{ width: 300, margin: 8, marginTop: 25 }}>
                                    <Text style={{}}>{item?.data?.message}</Text>



                                </View>
                                <View style={{ left: 280 }}>
                                    {formateDate({ date: item?.read_at })}
                                </View>
                            </Pressable>
                        )
                    }}
                />
            </View>) : (
                <View style={{ justifyContent: "center", alignContent: "center", alignItems: "center", top: 150 }}>
                    <Text style={{ color: 'black', fontWeight: '700', fontStyle: 'italic' }}> No Notification found  </Text>

                </View>
            )}
        </View >
    )
}

export default Notifucations