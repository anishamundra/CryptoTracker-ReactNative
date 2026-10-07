import { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import AppStyles from "../styles/AppStyles";

interface Crypto {
  id: string;
  name: string;
  symbol: string;
  price_usd: string;
  percent_change_24h: string;
}

interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList, "Home">;
}

const HomeScreen = ({ navigation }: Props) => {
  const [cryptos, setCryptos] = useState<Crypto[]>([]);
  const [filteredCryptos, setFilteredCryptos] = useState<Crypto[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchCryptos();
  }, []);

  const fetchCryptos = async () => {
    try {
      const response = await fetch(
        "https://api.coinlore.net/api/tickers/?start=0&limit=50"
      );
      const data = await response.json();
      setCryptos(data.data);
      setFilteredCryptos(data.data);
    } catch (error) {
      console.error("Error fetching cryptos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text: string) => {
    setSearchText(text);

    const filtered = cryptos.filter(
      (item) =>
        item.name.toLowerCase().includes(text.toLowerCase()) ||
        item.symbol.toLowerCase().includes(text.toLowerCase())
    );

    setFilteredCryptos(filtered);
  };

  if (loading) {
    return (
      <View style={AppStyles.centered}>
        <ActivityIndicator size="large" color="#4a90e2" />
        <Text style={AppStyles.loadingText}>Loading Cryptos...</Text>
      </View>
    );
  }

  return (
    <View style={AppStyles.container}>
      <TouchableOpacity
        style={AppStyles.favButton}
        onPress={() => navigation.navigate("Favourites")}
      >
        <Text style={AppStyles.favButtonText}>VIEW FAVOURITES</Text>
      </TouchableOpacity>

      <TextInput
        style={AppStyles.searchInput}
        placeholder="Search by name or symbol..."
        value={searchText}
        onChangeText={handleSearch}
      />

      {filteredCryptos.length === 0 ? (
        <Text style={AppStyles.emptyText}>No cryptocurrencies found.</Text>
      ) : (
        <FlatList
          data={filteredCryptos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={AppStyles.card}
              onPress={() =>
                navigation.navigate("CryptoDetail", { id: item.id })
              }
            >
              <Text style={AppStyles.cryptoName}>{item.name}</Text>
              <Text style={AppStyles.cryptoSymbol}>{item.symbol}</Text>
              <Text style={AppStyles.cryptoPrice}>${item.price_usd}</Text>
              <Text
                style={[
                  AppStyles.cryptoChange,
                  {
                    color:
                      parseFloat(item.percent_change_24h) >= 0
                        ? "#4caf50"
                        : "#f44336",
                  },
                ]}
              >
                {item.percent_change_24h}% (24h)
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

export default HomeScreen;