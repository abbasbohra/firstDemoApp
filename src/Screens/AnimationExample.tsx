// import { View, Text, Animated, Easing } from 'react-native'
// import React, { useRef, useState, useEffect } from 'react'

// const AnimationExample = () => {
//     const rotateAnim: any = useRef(new Animated.Value(0)).current
//     const scalling: any = useRef(new Animated.Value(1)).current
//     const slidingAnim: any = useRef(new Animated.Value(100)).current
//     const slidingAnimY: any = useRef(new Animated.Value(100)).current
//     const skewAnim: any = useRef(new Animated.Value(0)).current
//     const matrixAnim: any = useRef(new Animated.Value(0)).current
//     const StartAnimation = () => {
//         Animated.loop(
//             Animated.timing(rotateAnim, {
//                 toValue: 1,
//                 duration: 2000,
//                 useNativeDriver: false
//             })
//         ).start()
//     }

//     const secondAnimation = () => {
//         Animated.timing(scalling, {
//             toValue: 2,
//             duration: 2000,
//             useNativeDriver: false
//         }).start()
//     }
//     const thirdAnimation = () => {
//         Animated.timing(scalling, {
//             toValue: 1,
//             duration: 2000,
//             useNativeDriver: false
//         }).start()
//     }

//     const fourthAnimation = () => {
//         Animated.timing(slidingAnim, {
//             toValue: 1,
//             duration: 1000,
//             useNativeDriver: false,
//         }).start()
//     }
//     const fifthAnimation = () => {
//         Animated.timing(slidingAnimY, {
//             toValue: 0,
//             duration: 1000,
//             useNativeDriver: false
//         }).start()
//     }
//     const fifthSecondAnimation = () => {
//         Animated.timing(slidingAnimY, {
//             toValue: 100,
//             duration: 1000,
//             useNativeDriver: false
//         }).start()
//     }
//     const sixthAnimation = () => {
//         Animated.timing(skewAnim, {
//             toValue: 2,
//             duration: 2000,
//             easing: Easing.bounce,
//             useNativeDriver: false
//         }).start()
//     }

//     const animatedStyle = {
//         transform: [
//             {
//                 rotate: rotateAnim.interpolate({
//                     inputRange: [0, 1],
//                     outputRange: ['0deg', '360deg'],
//                 }),
//             },
//         ],
//     };
//     const interpole = () => {
//         return rotateAnim.interpolate({
//             inputRange: [0, 1],
//             outputRange: ['0deg', '360deg']
//         })
//     }
//     const interinterpolateRotationpole = () => {
//         return skewAnim.interpolate({
//             inputRange: [0, 1],
//             outputRange: ['0deg', '30deg']
//         })
//     }


//     const animation = () => {
//         Animated.timing(skewAnim, {
//             toValue: 1,
//             duration: 2000,
//             useNativeDriver: false
//         }).start()
//     }

//     return (
//         <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//             <Animated.View style={{ width: 100, height: 100, backgroundColor: 'green', transform: [{ rotate: interpole(), }] }}>
//                 <Text onPress={() => StartAnimation()}>Rotation Animation</Text>
//             </Animated.View>
//             <Animated.View style={{ width: 100, height: 100, backgroundColor: 'blue', transform: [{ scale: scalling }] }}>
//                 <Text onPress={() => secondAnimation()} onLongPress={() => thirdAnimation()}>Scaling Animation</Text>
//             </Animated.View>
//             <Animated.View style={{ width: 100, height: 100, backgroundColor: 'purple', transform: [{ translateX: slidingAnim, }] }}>
//                 <Text onPress={() => { fourthAnimation() }}>Slide Animation</Text>
//             </Animated.View>
//             <Animated.View style={{ width: 100, height: 100, backgroundColor: 'purple', transform: [{ translateY: slidingAnimY, }] }}>
//                 <Text onPress={() => fifthAnimation()} onLongPress={() => fifthSecondAnimation()}>Slide Animation</Text>
//             </Animated.View>
//             {/* <Animated.View style={{ width: 100, height: 100, backgroundColor: 'purple', transform: [{ matrix: [1, 0, 0, 1, 0, 0], skewX: interinterpolateRotationpole() }] }}>
//                 <Text onPress={() => animation()}> huii </Text>
//             </Animated.View> */}


//         </View>
//     )
// }

// export default AnimationExample







// // import React, { useRef } from 'react';
// // import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

// // const HomeScreen = () => {
// //   const scrollViewRef = useRef(null);

// //   const scrollToTop = () => {
// //     if (scrollViewRef.current) {
// //       scrollViewRef.current.scrollTo({ x: 1, y: 1, animated: true });
// //     }
// //   };

// //   return (
// //     <View style={styles.container}>
// //       <ScrollView ref={scrollViewRef} contentContainerStyle={styles.scrollContainer}>
// //         <Text style={styles.text}>Item 1</Text>
// //         <Text style={styles.text}>Item 2</Text>
// //         <Text style={styles.text}>Item 3</Text>
// //         <Text style={styles.text}>Item 1</Text>
// //         <Text style={styles.text}>Item 2</Text>
// //         <Text style={styles.text}>Item 3</Text> 
// //         <Text style={styles.text}>Item 2</Text>
// //         <Text style={styles.text}>Item 3</Text>
// //         <Text style={styles.text}>Item 1</Text>
// //         <Text style={styles.text}>Item 2</Text>
// //         <Text style={styles.text}>Item 3</Text> 
// //         <Text style={styles.text}>Item 2</Text>
// //         <Text style={styles.text}>Item 3</Text> 
// //         <Text style={styles.text}>Item 2</Text>
// //         <Text style={styles.text}>Item 3</Text>
// //         <Text style={styles.text}>Item 1</Text>
// //         <Text style={styles.text}>Item 2</Text>
// //         <Text style={styles.text}>Item 3</Text>
// //         <Text style={styles.text}>Item 1</Text>
// //         <Text style={styles.text}>Item 2</Text>
// //         <Text style={styles.text}>Item 3</Text>
// //         <Text style={styles.text}>Item 1</Text>
// //         <Text style={styles.text}>Item 2</Text>
// //         <Text style={styles.text}>Item 3</Text>
// //         <Text style={styles.text}>Item 1</Text>
// //         <Text style={styles.text}>Item 2</Text>
// //         <Text style={styles.text}>Item 3</Text>
// //         <Text style={styles.text}>Item 1</Text>
// //         <Text style={styles.text}>Item 2</Text>
// //         <Text style={styles.text}>Item 3</Text>
// //         <Text style={styles.text}>Item 1</Text>
// //         <Text style={styles.text}>Item 2</Text>
// //         <Text style={styles.text}>Item 3</Text>
// //         <Text style={styles.text}>Item 1</Text>
// //         <Text style={styles.text}>Item 2</Text>
// //         <Text style={styles.text}>Item 3</Text>
// //         <Text style={styles.text}>Item 1</Text>
// //         <Text style={styles.text}>Item 2</Text>
// //         <Text style={styles.text}>Item 3</Text>
// //         <Text style={styles.text}>Item 1</Text>
// //         <Text style={styles.text}>Item 2</Text>
// //         <Text style={styles.text}>Item 3</Text>
// //         <Text style={styles.text}>Item 1</Text>
// //         <Text style={styles.text}>Item 2</Text>
// //         <Text style={styles.text}>Item 3</Text>

// //       </ScrollView>
// //       <TouchableOpacity onPress={scrollToTop} style={styles.scrollToTopButton}>
// //         <Text>Scroll to Top</Text>
// //       </TouchableOpacity>
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   scrollContainer: {
// //     paddingVertical: 20,
// //   },
// //   text: {
// //     fontSize: 20,
// //     marginBottom: 10,
// //   },
// //   scrollToTopButton: {
// //     padding: 10,
// //     backgroundColor: 'lightblue',
// //     borderRadius: 5,a
// //     margin: 10,
// //   },
// // });

// // export default HomeScreen;
// import React, { useRef } from 'react';
// import { TextInput, View, TouchableOpacity, Text } from 'react-native';

// function App() {
//   const textInputRef = useRef(null);

//   const focusTextInput = () => {
//     if (textInputRef.current) {
//       textInputRef.current.focus();
//     }
//   };

//   return (
//     <View>
//       <TextInput ref={textInputRef} placeholder="Type here" />

//       <TouchableOpacity onPress={focusTextInput}>
//         <Text>Focus Text Input</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// export default App;
// import React, { useState } from 'react';
// import { View, TextInput, StyleSheet, Text } from 'react-native';

// const App = () => {
//   const [isFocused, setIsFocused] = useState(false);

//   return (
//     <View style={styles.container}>
//       {isFocused ? <Text style={{color:'black',fontSize:12,right:40,top:15}}> Type something...</Text> : null}
//       <TextInput
//         style={[styles.textInput, isFocused ? styles.focusedTextInput : null]}
//         onFocus={() => setIsFocused(true)}
//         onBlur={() => setIsFocused(false)}
//         placeholder={ isFocused ? '': "Type something..."}
//         p
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   textInput: {
//     fontSize: 20, // Default text size
//     padding: 10,
//     width: 200,
//   },
//   focusedTextInput: {
//     fontSize: 12, // Smaller text size when focused
//   },
// });

// export default App;

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

function App() {
  const [isPressed, setIsPressed] = useState(false);

  const handlePressIn = () => {
    setIsPressed(true);
  };

  const handlePressOut = () => {
    setIsPressed(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8} // Adjust this to control the opacity during press
        style={[
          styles.button,
          isPressed ? styles.buttonPressed : styles.buttonNormal,
        ]}
      >
        <Text style={styles.buttonText}>Press Me</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: 'blue',
    backgroundColor: 'white',
  },
  buttonNormal: {
    borderColor: 'blue',
  },
  buttonPressed: {
    borderColor: 'red',
    backgroundColor: 'lightgray',
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
  },
});

export default App;
