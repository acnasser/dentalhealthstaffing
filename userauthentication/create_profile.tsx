import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, ImageBackground, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback, Alert, Image } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from './types'; 
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { auth, db } from '../firebaseConfig'; 
import { doc, updateDoc } from 'firebase/firestore';

SplashScreen.preventAutoHideAsync();

const fetchFonts = async () => {
  await Font.loadAsync({
    'Avenir': require('../assets/fonts/AvenirLTStd-Black.otf'),
  });
};

const CreateProfilePage = () => {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [bio, setBio] = useState('');
  const [workExperience, setWorkExperience] = useState('');
  const [resume, setResume] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [resumeFilename, setResumeFilename] = useState<string | null>(null);

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

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

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/pdf',
      copyToCacheDirectory: true,
    });

    if (!result.canceled) {
      setResume(result.assets[0].uri);
      setResumeFilename(result.assets[0].uri);
    }
  };

  const handleCreateProfile = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);

        await updateDoc(userRef, {
          bio: bio,
          workExperience: workExperience,
          resume: resume,
          profileImage: profileImage,
        });

        Alert.alert('Profile Created Successfully!', 'You may now use the app.', [
          {
            text: 'OK',
            onPress: () => navigation.navigate('MapPage'),
          },
        ]);
      }
    } catch (error) {
      const errorMessage = (error as Error).message;
      Alert.alert('Error', errorMessage);
    }
  };

  if (!dataLoaded) {
    return null;
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
          <View style={[styles.container, keyboardVisible && styles.containerShifted]}>
            <Text style={styles.title}>Create Profile</Text>
            <Pressable onPress={pickImage}>
              <View style={styles.imageContainer}>
                {profileImage ? (
                  <Image source={{ uri: profileImage }} style={styles.image} />
                ) : (
                  <View style={styles.placeholderContainer}>
                    <Text style={styles.placeholderText}>Upload Profile Picture</Text>
                  </View>
                )}
              </View>
            </Pressable>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Bio</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Talk about yourself!"
                value={bio}
                onChangeText={setBio}
                multiline
                numberOfLines={4}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Work Experience</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="What have you done before?"
                value={workExperience}
                onChangeText={setWorkExperience}
                multiline
                numberOfLines={4}
              />
            </View>
            <Pressable style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]} onPress={pickDocument}>
              <Text style={styles.buttonText}>Upload Resume</Text>
            </Pressable>
            {resume && (
              <Text style={styles.resumeText}>Resume uploaded! ({resumeFilename})</Text>
            )}
            <Pressable style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]} onPress={handleCreateProfile}>
              <Text style={styles.buttonText}>Create Profile</Text>
            </Pressable>
          </View>
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
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginHorizontal: 20,
    marginTop: 100,
    marginBottom: 0,
  },
  containerShifted: {
    marginTop: 0,
  },
  title: {
    fontFamily: 'Avenir',
    fontSize: 26,
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  imageContainer: {
    alignSelf: 'center',
    marginBottom: 20,
    borderRadius: 50,
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E0E0E0',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  placeholderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: 'gray',
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 14,
  },
  inputLabel: {
    fontFamily: 'Avenir',
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    fontFamily: 'Avenir',
    borderRadius: 10,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonPressed: {
    backgroundColor: '#0056b3',
  },
  buttonText: {
    color: 'white',
    fontFamily: 'Avenir',
    fontSize: 18,
  },
  resumeText: {
    fontFamily: 'Avenir',
    fontSize: 16,
    color: '#007BFF',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default CreateProfilePage;