import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DetailScreen = ({ route }) => {
  const [task, setTask] = useState(route.params.task);

  const toggleStatus = async () => {
    const updated = { ...task, completed: !task.completed };
    setTask(updated);
    try {
      const stored = await AsyncStorage.getItem('tasks');
      if (stored) {
        const tasks = JSON.parse(stored).map((t) => (t.id === updated.id ? updated : t));
        await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ padding: 16,marginVertical: 8,borderWidth: 1,borderRadius: 8,borderColor: '#001a33'}}>
       <Text style={styles.title}>Title: {task.title}</Text>
      <Text>User ID: {task.userId}</Text>
       {task.completed ? (
        <View style={{flexDirection:"row",alignItems:"center"}}>
         <Text style={{color:"green"}}>✓</Text>
         <Text style={{marginStart:8}}>Completed</Text>
         </View>
      ) : (
         <View style={{flexDirection:"row",alignItems:"center"}}>
         <Text style={{color:"red"}}>✗</Text>
         <Text style={{marginStart:8}}>Incomplete</Text>
         </View>
      )}
      </View>
      <Button title="Toggle Status" onPress={toggleStatus} />
    </View>
  );
};

export default DetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
  },
});
