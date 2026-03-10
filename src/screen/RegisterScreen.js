import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/colors';
import { authStyles } from '../constants/authStyles';
import { AuthContext } from '../context/AuthContext';
import { UserPlus, Lock, BookOpen, Mail, Building2, GraduationCap } from 'lucide-react-native';
import { Picker } from '@react-native-picker/picker';
import { FACULTIES, FACULTIES_AND_MAJORS } from '../constants/faculties';

export default function RegisterScreen({ navigation }) {
    const { register } = useContext(AuthContext);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [faculty, setFaculty] = useState('');
    const [major, setMajor] = useState('');
    const [year, setYear] = useState('');

    const handleRegister = async () => {
        if (!name || !email || !password || !confirmPassword || !faculty || !major || !year) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        try {
            await register(name, email, password, faculty, major, year);
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
                                    <Building2 size={16} color={COLORS.textSecondary} />
                                    <Text style={authStyles.label}>คณะ</Text>
                                </View>
                                <View style={[authStyles.input, { paddingHorizontal: 0, justifyContent: 'center', overflow: 'hidden' }]}>
                                    <Picker
                                        selectedValue={faculty}
                                        onValueChange={(itemValue) => {
                                            setFaculty(itemValue);
                                            setMajor('');
                                        }}
                                        style={{ color: COLORS.text, width: '100%', height: '100%' }}
                                        dropdownIconColor={COLORS.textSecondary}
                                    >
                                        <Picker.Item label="เลือกคณะ" value="" color={COLORS.textSecondary} style={{ fontSize: 15 }} enabled={false} />
                                        {FACULTIES.map((item, index) => (
                                            <Picker.Item key={index} label={item} value={item} color={COLORS.text} style={{ fontSize: 15 }} />
                                        ))}
                                    </Picker>
                                </View>
                            </View>

                            <View style={authStyles.inputWrapper}>
                                <View style={authStyles.labelContainer}>
                                    <BookOpen size={16} color={COLORS.textSecondary} />
                                    <Text style={authStyles.label}>สาขาวิชา</Text>
                                </View>
                                <View style={[authStyles.input, { paddingHorizontal: 0, justifyContent: 'center', overflow: 'hidden' }, !faculty && { opacity: 0.5 }]}>
                                    <Picker
                                        selectedValue={major}
                                        onValueChange={(itemValue) => setMajor(itemValue)}
                                        style={{ color: COLORS.text, width: '100%', height: '100%' }}
                                        dropdownIconColor={COLORS.textSecondary}
                                        enabled={!!faculty}
                                    >
                                        <Picker.Item label="เลือกสาขาวิชา" value="" color={COLORS.textSecondary} style={{ fontSize: 15 }} enabled={false} />
                                        {faculty ? FACULTIES_AND_MAJORS[faculty]?.map((item, index) => (
                                            <Picker.Item key={index} label={item} value={item} color={COLORS.text} style={{ fontSize: 15 }} />
                                        )) : null}
                                    </Picker>
                                </View>
                            </View>

                            <View style={authStyles.inputWrapper}>
                                <View style={authStyles.labelContainer}>
                                    <GraduationCap size={16} color={COLORS.textSecondary} />
                                    <Text style={authStyles.label}>ชั้นปี</Text>
                                </View>
                                <TextInput
                                    style={authStyles.input}
                                    placeholder="เช่น 1, 2, 3, 4"
                                    placeholderTextColor="#ccc"
                                    keyboardType="numeric"
                                    value={year}
                                    onChangeText={(text) => setYear(text.replace(/[^0-9]/g, ''))}
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
