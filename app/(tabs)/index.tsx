import { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, Button, StyleSheet } from 'react-native';
import { useAuth } from '../AuthContext';
import { Link } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';

interface Event {
    id: number;
    title: string;
}

export default function HomeScreen() {
    const { isLoggedIn, logout } = useAuth();
    const [events, setEvents] = useState<Event[]>([]);
    const [newEventTitle, setNewEventTitle] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingText, setEditingText] = useState('');


    useEffect(() => {
        if (isLoggedIn) {
            // Заметки
            setEvents([
                { id: 1, title: 'Заметка 1' },
                { id: 2, title: 'Заметка 2' },
            ]);
        }
    }, [isLoggedIn]);

    const startEditing = (event: Event) => {
        setEditingId(event.id);
        setEditingText(event.title);
    };

    const saveEdit = () => {
        if (editingText.trim() !== '') {
            setEvents(currentEvents =>
                currentEvents.map(event =>
                    event.id === editingId ? { ...event, title: editingText } : event
                )
            );
        }
        setEditingId(null);
        setEditingText('');
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditingText('');
    }

    const addEvent = () => {
        if (newEventTitle.trim()) {
            // Исправляем генерацию ID, чтобы избежать дубликатов
            const newId = events.length > 0 ? Math.max(...events.map(e => e.id)) + 1 : 1;
            const newEvent: Event = {
                id: newId,
                title: newEventTitle,
            };
            setEvents([...events, newEvent]);
            setNewEventTitle('');
        }
    };

    const removeEvent = (eventId: number) => { // Принимаем eventId
        setEvents(currentEvents => currentEvents.filter(event => event.id !== eventId));
    };
    if (!isLoggedIn) {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>Пожалуйста, войдите.</Text>
                <Link href="/login" style={styles.button}>
                    Перейти к авторизации
                </Link>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Ежедневник</Text>
            <FlatList
                data={events}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.eventItemContainer}>
                        {editingId === item.id ? (
                            <>
                                <TextInput
                                    style={styles.editInput}
                                    value={editingText}
                                    onChangeText={setEditingText}
                                    autoFocus // Автофокус при начале редактирования
                                />
                                <TouchableOpacity onPress={saveEdit}>
                                    <AntDesign name="save" size={20} color="green" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={cancelEdit}>
                                    <AntDesign name="close" size={20} color="gray" />
                                </TouchableOpacity>
                            </>
                        ) : (
                            <>
                                <Text style={styles.eventItem}>{item.title}</Text>
                                <TouchableOpacity onPress={() => startEditing(item)}>
                                    <AntDesign name="edit" size={20} color="blue" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => removeEvent(item.id)}>
                                    <AntDesign name="closecircleo" size={20} color="red" />
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                )}
            />
            <TextInput
                style={styles.input}
                placeholder="Название новой заметки"
                value={newEventTitle}
                onChangeText={setNewEventTitle}
            />
            <Button title="Добавить заметку" onPress={addEvent} />
            <Button title="Выйти" onPress={logout} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#25292e',
        padding: 20,
    },
    text: {
        color: '#fff',
        fontSize: 24,
        marginBottom: 20,
    },
    eventItemContainer: { // Контейнер для элемента списка
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    eventItem: {
        color: '#fff',
        fontSize: 16, // Добавили размер шрифта
    },
    input: {
        width: '100%',
        padding: 10,
        marginVertical: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
    },
    button: {
        fontSize: 20,
        textDecorationLine: 'underline',
        color: '#fff',
    },
    editInput: {
        flex: 1,
        backgroundColor: 'white',
        color: 'black',
        padding: 1,
        marginRight: 4,
        borderRadius: 4,
    },
});