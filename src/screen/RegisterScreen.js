import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/colors';
import { AuthContext } from '../context/AuthContext';
import { UserPlus, User, Lock, BookOpen } from 'lucide-react-native';

export default function RegisterScreen({ navigation }) {
    const { register } = useContext(AuthContext);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleRegister = async () => {
        if (!name || !email || !password || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        try {
            await register(name, email, password);
        } catch (e) {
            Alert.alert('Registration Failed', e.message);
        }
    };

    return (
        <LinearGradient
            colors={['#ffa6c9', '#f94f8a']}
            style={styles.container}
        >
            <SafeAreaView style={styles.safeArea}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.keyboardView}
                >
                    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                        <View style={styles.header}>
                            <View style={styles.logoContainer}>
                                <BookOpen size={40} color="#f94f8a" />
                            </View>
                            <Text style={styles.appName}>StudySync</Text>
                            <Text style={styles.appSubtitle}>Academic Life Planner</Text>
                        </View>

                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>สมัครสมาชิก</Text>

                            <View style={styles.inputWrapper}>
                                <View style={styles.labelContainer}>
                                    <UserPlus size={16} color="#888" />
                                    <Text style={styles.label}>ชื่อ-นามสกุล</Text>
                                </View>
                                <TextInput
                                    style={styles.input}
                                    placeholder="เช่น สมชาย ใจดี"
                                    placeholderTextColor="#ccc"
                                    value={name}
                                    onChangeText={setName}
                                />
                            </View>

                            <View style={styles.inputWrapper}>
                                <View style={styles.labelContainer}>
                                    <User size={16} color="#888" />
                                    <Text style={styles.label}>ชื่อผู้ใช้</Text>
                                </View>
                                <TextInput
                                    style={styles.input}
                                    placeholder="อย่างน้อย 3 ตัวอักษร"
                                    placeholderTextColor="#ccc"
                                    value={email}
                                    onChangeText={setEmail}
                                    autoCapitalize="none"
                                />
                            </View>

                            <View style={styles.inputWrapper}>
                                <View style={styles.labelContainer}>
                                    <Lock size={16} color="#888" />
                                    <Text style={styles.label}>รหัสผ่าน</Text>
                                </View>
                                <TextInput
                                    style={styles.input}
                                    placeholder="อย่างน้อย 6 ตัวอักษร"
                                    placeholderTextColor="#ccc"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                />
                            </View>

                            <View style={styles.inputWrapper}>
                                <View style={styles.labelContainer}>
                                    <Lock size={16} color="#888" />
                                    <Text style={styles.label}>ยืนยันรหัสผ่าน</Text>
                                </View>
                                <TextInput
                                    style={styles.input}
                                    placeholder="กรอกรหัสผ่านอีกครั้ง"
                                    placeholderTextColor="#ccc"
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry
                                />
                            </View>

                            <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                                <Text style={styles.registerButtonText}>สมัครสมาชิก</Text>
                            </TouchableOpacity>

                            <View style={styles.loginContainer}>
                                <Text style={styles.loginText}>มีบัญชีอยู่แล้ว? </Text>
                                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                    <Text style={styles.loginLink}>เข้าสู่ระบบ</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        padding: 24,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 10,
    },
    logoContainer: {
        width: 80,
        height: 80,
        backgroundColor: '#fff',
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    appName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 5,
    },
    appSubtitle: {
        fontSize: 16,
        color: '#fff',
        opacity: 0.9,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    cardTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 20,
    },
    inputWrapper: {
        marginBottom: 15,
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    label: {
        fontSize: 14,
        color: '#555',
        marginLeft: 8,
        fontWeight: '500',
    },
    input: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 12,
        paddingHorizontal: 15,
        height: 50,
        fontSize: 14,
        color: '#333',
        backgroundColor: '#F9F9F9',
    },
    registerButton: {
        backgroundColor: '#d85784',
        borderRadius: 12,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    registerButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 5,
    },
    loginText: {
        color: '#666',
        fontSize: 14,
    },
    loginLink: {
        color: '#d85784',
        fontSize: 14,
        fontWeight: 'bold',
    },
});
