import { useTailwind } from "tailwind-rn";
import React, { useEffect, useState } from 'react'
import BleManager, { Characteristic, PeripheralInfo } from 'react-native-ble-manager'
import { convertString } from 'convert-string'

import { TextInput, Text, TouchableHighlight, View, ScrollView, Button } from 'react-native';

export default function Page() {
  console.log(11)
  const tw = useTailwind();
  const [discoveredPeripherals, setDiscoveredPeripherals] = useState<Array<any>>(null)
  const [connectedPeripheral, setConnectedPeripheral] = useState<PeripheralInfo>(null)
  const [characteristics, setCharacteristics] = useState<Array<Characteristic>>(null)
  const [scanning, setScanning] = useState<boolean>(false)
  const [connecting, setConnecting] = useState<boolean>(false)
  const [retrievingServices, setRetrievingServices] = useState<boolean>(false)

  useEffect(() => {
    BleManager.start({showAlert: false})
  }, [])

  const scan = (seconds:number) => {
    setScanning(true)
    BleManager.scan([], seconds, true)
    setTimeout(() => {
      BleManager.getDiscoveredPeripherals().then((peripheralsArray) => {
        if (peripheralsArray.length > 0) {
          setDiscoveredPeripherals(peripheralsArray)
        }
      })
      setScanning(false)
    }, seconds * 1000)
  }

  const connect = (peripheral:PeripheralInfo) => {
    setConnecting(true)
    BleManager.connect(peripheral.id).then(() => {
      setConnectedPeripheral(peripheral)
      setRetrievingServices(true)
      BleManager.retrieveServices(peripheral.id).then((peripheralInfo: PeripheralInfo ) => {
        setCharacteristics(peripheralInfo.characteristics)
        setRetrievingServices(false)
      })
      setConnecting(false)
    }).catch((error) => {
      console.log(error);
      setConnecting(false)
    })
  }

  const disconnect = () => {
    BleManager.disconnect(connectedPeripheral.id).then(() => {
      setConnectedPeripheral(null)
    })
  }

  // const write = (data:string) => {
  //   const byteData = convertString.stringToBytes(data)
  //   BleManager.write(connectedPeripheral.id, service, characteristic, byteData)
  // }

  return (
    <View style={tw('py-1 items-center')}>
      <Text style={tw('h-1/6')}>BLE scanner</Text>
      <View style={tw('h-4/6')}>
        <Text>Results:</Text>
        <ScrollView>
          {discoveredPeripherals && discoveredPeripherals.map((peripheral) => (
            <TouchableHighlight key={peripheral.id} onPress={() => connect(peripheral)}>
              <View>
                <Text>{peripheral.name ? peripheral.name : peripheral.id}</Text><Text>connect</Text>
              </View>
            </TouchableHighlight>
          ))}
          </ScrollView>
        </View>
        <View style={tw('h-1/6 items-center justify-center')}>
          <Button title={scanning ? "Scanning ..." : "Scan"} onPress={() => scan(3)} />
          {connecting &&
            <Text>Connecting ...</Text>
          }
          {connectedPeripheral &&
            <>
              <Text>Connected to {connectedPeripheral.name ? connectedPeripheral.name : connectedPeripheral.id}</Text>
              {retrievingServices && <Text>Fetching Characteristics ...</Text>}
              {characteristics && 
                <>
                  <Text>Characteristics:</Text>
                  {characteristics.map((characteristic) => (
                    <View key={characteristic.characteristic}>
                      <Text>ID: {characteristic.characteristic}</Text>
                      {/* <Text>Notifying: {characteristic.isNotifying.toString()}</Text> */}
                      {/* <Text>Properties: {characteristic.properties.map((property) => (property))}</Text> */}
                      <Text>Service ID: {characteristic.service}</Text>
                    </View>
                  ))}
                </>
              }
              {/* <TextInput onBlur={(e) => write(e.nativeEvent.target.toString())} /> */}
              <Button title="Disconnect" onPress={disconnect}/>
            </>
          }
      </View>
    </View>
  )
}
