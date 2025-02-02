import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "@/constants/images";
import icons from "@/constants/icons";

const SignIn = () => {
  const handleLogin = () => {};

  return (
    // safe area view is used to make sure the content is not cut off by the notch (in other words, making it fits the screen)
    <SafeAreaView className="bg-white h-full">
      {/* scroll view is used to make the content scrollable if the content is too long to fit the screen */}
      <ScrollView contentContainerClassName="h-full">
        <Image
          source={images.onboarding}
          className="w-full h-4/6"
          resizeMode="contain" // this is used to make the image fit the container
        />

        {/* view is like a div in html */}
        <View className="px-10">
          <Text className="text-base text-center uppercase font-rubik text-black-200">
            Welcome to TrueHome
          </Text>
          <Text className="text-3xl font-rubik-bold text-black-300 text-center mt-2">
            Let's Get You Closer to {"\n"}
            <Text className="text-primary-300">Your Dream Home</Text>
          </Text>

          <Text className="text-lg font-rubik text-black-200 text-center mt-12">
            Login to TrueHome with Google
          </Text>

          {/* touchable opacity is like a button in html */}
          <TouchableOpacity
            onPress={handleLogin}
            className="bg-white shadow-md shadow-zinc-300 rounded-full w-full py-4 mt-5"
          >
            <View className="flex flex-row items-center justify-center">
              <Image
                source={icons.google}
                className="w-5 h-5"
                resizeMode="contain"
              />
              <Text className="text-lg font-rubik-medium text-black-300 ml-2">
                Continue with Google
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
