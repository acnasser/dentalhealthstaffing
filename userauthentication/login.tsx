import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, Pressable, Modal, ImageBackground, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LottieView from 'lottie-react-native';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { RootStackParamList } from './types'; // Import types

SplashScreen.preventAutoHideAsync();

const fetchFonts = async () => {
  await Font.loadAsync({
    'Avenir': require('../assets/fonts/AvenirLTStd-Black.otf'),
  });
};

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const LoginPage = () => {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const navigation = useNavigation<LoginScreenNavigationProp>(); // Use navigation with type

  useEffect(() => {
    const loadResources = async () => {
      try {
        await fetchFonts();
      } catch (e) {
        console.warn(e);
      } finally {
        setDataLoaded(true);
        SplashScreen.hideAsync();
      }
    };

    loadResources();

    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigation.navigate('MapPage'); // Navigate to MapPage
    }, 2000);
  };
  
  if (!dataLoaded) {
    return null; // Return null while the splash screen is shown
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <ImageBackground
          source={require('../assets/images/blue-background.jpg')}
          style={styles.background}
        >
          <View style={[styles.topHalf, keyboardVisible && styles.topHalfShifted]}>
            <View style={styles.logoContainer}>
              <Image source={require('../assets/images/dentalhealthstaffinglogo.jpg')} style={styles.logo} />
            </View>
            <Text style={styles.title}>Coastal Dental Health Staffing</Text>
          </View>
          <View style={[styles.bottomHalf, keyboardVisible && styles.bottomHalfShifted]}>
            <View style={styles.container}>
              <Text style={styles.loginTitle}>Login</Text>
              <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              <Pressable style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
              </Pressable>
              <View style={styles.createAccountContainer}>
                <Text style={styles.createAccountText}>Don't have an account?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('CreateAccount')}>
                  <Text style={styles.createAccountButton}>Create Account</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.socialContainer}>
                <TouchableOpacity>
                  <Image source={require('../assets/images/facebook_logo.png')} style={styles.socialIcon} />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Image source={require('../assets/images/google_logo.png')} style={styles.socialIcon} />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Image source={require('../assets/images/x_logo.jpg.webp')} style={styles.socialIcon} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {isLoading && (
            <Modal
              transparent={true}
              animationType="fade"
              visible={isLoading}
            >
              <View style={styles.modalBackground}>
                <LottieView
                  source={require('../assets/animations/loading_animation_blue.json')}
                  autoPlay
                  loop
                  style={styles.lottie}
                />
              </View>
            </Modal>
          )}
        </ImageBackground>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  topHalf: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50, // Adjust padding as needed
  },
  topHalfShifted: {
    flex: 0.5, // Adjust this value to shift up the top half more
  },
  bottomHalf: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
  },
  bottomHalfShifted: {
    flex: 1.5, // Adjust this value to shift up the bottom half more
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  logoContainer: {
    width: '80%',
    height: 'auto',
    borderRadius: 20,
    overflow: 'hidden',
    aspectRatio: 2, // This will maintain the aspect ratio to make it wider
  },
  logo: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    resizeMode: 'cover',
  },
  title: {
    fontFamily: 'Avenir',
    fontSize: 24,
    marginTop: 20,
    textAlign: 'center',
    color: '#fff', // White color to contrast with blue background
  },
  loginTitle: {
    fontFamily: 'Avenir',
    fontSize: 26, // Increased font size
    marginBottom: 10, // Reduced bottom margin
    marginTop: -20, // Move up the login title
    textAlign: 'center',
    color: '#333',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    fontFamily: 'Avenir',
    borderRadius: 10,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonPressed: {
    backgroundColor: '#0056b3',
  },
  buttonText: {
    color: 'white',
    fontFamily: 'Avenir',
    fontSize: 18,
  },
  createAccountContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  createAccountText: {
    fontFamily: 'Avenir',
    fontSize: 16,
    color: '#333',
  },
  createAccountButton: {
    fontFamily: 'Avenir',
    fontSize: 16,
    color: '#007BFF',
    marginLeft: 5,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  socialIcon: {
    width: 40,
    height: 40,
  },
  lottie: {
    width: 200,
    height: 200,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

export default LoginPage;