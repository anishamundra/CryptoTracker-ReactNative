import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import AppStyles from "../styles/AppStyles";

interface FavouriteCrypto {
  docId: string;
  id: string;
  name: string;
  symbol: string;
  price_usd: string;
  percent_change_24h: string;
}

const FavouritesScreen = () => {
  const [favourites, setFavourites] = useState<FavouriteCrypto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchFavourites();
  }, []);

  const fetchFavourites = async () => {
    try {
      setLoading(true);

      const querySnapshot = await getDocs(collection(db, "favourites"));

      const favs: FavouriteCrypto[] = querySnapshot.docs.map((item) => ({
        docId: item.id,
        ...(item.data() as Omit<FavouriteCrypto, "docId">),
      }));

      setFavourites(favs);
    } catch (error) {
      console.error("Error fetching favourites:", error);
      Alert.alert("Error", "Failed to load favourites.");
    } finally {
      setLoading(false);
    }
  };

  const deleteFavourite = async (docId: string, name: string) => {
    try {
      await deleteDoc(doc(db, "favourites", docId));
      setFavourites((prev) => prev.filter((item) => item.docId !== docId));
      Alert.alert("Deleted", `${name} removed from favourites.`);
    } catch (error) {
      console.error("Error deleting favourite:", error);
      Alert.alert("Error", "Failed to delete favourite.");
    }
  };

  const clearAllFavourites = async () => {
    if (favourites.length === 0) return;

    Alert.alert(
      "Clear All",
      "Are you sure you want to remove all favourites?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes",
          style: "destructive",
          onPress: async () => {
            try {
              const querySnapshot = await getDocs(collection(db, "favourites"));

              const deletePromises = querySnapshot.docs.map((item) =>
                deleteDoc(doc(db, "favourites", item.id))
              );

              await Promise.all(deletePromises);
              setFavourites([]);
              Alert.alert("Success", "All favourites cleared.");
            } catch (error) {
              console.error("Error clearing favourites:", error);
              Alert.alert("Error", "Failed to clear favourites.");
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={AppStyles.centered}>
        <ActivityIndicator size="large" color="#4a90e2" />
        <Text style={AppStyles.loadingText}>Loading Favourites...</Text>
      </View>
    );
  }

  return (
    <View style={AppStyles.container}>
      <TouchableOpacity
        style={[
          AppStyles.clearButton,
          favourites.length === 0 && AppStyles.clearButtonDisabled,
        ]}
        onPress={clearAllFavourites}
        disabled={favourites.length === 0}
      >
        <Text style={AppStyles.clearButtonText}>CLEAR ALL</Text>
      </TouchableOpacity>

      {favourites.length === 0 ? (
        <Text style={AppStyles.emptyText}>No favourites added yet.</Text>
      ) : (
        <FlatList
          data={favourites}
          keyExtractor={(item) => item.docId}
          renderItem={({ item }) => (
            <View style={AppStyles.favCard}>
              <View>
                <Text style={AppStyles.favCardName}>{item.name}</Text>
                <Text style={AppStyles.favCardSymbol}>{item.symbol}</Text>
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
              </View>

              <TouchableOpacity
                style={AppStyles.deleteButton}
                onPress={() => deleteFavourite(item.docId, item.name)}
              >
                <Text style={AppStyles.deleteButtonText}>DELETE</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default FavouritesScreen;