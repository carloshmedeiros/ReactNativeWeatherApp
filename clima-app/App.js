import React from 'react';
import { useState, useEffect } from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { Feather } from '@expo/vector-icons';
import { Foundation } from '@expo/vector-icons'; 
import * as Location from 'expo-location'
import getClima from './Api'
import moment from 'moment';

export default function App() {

  const [temperatura, settemperatura] = useState('16')

  const [cordenadas, setcordenadas] = useState(null);

  const [região, setregião] = useState('BR,  Curitiba')

  const [temaNoite, settemaNoite] = useState(false)

  const [temaTarde, settemaTarde] = useState(false)

  const [horarioatual, sethorarioatual] = useState(' 00:00 pm');

  const [diaSemana, setdiaSemana] = useState('');
  
  const [textostatus, settextostatus] = useState('');

  const [periodoicon, seperiodoicon] = useState('');

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: temaNoite ? '#677099' : temaTarde ? '#F5A714' : '#F5F475',
      alignItems: 'center',
    },
    information: {
      fontSize: 12,
      marginTop: 50,
      alignSelf: 'center',
    },
    infobloco: {
      marginTop: 50,
      flex: 2,
      width: 450,
      backgroundColor: '#F2F2F2'
    },
    recarregar: {
      margin: 30,
    },
    recarregaricon: {
      color: temaNoite ? '#33384D' : temaTarde ? '#8C5F0B' : '#8C8C43',    
    },
    painelTemp: {
      alignItems: 'center',
      flexDirection: 'row',
    },
    textotemp: {
      color: temaNoite ? '#33384D' : temaTarde ? '#8C5F0B' : '#8C8C43',
      fontSize: 100,
      marginTop: 0,
    },
    textostatus: {
      marginTop: 40,
      alignSelf: 'center',
      color: '#232634',
      fontSize: 50,
    },
    textodia: {
      marginTop: 0,
      alignSelf: 'center',
      color: temaNoite ? '#3C4159' : temaTarde ? '#99680C' : '#999949',
      fontSize: 20,
      fontWeight: '100'
    },
    textolocal: {
      color: temaNoite ? '#33384D' : temaTarde ? '#8C5F0B' : '#8C8C43',
      fontSize: 40,
      marginTop: 120,
      fontWeight: '400'
    },
    periodoicon: {
      color: temaNoite ? '#677099' : temaTarde ? '#F5A714' : '#8C8C43',
      marginTop: 30,
      alignSelf: 'center'
    },
  });

  async function getLocation() {
    let { status } = await Location.requestForegroundPermissionsAsync()
    if (status !== 'granted') {
      setErrorMsg('ERROR: Permissão não concedida!')
    } else {
      let location = await Location.getCurrentPositionAsync({})
      await setcordenadas(location.coords)
    }
  }

  async function setClima() {
    await getLocation()
    const data = await getClima(cordenadas)
    settemperatura(conversor(data[0]))
    setregião(data[1])

    var date = moment()
    .format(' hh:mm a');
    sethorarioatual(date);
  }

  function conversor(kelvin) {
    return parseInt(kelvin - 273)
  }
  
  useEffect(() => {
    setClima()
    var hours = new Date().getHours();

    if (hours < 7) {
      settemaTarde(false)
      settemaNoite(true) 
      settextostatus('Noite')
      seperiodoicon('moon')

    }
    if (hours > 6 && hours < 13) {
      settemaTarde(false)
      settemaNoite(false)
      settextostatus('Manhã')
      seperiodoicon('sunrise')
    }
    if (hours > 12 && hours < 18) {
      settemaTarde(true)
      settemaNoite(false)
      settextostatus('Tarde')
      seperiodoicon('sunset')
    }
    if (hours > 17) {
      settemaTarde(false)
      settemaNoite(true)
      settextostatus('Noite')
      seperiodoicon('moon')
    }

    var day = moment()
    .weekday();

    if (day = 1){
      setdiaSemana('Domingo');
    }if (day = 2){
      setdiaSemana('Segunda');
    }if (day = 3){
      setdiaSemana('Terça');
    }if (day = 4){
      setdiaSemana('Quarta');
    }if (day = 5){
      setdiaSemana('Quinta');
    }if (day = 6){
      setdiaSemana('Sexta');
    }if (day = 7){
      setdiaSemana('Sábado');
    }
  }, [])

  return (
    <View style={styles.container}>

      <Text style={styles.textolocal}>{região}</Text>
      <Text style={styles.textodia}>{diaSemana}, {horarioatual}</Text>

      <View style={styles.painelTemp}>
        <Text style={styles.textotemp}>{temperatura}</Text>
        <Text style={[styles.textotemp, { fontSize: 20 }]}>°C</Text>
      </View>

      <TouchableOpacity style={styles.recarregar} onPress={() => setClima()}>
        <Foundation style={styles.recarregaricon} name="refresh" size={50} />
      </TouchableOpacity>

      <View style={styles.infobloco}>
        <Text style={styles.textostatus}>{textostatus}</Text>
        <Feather style={styles.periodoicon} name={periodoicon} size={100}/>
        <Text style={styles.information}>Clique no botão de recarregar para atualizar temperatura, local e hora.</Text>
        </View>
    </View>
  );
}

