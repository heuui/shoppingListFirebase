import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getDatabase, push, ref, onValue, remove } from'firebase/database';

export default function App() {

  const firebaseConfig = {
    apiKey: "AIzaSyDHNqj_4khEAeHceJW8dWZRSIegL_GucLE",
    authDomain: "shoppinglist-b85bf.firebaseapp.com",
    databaseURL: "https://shoppinglist-b85bf-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "shoppinglist-b85bf",
    storageBucket: "shoppinglist-b85bf.appspot.com",
    messagingSenderId: "954403980430",
    appId: "1:954403980430:web:e8088c49ae9cbe52b775df"
  };
  
  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);
  ref(database,'items/')

  const [product, setProduct] = useState('');
  const [amount, setAmount] = useState('');
  const [items, setItems] = useState([]);

  useEffect(() => {
    const itemsRef = ref(database,'items/');
    onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();
      const items = data ? Object.keys(data).map(key => ({ key, ...data[key]})) : [];
      setItems(items);
    })
  }, []);

  const saveItem = () => {
    push(
      ref(database,'items/'),
      { 'product': product, 'amount': amount }
    );
    setProduct('');
    setAmount('');
  }

  const deleteItem = (key) => {
    const itemsRef = ref(database, `items/${key}`);
    remove(itemsRef);
  }

  const listSeparator = () => {
    return (
      <View
        style={{
          height: 5,
          width: "80%",
          backgroundColor: "#fff",
          marginLeft: "10%"
        }}
      />
    );
  };


  return (
    <View style={styles.container}>
      <TextInput
        placeholder='Product'
        style={styles.textbox}
        onChangeText={(product) => setProduct(product)}
        value={product}
      />
      <TextInput
        placeholder='Amount'
        style={{ marginTop: 5, marginBottom: 5,  fontSize:18, width: 200, borderColor: 'gray', borderWidth: 1}}
        onChangeText={(amount) => setAmount(amount)}
        value={amount}
      />
      <Button
        title='Save'
        onPress={saveItem}
      />
      <Text style={{marginTop: 30, fontSize: 20}}>Shopping list</Text>
      <FlatList
        style={styles.flatlist}
        keyExtractor={item => item.key}
        renderItem={({item}) => 
        <View style={styles.flatlist}>
          <Text 
            style={{fontSize: 18}}>{item.product}, {item.amount} 
          </Text>
          <Text 
            style={{fontSize: 18, color: '#0000ff'}} 
            onPress={() => deleteItem(item.key)}> Delete
          </Text>
        </View>}
        data={items}
        ItemSeparatorComponent={listSeparator} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textbox: {
    marginTop: 30,
    fontSize: 18,
    width: 200,
    borderColor: 'gray',
    borderWidth: 1
  },
  flatlist: {
    flexDirection: 'row',
    marginTop: 10,
   },
});
