import React, { useState, useEffect } from "react";
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

const CANDIDATES = Array.from({length:30}, (_,i)=>({ id: (i+1).toString(), name: `Miss ${i+1}` }));

function IdentityScreen({navigation}){
  const [firstName, setFirstName] = useState("");
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Miss Francine Game</Text>
      <Text style={styles.subtitle}>Entrez votre prénom</Text>
      <TextInput style={styles.input} placeholder="Prénom" value={firstName} onChangeText={setFirstName} />
      <TouchableOpacity style={styles.button} onPress={()=>{
        if(!firstName.trim()){ Alert.alert("Prénom requis"); return; }
        navigation.navigate("Top5",{firstName});
      }}>
        <Text style={styles.buttonText}>Suivant</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

function Top5Screen({navigation, route}){
  const { firstName } = route.params;
  const [selections, setSelections] = useState(Array(5).fill(""));
  const options = CANDIDATES;
  const available = (index)=> options.filter(o => !selections.includes(o.id) || selections[index]===o.id);
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Top 5 — Miss France</Text>
      <Text style={styles.subtitle}>Choisissez 5 candidates dans l'ordre</Text>
      <ScrollView style={{width:'100%'}}>
        {Array.from({length:5}).map((_,i)=>(
          <View key={i} style={styles.pickerRow}>
            <Text style={styles.pickerLabel}>{i+1}.</Text>
            <View style={styles.pickerWrap}>
              <Picker selectedValue={selections[i]} onValueChange={(val)=>{ const s=[...selections]; s[i]=val; setSelections(s); }}>
                <Picker.Item label="— Choisir —" value="" />
                {available(i).map(opt=> <Picker.Item key={opt.id} label={`${opt.name} (${opt.id})`} value={opt.id} />)}
              </Picker>
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={styles.rowButtons}>
        <TouchableOpacity style={styles.backBtn} onPress={()=>navigation.goBack()}><Text style={styles.backText}>Précédent</Text></TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={()=>{
          if(selections.some(s=>!s)){ Alert.alert("Sélection incomplète","Veuillez remplir les 5 choix"); return; }
          navigation.navigate("Top10",{firstName, top5: selections});
        }}><Text style={styles.buttonText}>Suivant</Text></TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function Top10Screen({navigation, route}){
  const { firstName, top5 } = route.params;
  const [selections, setSelections] = useState(Array(10).fill(""));
  const options = CANDIDATES.filter(c=>!top5.includes(c.id));
  const available = (index)=> options.filter(o => !selections.includes(o.id) || selections[index]===o.id);
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Top 10 — Miss Francine</Text>
      <Text style={styles.subtitle}>Choisissez 10 candidates (éliminées)</Text>
      <ScrollView style={{width:'100%'}}>
        {Array.from({length:10}).map((_,i)=>(
          <View key={i} style={styles.pickerRow}>
            <Text style={styles.pickerLabel}>{i+1}.</Text>
            <View style={styles.pickerWrap}>
              <Picker selectedValue={selections[i]} onValueChange={(val)=>{ const s=[...selections]; s[i]=val; setSelections(s); }}>
                <Picker.Item label="— Choisir —" value="" />
                {available(i).map(opt=> <Picker.Item key={opt.id} label={`${opt.name} (${opt.id})`} value={opt.id} />)}
              </Picker>
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={styles.rowButtons}>
        <TouchableOpacity style={styles.backBtn} onPress={()=>navigation.goBack()}><Text style={styles.backText}>Précédent</Text></TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={()=>{
          if(selections.some(s=>!s)){ Alert.alert("Sélection incomplète","Veuillez remplir les 10 choix"); return; }
          navigation.navigate("Passages",{firstName, top5, top10: selections});
        }}><Text style={styles.buttonText}>Suivant</Text></TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function PassagesScreen({navigation, route}){
  const { firstName, top5, top10 } = route.params;
  const [passedT1, setPassedT1] = useState([]);
  const toggle = (id,setArr,arr)=> setArr(prev=> prev.includes(id)? prev.filter(x=>x!==id): [...prev,id]);
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Concours — Passages</Text>
      <Text style={styles.subtitle}>Tape une candidate pour la marquer comme passée</Text>
      <ScrollView style={{width:'100%'}}>
        {CANDIDATES.map(c => (
          <TouchableOpacity key={c.id} style={[styles.card, passedT1.includes(c.id)&&{backgroundColor:'#ffe6f0'}]} onPress={()=>toggle(c.id,setPassedT1,passedT1)}>
            <Text style={styles.cardText}>{c.name} ({c.id}) — T1: {passedT1.includes(c.id)?'✓':'—'}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.rowButtons}>
        <TouchableOpacity style={styles.backBtn} onPress={()=>navigation.goBack()}><Text style={styles.backText}>Précédent</Text></TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={async ()=>{
          // save all data to AsyncStorage
          const payload = { firstName, top5, top10, passedT1 };
          try{ await AsyncStorage.setItem('@missfrancine_profile', JSON.stringify(payload)); Alert.alert('Enregistré','Tes pronostics ont été enregistrés localement'); navigation.navigate('Summary',{payload}); }
          catch(e){ Alert.alert('Erreur','Impossible de sauvegarder'); }
        }}><Text style={styles.buttonText}>Terminer & Sauvegarder</Text></TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function SummaryScreen({route}){
  const { payload } = route.params;
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Récapitulatif</Text>
      <Text style={styles.subtitle}>Merci {payload.firstName}</Text>
      <Text style={{marginTop:12,fontWeight:'700'}}>Top 5</Text>
      {payload.top5.map((id,i)=><Text key={i}>{i+1}. Miss {id}</Text>)}
      <Text style={{marginTop:8,fontWeight:'700'}}>Top 10 Miss Francine</Text>
      {payload.top10.map((id,i)=><Text key={i}>{i+1}. Miss {id}</Text>)}
      <TouchableOpacity style={[styles.button,{marginTop:20}]} onPress={()=>Alert.alert('Fini','Tu peux fermer l’application') }><Text style={styles.buttonText}>Fermer</Text></TouchableOpacity>
    </SafeAreaView>
  );
}

export default function App(){ return (<NavigationContainer><Stack.Navigator screenOptions={{headerShown:false}}><Stack.Screen name="Identity" component={IdentityScreen} /><Stack.Screen name="Top5" component={Top5Screen} /><Stack.Screen name="Top10" component={Top10Screen} /><Stack.Screen name="Passages" component={PassagesScreen} /><Stack.Screen name="Summary" component={SummaryScreen} /></Stack.Navigator></NavigationContainer>); }

const styles = { container:{flex:1,alignItems:'center',backgroundColor:'#fff6fb',padding:16}, title:{fontSize:24,fontWeight:'800',color:'#b32f6b',marginTop:16}, subtitle:{fontSize:14,color:'#8a2a4a',marginTop:8,marginBottom:12}, input:{width:'100%',backgroundColor:'#fff',padding:12,borderRadius:10,borderWidth:1,borderColor:'#f1cbe0',marginTop:12}, button:{backgroundColor:'#c61f72',padding:12,borderRadius:10,marginTop:12,width:160,alignItems:'center'}, buttonText:{color:'#fff',fontWeight:'700'}, backBtn:{borderWidth:1,borderColor:'#c61f72',padding:10,borderRadius:10,width:120,alignItems:'center'}, backText:{color:'#a12b5f',fontWeight:'700'}, rowButtons:{flexDirection:'row',justifyContent:'space-between',width:'100%',marginTop:12}, pickerRow:{flexDirection:'row',alignItems:'center',paddingVertical:6}, pickerLabel:{width:28,fontWeight:'700',color:'#6b183f'}, pickerWrap:{flex:1,backgroundColor:'#fff',borderRadius:8,borderWidth:1,borderColor:'#f1cbe0'}, card:{width:'100%',padding:12,backgroundColor:'#fff',borderRadius:8,marginBottom:6,borderWidth:1,borderColor:'#f5dbe6'}, cardText:{color:'#5a1236'} };
