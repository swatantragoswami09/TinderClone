import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { Card, Button } from "react-native-elements";
import Deck from "./src/Deck";
import { Image } from "react-native";
import DATA from "./src/DATA";

export default function App() {
  console.log("data=", DATA);
  const renderCard = (item) => {
    return (
      <Card
        key={item.id}
        title={item.text}
        image={{
          uri: "https://i2-prod.mirror.co.uk/incoming/article14334083.ece/ALTERNATES/s615/3_Beautiful-girl-with-a-gentle-smile.jpg",
        }}
      >
        <Image
          style={{ width: 320, height: 600 }}
          source={{
            uri: item.uri,
          }}
          resizeMode={"cover"} // cover or contain its upto you view look
        />
        <Text style={{ marginBottom: 10 }}>
          I can customise the card further
        </Text>
        <Button
          icon={{ name: "code" }}
          backgroundColor="#03A9F4"
          title="View Now!"
        />
      </Card>
    );
  };
  const renderNoMoreCards = () => {
    console.log("renderNoMoreCards called");
    return (
      <Card title="All Done!">
        <Text style={{ marginBottom: 10 }}>There's so more Content here!</Text>
        <Button backgroundColor="#03A9F4" title="Get More!" />
      </Card>
    );
  };
  return (
    <View style={styles.container}>
      <Deck
        data={DATA}
        renderCard={renderCard}
        onSwipeRight={() => console.log("something was swipped")}
        onSwipeLeft={() => console.log("something was swipped")}
        renderNoMoreCards={renderNoMoreCards}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
    flex: 1,
    backgroundColor: "#fff",
  },
});
