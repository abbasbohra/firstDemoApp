import { View, Text, TextInput, StyleSheet, TouchableOpacity, ToastAndroid, FlatList, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { _makeAxiosGetRequest, _makeAxiosPostRequest } from '../Service/axios'
import { endpoint } from '../Service/endpoint'
import Header from '../component/Header'
import { Picker } from '@react-native-picker/picker'

const BankDetail = () => {
    const [bankDetail, setBankDetail] = useState([])
    const [name, setName] = useState<string>('');
    const [bankCode, setBankCode] = useState<string>('');
    const [branchCode, setBranchCode] = useState<string>();
    const [accountType, setAccountType] = useState<string>('');
    const [account, setAccount] = useState<string>('');
    const [ConfirmAccount, setConfirmAccount] = useState<string>('');
    const [focus, setFocus] = useState<number>(0)
    const [confirmAlert, setConfirmAlert] = useState(false);
    const [loading, setLoading] = useState(false)
    const getBankDetail = () => {
        _makeAxiosGetRequest(endpoint.getBankDetail, {}).then((res) => {
            console.log(res.data)
            setBankDetail(res.data)
        }).catch((error) => {
            console.log(error)
        })
    }
    console.log('bankDetail======>', bankDetail)
    useEffect(() => {
        getBankDetail()
    }, [])

    const addBankDetail = () => {
        setLoading(true)
        const data = {
            name: name,
            bank_code: bankCode,
            branch_code: branchCode,
            account_type: accountType,
            account: account,
            confirmaccount: ConfirmAccount,
        }
        _makeAxiosPostRequest(endpoint.addBankDetail, data).then((res: any) => {
            console.log(res.data)
            setLoading(false)
            getBankDetail()
            ToastAndroid.show(res.message, ToastAndroid.SHORT)
        }).catch((error) => {
            setLoading(false)
            console.log(error)
        })
    }

    useEffect(() => {
        if (account != ConfirmAccount) {
            setConfirmAlert(true)
        } else { setConfirmAlert(false) }
    }, [ConfirmAccount])

    return (
        <View style={{ flex: 1, backgroundColor: "white" }}>
            <Header title='Bank Detail' color='#A49456' showCart={false} />
            <View style={[{ width: 355, backgroundColor: '#F5F5F5', top: 30, left: 20 }, styles.shadow]}>
                {focus === 1 ? <Text style={{ color: "black", fontSize: 15, fontWeight: '800' }}> Account Holder Name</Text> : null}
                <TextInput
                    value={name}
                    onChangeText={setName}
                    onFocus={() => setFocus(1)}
                    onBlur={() => setFocus(0)}
                    placeholder={focus == 1 ? null : 'Account Holder Name'}
                    style={{ color: 'black', fontSize: 18, width: 350 }}
                />
            </View>
            <View style={[{ width: 355, backgroundColor: '#F5F5F5', top: 50, left: 20 }, styles.shadow]}>
                {focus === 2 ? <Text style={{ color: "black", fontSize: 15, fontWeight: '800' }}> Bank Code</Text> : null}
                <TextInput
                    value={bankCode}
                    onChangeText={setBankCode}
                    onFocus={() => setFocus(2)}
                    onBlur={() => setFocus(0)}
                    placeholder={focus == 2 ? null : 'Bank Code'}
                    style={{ color: 'black', fontSize: 18, width: 350 }}
                    keyboardType='number-pad'
                />
            </View>
            <View style={[{ width: 355, backgroundColor: '#F5F5F5', top: 70, left: 20 }, styles.shadow]}>
                {focus === 3 ? <Text style={{ color: "black", fontSize: 15, fontWeight: '800' }}> Brach Code</Text> : null}
                <TextInput
                    value={branchCode}
                    onChangeText={setBranchCode}
                    onFocus={() => setFocus(3)}
                    onBlur={() => setFocus(0)}
                    placeholder={focus == 3 ? null : 'Branch Code'}
                    style={{ color: 'black', fontSize: 18, width: 350 }}
                    keyboardType='number-pad'
                />
            </View>
            <View style={[{ width: 355, backgroundColor: '#F5F5F5', top: 90, left: 20 }, styles.shadow]}>
                {focus === 4 ? <Text style={{ color: "black", fontSize: 15, fontWeight: '800' }}> Account Number</Text> : null}
                <TextInput
                    value={account}
                    onChangeText={setAccount}
                    onFocus={() => setFocus(4)}
                    onBlur={() => setFocus(0)}
                    placeholder={focus == 4 ? null : 'Account Number'}
                    style={{ color: 'black', fontSize: 18, width: 350 }}
                    keyboardType='number-pad'
                    secureTextEntry={true}

                />
            </View>
            <View style={[{ width: 355, backgroundColor: '#F5F5F5', top: 110, left: 20 }, styles.shadow]}>
                {focus === 5 ? <Text style={{ color: "black", fontSize: 15, fontWeight: '800' }}> Confirm Account </Text> : null}
                <TextInput
                    value={ConfirmAccount}
                    onChangeText={setConfirmAccount}
                    onFocus={() => setFocus(5)}
                    onBlur={() => setFocus(0)}
                    placeholder={focus == 5 ? null : 'Confirm Account '}
                    style={{ color: 'black', fontSize: 18, width: 350 }}
                    keyboardType='number-pad'

                />
            </View>
            {confirmAlert ? <Text style={{ color: "red", position: "absolute", top: 415, left: 20, fontSize: 15 }}> Account Number Not Match </Text> : null}
            <View style={[{ width: 355, backgroundColor: '#F5F5F5', top: 150, left: 20 }, styles.shadow]}>
                {focus === 6 ? <Text style={{ color: "black", fontSize: 15, fontWeight: '800' }}> Account Type</Text> : null}
                <Picker
                    selectedValue={accountType}
                    onValueChange={(itemValue) => setAccountType(itemValue)}
                    onFocus={() => setFocus(6)}
                    onBlur={() => setFocus(0)}
                    mode='dropdown'
                >
                    <Picker.Item label='Saving' value={'Saving'} />
                    <Picker.Item label='Current' value={'Current'} />

                </Picker>
            </View>
            <View style={{ alignItems: "center", justifyContent: "center", alignContent: 'center', top: 170 }}>
                <TouchableOpacity disabled={loading ? true : false} onPress={() => addBankDetail()} style={{ width: 340, backgroundColor: "#A5965B", borderRadius: 10, }}>
                    {loading ? (<ActivityIndicator size={30} color={'white'} style={{ padding: 10 }} />) : (<Text style={{ padding: 10, textAlign: "center", fontSize: 15, color: "white", fontWeight: '800' }}> Submit </Text>)}
                </TouchableOpacity>
            </View>

            <View style={{ top: 280 }}>
                <FlatList
                    data={bankDetail}
                    keyExtractor={(item: any) => item.id}
                    renderItem={({ item, index }) => {
                        return (
                            <View style={[{ backgroundColor: "#F5F5F5", width: 350, borderRadius: 10, bottom: 0, left: 10 }]}>
                                <View style={{ padding: 10 }}>
                                    <Text style={{ color: "black" }}> Account Holder Name :  {item.name}</Text>
                                    <Text style={{ color: "black" }}> Branch Code :  {item.branch_code}</Text>
                                    <Text style={{ color: "black" }}> Bank Code   :  {item.bank_code}</Text>
                                    <Text style={{ color: "black" }}> Account Number :  {item.account}</Text>
                                    <Text style={{ color: "black" }}> Account Type:  {item.account_type}</Text>
                                </View>
                            </View>
                        )
                    }}
                />
            </View>
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
    }
})
export default BankDetail