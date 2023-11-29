import { View, Text } from 'react-native'
import React from 'react'
import Header from '../../component/Header'

const ExampleTestimonial = ({ navigation }) => {
    return (
        <View >
            <Header title='Testimonail' searchLeft={5} cartleft={-10} onpress={() => navigation.goBack()} showShadow={false} />
            <View style={{ height: 250, backgroundColor: "white" }}>
                <View style={{width:230,top:50,left:160}}>
                    <Text style={{color:'black',fontSize:15,fontWeight:'500'}}>Fashionleo is providing very nice product on its platform. </Text>
                </View>
            <Text style={{top:160,color:'black',fontSize:15,margin:20}}>Arjuna@gmail.com </Text>
            </View>
        </View>
    )
}

export default ExampleTestimonial