import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/colors';
import { authStyles } from '../constants/authStyles';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, BookOpen } from 'lucide-react-native';

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
        <LinearGradient colors={['#ffa6c9', '#f94f8a']} style={authStyles.container}>
            <SafeAreaView style={authStyles.safeArea}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={authStyles.keyboardView}
                >
                    <View style={authStyles.content}>
                        <View style={authStyles.header}>
                            <View style={authStyles.logoContainer}>
                                <BookOpen size={40} color={COLORS.primary} />
                            </View>
                            <Text style={authStyles.appName}>StudySync</Text>
                            <Text style={authStyles.appSubtitle}>Academic Life Planner</Text>
                        </View>

                        <View style={authStyles.card}>
                            <Text style={authStyles.cardTitle}>เข้าสู่ระบบ</Text>

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
                                    placeholder="กรอกรหัสผ่าน"
                                    placeholderTextColor="#ccc"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                />
                            </View>

                            <TouchableOpacity style={authStyles.primaryButton} onPress={handleLogin}>
                                <Text style={authStyles.primaryButtonText}>เข้าสู่ระบบ</Text>
                            </TouchableOpacity>

                            <View style={authStyles.switchContainer}>
                                <Text style={authStyles.switchText}>ยังไม่มีบัญชี? </Text>
                                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                                    <Text style={authStyles.switchLink}>สมัครสมาชิก</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </LinearGradient>
    );
}
