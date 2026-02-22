import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/colors';
import { AuthContext } from '../context/AuthContext';
import { User, Lock, BookOpen } from 'lucide-react-native';

export default function LoginScreen({ navigation }) {
    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        try {
            await login(email, password);
        } catch (e) {
            Alert.alert('Login Failed', e.message);
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
                    <View style={styles.content}>
                        <View style={styles.header}>
                            <View style={styles.logoContainer}>
                                <BookOpen size={40} color="#f94f8a" />
                            </View>
                            <Text style={styles.appName}>StudySync</Text>
                            <Text style={styles.appSubtitle}>Academic Life Planner</Text>
                        </View>

                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>เข้าสู่ระบบ</Text>

                            <View style={styles.inputWrapper}>
                                <View style={styles.labelContainer}>
                                    <User size={16} color="#888" />
                                    <Text style={styles.label}>ชื่อผู้ใช้</Text>
                                </View>
                                <TextInput
                                    style={styles.input}
                                    placeholder="กรอกชื่อผู้ใช้"
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
                                    placeholder="กรอกรหัสผ่าน"
                                    placeholderTextColor="#ccc"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                />
                            </View>

                            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                                <Text style={styles.loginButtonText}>เข้าสู่ระบบ</Text>
                            </TouchableOpacity>

                            <View style={styles.registerContainer}>
                                <Text style={styles.registerText}>ยังไม่มีบัญชี? </Text>
                                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                                    <Text style={styles.registerLink}>สมัครสมาชิก</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
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
    content: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
    },
    logoContainer: {
        width: 80,
        height: 80,
        backgroundColor: '#fff',
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
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
        marginBottom: 25,
    },
    inputWrapper: {
        marginBottom: 20,
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
        fontSize: 16,
        color: '#333',
        backgroundColor: '#F9F9F9',
    },
    loginButton: {
        backgroundColor: '#d85784',
        borderRadius: 12,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 25,
    },
    registerText: {
        color: '#666',
        fontSize: 14,
    },
    registerLink: {
        color: '#d85784',
        fontSize: 14,
        fontWeight: 'bold',
    },
});
