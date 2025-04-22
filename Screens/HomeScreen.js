import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View, StyleSheet, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const FILTERS = {
  ALL: 'All',
  COMPLETED: 'Completed',
  INCOMPLETE: 'Incomplete',
};

const HomeScreen = ({ navigation }) => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState(FILTERS.ALL);

  const fetchTasks = async () => {
    setLoading(true);
    setError(false);
    try {
      const saved = await AsyncStorage.getItem('tasks');
      if (saved) {
        const parsed = JSON.parse(saved);
        setTasks(parsed);
        setFilteredTasks(applyFilter(parsed, filter));
        setLoading(false);
        return;
      }
      const response = await fetch('https://jsonplaceholder.typicode.com/todos');
      const data = await response.json();
      setTasks(data);
      setFilteredTasks(applyFilter(data, filter));
      await AsyncStorage.setItem('tasks', JSON.stringify(data));
    } catch (e) {
      console.error(e);
      setError(true);
    }
    setLoading(false);
  };

  const applyFilter = (tasks, filter) => {
    switch (filter) {
      case FILTERS.COMPLETED:
        return tasks.filter((t) => t.completed);
      case FILTERS.INCOMPLETE:
        return tasks.filter((t) => !t.completed);
      default:
        return tasks;
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    setFilteredTasks(applyFilter(tasks, filter));
  }, [filter, tasks]);

  const renderTask = ({ item }) => (
    <TouchableOpacity style={styles.task} onPress={() => navigation.navigate('Detail', { task: item })}>
      <View style={styles.taskInfo}>
        <Text style={styles.title}>{item.title}</Text>
       
      </View>
      {item.completed ? (
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
    </TouchableOpacity>
  );

  if (loading) return <ActivityIndicator style={styles.centered} size="large" />;
  if (error)
    return (
      <View style={styles.centered}>
        <Text>Something went wrong.</Text>
        <Button title="Retry" onPress={fetchTasks} />
      </View>
    );

  return (
 <View style={styles.container}>
  <FlatList
    data={filteredTasks}
    renderItem={renderTask}
    keyExtractor={(item) => item.id.toString()}
    ListHeaderComponent={
      <View style={styles.filterContainer}>
        {Object.values(FILTERS).map((f) => (
          <Button
            key={f}
            title={f}
            onPress={() => setFilter(f)}
            color={filter === f ? 'blue' : 'gray'}
          />
        ))}
      </View>
    }
  />
</View>

  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  task: {
    padding: 16,
    marginVertical: 8,
    borderWidth: 1, 
    borderRadius: 8,
    borderColor: '#001a33',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
});