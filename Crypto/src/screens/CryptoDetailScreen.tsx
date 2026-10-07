import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { RootStackParamList } from "../types/navigation";
import AppStyles from "../styles/AppStyles";

interface CryptoDetail {
  id: string;
  name: string;
  symbol: string;
  price_usd: string;
  percent_change_24h: string;
  percent_change_7d: string;
  market_cap_usd: string;
  volume24: number;
  csupply: string;
  tsupply: string;
  msupply: string;
}

interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList, "CryptoDetail">;
  route: RouteProp<RootStackParamList, "CryptoDetail">;
}

const CryptoDetailScreen = ({ navigation, route }: Props) => {
  const { id } = route.params;
  const [crypto, setCrypto] = useState<CryptoDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchCryptoDetail();
  }, []);

  const fetchCryptoDetail = async () => {
    try {
      const response = await fetch(
        `https://api.coinlore.net/api/ticker/?id=${id}`
      );
      const data = await response.json();
      setCrypto(data[0]);
    } catch (error) {
      console.error("Error fetching crypto detail:", error);
    } finally {
      setLoading(false);
    }
  };

  const addToFavourites = async () => {
    if (!crypto) return;

    try {
      const q = query(
        collection(db, "favourites"),
        where("id", "==", crypto.id)
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        Alert.alert("Already Added", `${crypto.name} is already in favourites.`);
        return;
      }

      await addDoc(collection(db, "favourites"), {
        id: crypto.id,
        name: crypto.name,
        symbol: crypto.symbol,
        price_usd: crypto.price_usd,
        percent_change_24h: crypto.percent_change_24h,
      });

      Alert.alert("Success", `${crypto.name} added to favourites!`);
    } catch (error) {
      console.error("Error adding to favourites:", error);
      Alert.alert("Error", "Failed to add to favourites.");
    }
  };

  if (loading) {
    return (
      <View style={AppStyles.centered}>
        <ActivityIndicator size="large" color="#4a90e2" />
        <Text style={AppStyles.loadingText}>Loading Details...</Text>
      </View>
    );
  }

  if (!crypto) {
    return (
      <View style={AppStyles.centered}>
        <Text style={AppStyles.loadingText}>No data found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={AppStyles.detailContainer}>
      <View style={AppStyles.detailCard}>
        <Text style={AppStyles.detailTitle}>{crypto.name}</Text>
        <Text style={AppStyles.detailSymbol}>{crypto.symbol}</Text>

        <View style={AppStyles.detailRow}>
          <Text style={AppStyles.detailLabel}>Price (USD)</Text>
          <Text style={AppStyles.detailValue}>${crypto.price_usd}</Text>
        </View>

        <View style={AppStyles.detailRow}>
          <Text style={AppStyles.detailLabel}>Change (24h)</Text>
          <Text
            style={[
              AppStyles.detailValue,
              {
                color:
                  parseFloat(crypto.percent_change_24h) >= 0
                    ? "#4caf50"
                    : "#f44336",
              },
            ]}
          >
            {crypto.percent_change_24h}%
          </Text>
        </View>

        <View style={AppStyles.detailRow}>
          <Text style={AppStyles.detailLabel}>Change (7d)</Text>
          <Text
            style={[
              AppStyles.detailValue,
              {
                color:
                  parseFloat(crypto.percent_change_7d) >= 0
                    ? "#4caf50"
                    : "#f44336",
              },
            ]}
          >
            {crypto.percent_change_7d}%
          </Text>
        </View>

        <View style={AppStyles.detailRow}>
          <Text style={AppStyles.detailLabel}>Market Cap</Text>
          <Text style={AppStyles.detailValue}>${crypto.market_cap_usd}</Text>
        </View>

        <View style={AppStyles.detailRow}>
          <Text style={AppStyles.detailLabel}>Volume (24h)</Text>
          <Text style={AppStyles.detailValue}>${crypto.volume24}</Text>
        </View>

        <View style={AppStyles.detailRow}>
          <Text style={AppStyles.detailLabel}>Circulating Supply</Text>
          <Text style={AppStyles.detailValue}>{crypto.csupply}</Text>
        </View>

        <View style={AppStyles.detailRow}>
          <Text style={AppStyles.detailLabel}>Total Supply</Text>
          <Text style={AppStyles.detailValue}>{crypto.tsupply}</Text>
        </View>

        <View style={AppStyles.detailRow}>
          <Text style={AppStyles.detailLabel}>Max Supply</Text>
          <Text style={AppStyles.detailValue}>
            {crypto.msupply ? crypto.msupply : "N/A"}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={AppStyles.favouriteButton}
        onPress={addToFavourites}
      >
        <Text style={AppStyles.favouriteButtonText}>♥ ADD TO FAVOURITES</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default CryptoDetailScreen;