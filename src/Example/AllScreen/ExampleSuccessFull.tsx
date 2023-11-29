import { View, Text } from 'react-native'
import React from 'react'

const ExampleSuccessfull = ({ loading, }: { loading: any }) => {
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            {loading ? <Text> PLEASE WAIT ORDER PLACED</Text> : (<View>
            </View>)}
        </View>
    )
}

export default ExampleSuccessfull
