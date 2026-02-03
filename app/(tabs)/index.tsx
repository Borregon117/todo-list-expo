import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  KeyboardAvoidingView, 
  Platform, 
  Keyboard,
  Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// 1. Definimos una paleta de colores suaves
const COLORS = [
  '#FFFFFF', // Blanco (Default)
  '#FFD1DC', // Rosa Pastel
  '#FFFACD', // Amarillo Pastel
  '#D4F1F4', // Azul Pastel
  '#E2F0CB', // Verde Pastel
];

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  color: string; // Nuevo campo para el color
}

export default function App() {
  const [task, setTask] = useState<string>('');
  const [todoList, setTodoList] = useState<Todo[]>([]);
  
  // Estados para la edición y color
  const [selectedColor, setSelectedColor] = useState<string>(COLORS[0]);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Función principal: Maneja tanto CREAR como ACTUALIZAR
  const handleAddOrUpdateTask = () => {
    if (task.trim().length === 0) {
      Alert.alert('Error', 'Por favor escribe una tarea.');
      return;
    }

    if (editingId) {
      // --- LÓGICA DE ACTUALIZACIÓN ---
      setTodoList(todoList.map(item => 
        item.id === editingId 
          ? { ...item, text: task, color: selectedColor } 
          : item
      ));
      setEditingId(null); // Salimos del modo edición
    } else {
      // --- LÓGICA DE CREACIÓN ---
      const newTodo: Todo = {
        id: Date.now().toString(),
        text: task,
        completed: false,
        color: selectedColor,
      };
      setTodoList([...todoList, newTodo]);
    }

    // Limpieza final
    setTask('');
    setSelectedColor(COLORS[0]); // Resetear color a blanco
    Keyboard.dismiss();
  };

  // Función para preparar la edición
  const startEditing = (item: Todo) => {
    setTask(item.text);            // Poner el texto actual en el input
    setSelectedColor(item.color);  // Poner el color actual en el selector
    setEditingId(item.id);         // Activar modo edición
  };

  const toggleComplete = (id: string) => {
    setTodoList(
      todoList.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const deleteTask = (id: string) => {
    setTodoList(todoList.filter((item) => item.id !== id));
    // Si borramos la tarea que se estaba editando, limpiamos el input
    if (editingId === id) {
      setEditingId(null);
      setTask('');
      setSelectedColor(COLORS[0]);
    }
  };

  const renderItem = ({ item }: { item: Todo }) => (
    <View style={[styles.itemContainer, { backgroundColor: item.color }]}>
      <View style={styles.itemLeft}>
        <TouchableOpacity 
          style={[styles.square, item.completed && styles.squareCompleted]} 
          onPress={() => toggleComplete(item.id)}
        >
          {item.completed && <Ionicons name="checkmark" size={16} color="#FFF" />}
        </TouchableOpacity>
        
        <Text style={[styles.itemText, item.completed && styles.itemTextCompleted]}>
          {item.text}
        </Text>
      </View>

      <View style={styles.itemActions}>
        {/* Botón de Editar */}
        <TouchableOpacity onPress={() => startEditing(item)} style={styles.actionButton}>
          <Ionicons name="pencil" size={20} color="#4A4A4A" />
        </TouchableOpacity>

        {/* Botón de Borrar */}
        <TouchableOpacity onPress={() => deleteTask(item.id)} style={styles.actionButton}>
          <Ionicons name="trash-outline" size={22} color="#FF5C5C" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
        <Text style={styles.sectionTitle}>Mis Tareas</Text>
      </View>

      <View style={styles.items}>
        {todoList.length === 0 ? (
          <Text style={styles.emptyText}>No tienes tareas pendientes.</Text>
        ) : (
          <FlatList
            data={todoList}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 150 }} // Espacio extra al final
          />
        )}
      </View>

      {/* Sección de Input y Color */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.writeTaskWrapper}
      >
        {/* Selector de Colores Flotante */}
        <View style={styles.colorPalette}>
          {COLORS.map((color) => (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorCircle, 
                { backgroundColor: color },
                selectedColor === color && styles.colorCircleSelected // Borde si está seleccionado
              ]}
              onPress={() => setSelectedColor(color)}
            />
          ))}
        </View>

        <View style={styles.inputRow}>
          <TextInput 
            style={styles.input} 
            placeholder={editingId ? "Editando tarea..." : "Escribe una tarea"} 
            value={task} 
            onChangeText={text => setTask(text)} 
          />
          
          <TouchableOpacity onPress={handleAddOrUpdateTask}>
            <View style={[styles.addWrapper, editingId ? styles.editWrapper : {}]}>
              <Ionicons 
                name={editingId ? "checkmark" : "add"} 
                size={30} 
                color="#FFF" 
              />
            </View>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8EAED',
  },
  headerWrapper: {
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  items: {
    marginTop: 30,
    paddingHorizontal: 20,
    flex: 1,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#C0C0C0',
    fontSize: 16,
  },
  itemContainer: {
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    // Sombra suave para que los colores resalten
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    flex: 1,
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    marginLeft: 10,
    padding: 5,
  },
  square: {
    width: 24,
    height: 24,
    backgroundColor: '#55BCF6',
    opacity: 0.4,
    borderRadius: 5,
    marginRight: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  squareCompleted: {
    opacity: 1,
    backgroundColor: '#55BCF6',
  },
  itemText: {
    maxWidth: '100%',
    fontSize: 15,
  },
  itemTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#A0A0A0',
  },
  
  // --- Estilos de la zona de escritura y colores ---
  writeTaskWrapper: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  colorPalette: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 10,
    borderRadius: 20,
    marginBottom: 10,
    justifyContent: 'center',
    gap: 10, // Espacio entre círculos
  },
  colorCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 2,
  },
  colorCircleSelected: {
    borderWidth: 3,
    borderColor: '#55BCF6', // Azul para indicar selección
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },
  input: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#FFF',
    borderRadius: 60,
    borderColor: '#C0C0C0',
    borderWidth: 1,
    flex: 1, // Ocupa todo el espacio menos el botón
    marginRight: 15,
    elevation: 2,
  },
  addWrapper: {
    width: 60,
    height: 60,
    backgroundColor: '#55BCF6',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#C0C0C0',
    borderWidth: 1,
    elevation: 5,
  },
  editWrapper: {
    backgroundColor: '#4CD964', // Verde cuando estamos editando
  },
});