import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/colors';
import { authStyles } from '../constants/authStyles';
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
        <LinearGradient colors={['#ffa6c9', '#f94f8a']} style={authStyles.container}>
            <SafeAreaView style={authStyles.safeArea}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={authStyles.keyboardView}
                >
                    <ScrollView contentContainerStyle={authStyles.scrollContent} showsVerticalScrollIndicator={false}>
                        <View style={authStyles.header}>
                            <View style={authStyles.logoContainer}>
                                <BookOpen size={40} color={COLORS.primary} />
                            </View>
                            <Text style={authStyles.appName}>StudySync</Text>
                            <Text style={authStyles.appSubtitle}>Academic Life Planner</Text>
                        </View>

                        <View style={authStyles.card}>
                            <Text style={authStyles.cardTitle}>สมัครสมาชิก</Text>

                            <View style={authStyles.inputWrapper}>
                                <View style={authStyles.labelContainer}>
                                    <UserPlus size={16} color={COLORS.textSecondary} />
                                    <Text style={authStyles.label}>ชื่อ-นามสกุล</Text>
                                </View>
                                <TextInput
                                    style={authStyles.input}
                                    placeholder="เช่น สมชาย ใจดี"
                                    placeholderTextColor="#ccc"
                                    value={name}
                                    onChangeText={setName}
                                />
                            </View>

                            <View style={authStyles.inputWrapper}>
                                <View style={authStyles.labelContainer}>
                                    <Mail size={16} color={COLORS.textSecondary} />
                                    <Text style={authStyles.label}>อีเมล</Text>
                                </View>
                                <TextInput
                                    style={authStyles.input}
                                    placeholder="กรอกอีเมล"
                                    placeholderTextColor="#ccc"
                                    keyboardType="email-address"
                                    value={email}
                                    onChangeText={setEmail}
                                    autoCapitalize="none"
                                />
                            </View>

                            <View style={authStyles.inputWrapper}>
                                <View style={authStyles.labelContainer}>
                                    <Lock size={16} color={COLORS.textSecondary} />
                                    <Text style={authStyles.label}>รหัสผ่าน</Text>
                                </View>
                                <TextInput
                                    style={authStyles.input}
                                    placeholder="อย่างน้อย 6 ตัวอักษร"
                                    placeholderTextColor="#ccc"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                />
                            </View>

                            <View style={authStyles.inputWrapper}>
                                <View style={authStyles.labelContainer}>
                                    <Lock size={16} color={COLORS.textSecondary} />
                                    <Text style={authStyles.label}>ยืนยันรหัสผ่าน</Text>
                                </View>
                                <TextInput
                                    style={authStyles.input}
                                    placeholder="กรอกรหัสผ่านอีกครั้ง"
                                    placeholderTextColor="#ccc"
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry
                                />
                            </View>

                            <TouchableOpacity style={authStyles.primaryButton} onPress={handleRegister}>
                                <Text style={authStyles.primaryButtonText}>สมัครสมาชิก</Text>
                            </TouchableOpacity>

                            <View style={authStyles.switchContainer}>
                                <Text style={authStyles.switchText}>มีบัญชีอยู่แล้ว? </Text>
                                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                    <Text style={authStyles.switchLink}>เข้าสู่ระบบ</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </LinearGradient>
    );
}
