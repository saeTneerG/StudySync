import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/colors';
import { AuthContext } from '../context/AuthContext';
import { UserPlus, Lock, BookOpen, Mail } from 'lucide-react-native';

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
                                <BookOpen size={40} color={COLORS.primary} />
                            </View>
                            <Text style={styles.appName}>StudySync</Text>
                            <Text style={styles.appSubtitle}>Academic Life Planner</Text>
                        </View>

                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>สมัครสมาชิก</Text>

                            <View style={styles.inputWrapper}>
                                <View style={styles.labelContainer}>
                                    <UserPlus size={16} color={COLORS.textSecondary} />
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
                                    <Mail size={16} color={COLORS.textSecondary} />
                                    <Text style={styles.label}>อีเมล</Text>
                                </View>
                                <TextInput
                                    style={styles.input}
                                    placeholder="กรอกอีเมล"
                                    placeholderTextColor="#ccc"
                                    value={email}
                                    onChangeText={setEmail}
                                    autoCapitalize="none"
                                />
                            </View>

                            <View style={styles.inputWrapper}>
                                <View style={styles.labelContainer}>
                                    <Lock size={16} color={COLORS.textSecondary} />
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
                                    <Lock size={16} color={COLORS.textSecondary} />
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
        backgroundColor: COLORS.white,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        ...COLORS.cardShadow,
    },
    appName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.white,
        marginBottom: 5,
    },
    appSubtitle: {
        fontSize: 16,
        color: COLORS.white,
        opacity: 0.9,
    },
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: 25,
        ...COLORS.cardShadow,
        elevation: 5,
    },
    cardTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.text,
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
        color: COLORS.textSecondary,
        marginLeft: 8,
        fontWeight: '500',
    },
    input: {
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 12,
        paddingHorizontal: 15,
        height: 50,
        fontSize: 14,
        color: COLORS.text,
        backgroundColor: COLORS.inputBackground,
    },
    registerButton: {
        backgroundColor: COLORS.primary,
        borderRadius: 12,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    registerButtonText: {
        color: COLORS.white,
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
        color: COLORS.textSecondary,
        fontSize: 14,
    },
    loginLink: {
        color: COLORS.primary,
        fontSize: 14,
        fontWeight: 'bold',
    },
});
