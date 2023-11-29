import React, { useState } from 'react';
import { View, Text, SectionList, Alert, StatusBar, TouchableOpacity } from 'react-native';
import FirstScene from '../../component/OnboardingScene/FirstScene';
import SecondScence from '../../component/OnboardingScene/SecondScene'
import FinalScene from '../../component/OnboardingScene/FinalScene';



const OnBoardingScreen = ({ navigation }: { navigation: any }) => {
    const [scene, setScene] = useState(1)
    const ChangeScene = () => {
        if (scene == 1) {
            setScene(2)
        } else if (scene == 2) {

            setScene(3)
        }
    }
    console.log('current', scene)
    return (
        <View style={{ backgroundColor: "white", flex: 1 }}>
            <StatusBar
                animated={true}
                barStyle={'dark-content'}
                translucent={false}
                hidden={false}
                networkActivityIndicatorVisible={true}
                backgroundColor={'white'}
            />
            {scene == 1 ? <FirstScene /> : scene == 2 ? <SecondScence /> : scene == 3 ? <FinalScene /> : <FirstScene />}
            <View>
                {scene == 3 ?
                    <TouchableOpacity style={{ backgroundColor: "#626ABB", bottom: 80, width: 150, borderRadius: 50, left: 35, height: 40, shadowColor: 'black', shadowOffset: { width: 1, height: 1 }, shadowOpacity: 1, shadowRadius: 10, elevation: 5 }} onPress={() => ChangeScene()} onPressIn={() => navigation.navigate('LoginPage')}>
                        <Text style={{ color: "white", fontSize: 20, textAlign: "center", bottom: -5 }}> Get Started </Text>
                    </TouchableOpacity>
                    : <TouchableOpacity style={{ backgroundColor: "#626ABB", bottom: 80, width: 150, borderRadius: 50, left: 30, height: 40, shadowColor: 'black', shadowOffset: { width: 1, height: 1 }, shadowOpacity: 1, shadowRadius: 10, elevation: 5 }} onPress={() => ChangeScene()}>
                        <Text style={{ color: "white", fontSize: 20, textAlign: "center", bottom: -5 }}> Continue</Text>
                    </TouchableOpacity>}
            </View>
            <View style={{ flexDirection: "row", position: 'relative', bottom: 20, justifyContent: "center", alignItems: "center" }}>
                <View style={{ width: scene == 1 ? 20 : 15, height: scene == 1 ? 20 : 15, backgroundColor: scene == 1 ? '#626ABB' : '#E8EAF7', borderRadius: 30 }} />
                <View style={{ width: scene == 2 ? 20 : 15, height: scene == 2 ? 20 : 15, backgroundColor: scene == 2 ? '#626ABB' : '#E8EAF7', borderRadius: 30, marginLeft: 10 }} />
                <View style={{ width: scene == 3 ? 20 : 15, height: scene == 3 ? 20 : 15, backgroundColor: scene == 3 ? '#626ABB' : '#E8EAF7', borderRadius: 30, marginLeft: 10 }} />
            </View>
        </View>

    );
};

export default OnBoardingScreen;
