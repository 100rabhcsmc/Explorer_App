import {TouchableOpacity, View, Text, StyleSheet} from 'react-native';

const Tasks = ({item, navigation}) => (
  <TouchableOpacity
    style={styles.task}
    onPress={() => navigation.navigate('Detail', {task: item})}>
    <View style={styles.taskInfo}>
      <Text style={styles.title}>{item.title}</Text>
    </View>
    {item.completed ? (
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Text style={{color: 'green'}}>✓</Text>
        <Text style={{marginStart: 8}}>Completed</Text>
      </View>
    ) : (
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Text style={{color: 'red'}}>✗</Text>
        <Text style={{marginStart: 8}}>Incomplete</Text>
      </View>
    )}
  </TouchableOpacity>
);

export default Tasks;

const styles = StyleSheet.create({
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
});
