import { View, Text } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";

const Property = () => {
  const { id } = useLocalSearchParams(); // get the id from the url

  return (
    // view is like a div
    <View>
      <Text>Property {id}</Text>
    </View>
  );
};

export default Property;
