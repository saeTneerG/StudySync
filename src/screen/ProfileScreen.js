import React, { useState, useContext, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, LogOut, Building2, GraduationCap, Trash2, Edit3, BookOpen } from 'lucide-react-native';
import { Picker } from '@react-native-picker/picker';
import { COLORS } from '../constants/colors';
import { sharedStyles } from '../constants/sharedStyles';
import { AuthContext } from '../context/AuthContext';
import { DataContext } from '../context/DataContext';
import ScreenHeader from '../components/ScreenHeader';
import { FACULTIES, FACULTIES_AND_MAJORS } from '../constants/faculties';

export default function ProfileScreen() {
    const { userInfo, logout, updateProfile } = useContext(AuthContext);
    const { clearAllData } = useContext(DataContext);
    const [name, setName] = useState('');
    const [faculty, setFaculty] = useState('คณะวิศวกรรมศาสตร์ กำแพงแสน');
    const [major, setMajor] = useState('');
    const [year, setYear] = useState('1');
    const [isEditing, setIsEditing] = useState(false);
    const facultyPickerRef = useRef(null);
    const majorPickerRef = useRef(null);

    useEffect(() => {
        if (userInfo) {
            setName(userInfo.name || '');
            setFaculty(userInfo.faculty || 'คณะวิศวกรรมศาสตร์ กำแพงแสน');
            setMajor(userInfo.major || '');
            setYear(userInfo.year || '1');
        }
    }, [userInfo]);

    const handleSave = async () => {
        try {
            await updateProfile({ name, faculty, major, year });
            setIsEditing(false);
            Alert.alert('สำเร็จ', 'อัปเดตข้อมูลเรียบร้อยแล้ว');
        } catch (e) {
            Alert.alert('ข้อผิดพลาด', 'ไม่สามารถอัปเดตข้อมูลได้');
        }
    };

    const handleCancelEdit = () => {
        if (userInfo) {
            setName(userInfo.name || '');
            setFaculty(userInfo.faculty || 'คณะวิศวกรรมศาสตร์ กำแพงแสน');
            setMajor(userInfo.major || '');
            setYear(userInfo.year || '1');
        }
        setIsEditing(false);
    };

    const handleDelete = () => {
        Alert.alert(
            'ล้างข้อมูลการเรียน',
            'คุณแน่ใจหรือไม่ที่จะล้างข้อมูลวิชาเรียนและตารางสอบทั้งหมด? การกระทำนี้ไม่สามารถย้อนกลับได้',
            [
                { text: 'ยกเลิก', style: 'cancel' },
                {
                    text: 'ล้างข้อมูล',
                    style: 'destructive',
                    onPress: () => clearAllData(),
                }
            ]
        );
    };

    return (
        <SafeAreaView style={sharedStyles.container}>
            <ScreenHeader name={name} />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.contentContainer}>
                    <Text style={styles.pageTitle}>Profile & Settings</Text>
                    <Text style={styles.pageSubtitle}>จัดการข้อมูลส่วนตัว</Text>

                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionHeader}>บัญชีผู้ใช้</Text>
                        <View style={[styles.card, styles.shadow]}>
                            <View style={styles.userInfoRow}>
                                <View style={styles.avatarContainer}>
                                    <User size={24} color={COLORS.primary} />
                                </View>
                                <View style={styles.userInfoText}>
                                    <Text style={styles.userLabel}>ชื่อผู้ใช้</Text>
                                    <Text style={styles.userName}>{userInfo?.name}</Text>
                                </View>

                            </View>
                            <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                                <LogOut size={20} color={COLORS.white} style={{ marginRight: 10 }} />
                                <Text style={styles.logoutText}>ออกจากระบบ</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.sectionContainer}>
                        <View style={styles.sectionHeaderRow}>
                            <Text style={styles.sectionHeader}>ข้อมูลผู้เรียน</Text>
                            {!isEditing && (
                                <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
                                    <Edit3 size={16} color={COLORS.white} style={{ marginRight: 6 }} />
                                    <Text style={styles.editButtonText}>แก้ไขข้อมูล</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                        <View style={[styles.card, styles.shadow]}>

                            <View style={styles.inputGroup}>
                                <View style={styles.inputLabelContainer}>
                                    <User size={18} color={COLORS.textSecondary} />
                                    <Text style={styles.inputLabel}>ชื่อ-นามสกุล</Text>
                                </View>
                                <TextInput
                                    style={[styles.input, !isEditing && styles.inputDisabled]}
                                    value={name}
                                    onChangeText={setName}
                                    placeholder="เช่น สมชาย ใจดี"
                                    editable={isEditing}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <View style={styles.inputLabelContainer}>
                                    <Building2 size={18} color={COLORS.textSecondary} />
                                    <Text style={styles.inputLabel}>คณะ</Text>
                                </View>
                                {isEditing ? (
                                    <TouchableOpacity
                                        style={styles.pickerTouchable}
                                        activeOpacity={0.7}
                                        onPress={() => facultyPickerRef.current?.focus()}
                                    >
                                        <Text style={styles.pickerDisplayText}>{faculty || 'เลือกคณะ'}</Text>
                                        <Picker
                                            ref={facultyPickerRef}
                                            selectedValue={faculty}
                                            onValueChange={(itemValue) => {
                                                setFaculty(itemValue);
                                                setMajor('');
                                            }}
                                            style={styles.pickerHidden}
                                        >
                                            <Picker.Item label="เลือกคณะ" value="" />
                                            {FACULTIES.map((item, index) => (
                                                <Picker.Item key={index} label={item} value={item} />
                                            ))}
                                        </Picker>
                                    </TouchableOpacity>
                                ) : (
                                    <View style={[styles.input, styles.inputDisabled, { justifyContent: 'center' }]}>
                                        <Text style={{ fontSize: 16, color: COLORS.text }}>{faculty || '-'}</Text>
                                    </View>
                                )}
                            </View>

                            <View style={styles.inputGroup}>
                                <View style={styles.inputLabelContainer}>
                                    <BookOpen size={18} color={COLORS.textSecondary} />
                                    <Text style={styles.inputLabel}>สาขาวิชา</Text>
                                </View>
                                {isEditing ? (
                                    <TouchableOpacity
                                        style={[styles.pickerTouchable, !faculty && styles.pickerDisabled]}
                                        activeOpacity={0.7}
                                        onPress={() => {
                                            if (!faculty) {
                                                Alert.alert('แจ้งเตือน', 'กรุณาเลือกคณะก่อนเลือกสาขาวิชา');
                                            } else {
                                                majorPickerRef.current?.focus();
                                            }
                                        }}
                                    >
                                        <Text style={[styles.pickerDisplayText, !faculty && { color: COLORS.textSecondary }]}>{major || 'เลือกสาขาวิชา'}</Text>
                                        <Picker
                                            ref={majorPickerRef}
                                            selectedValue={major}
                                            onValueChange={(itemValue) => setMajor(itemValue)}
                                            style={styles.pickerHidden}
                                            enabled={!!faculty}
                                        >
                                            <Picker.Item label="เลือกสาขาวิชา" value="" />
                                            {faculty ? FACULTIES_AND_MAJORS[faculty]?.map((item, index) => (
                                                <Picker.Item key={index} label={item} value={item} />
                                            )) : null}
                                        </Picker>
                                    </TouchableOpacity>
                                ) : (
                                    <View style={[styles.input, styles.inputDisabled, { justifyContent: 'center' }]}>
                                        <Text style={{ fontSize: 16, color: COLORS.text }}>{major || '-'}</Text>
                                    </View>
                                )}
                            </View>

                            <View style={styles.inputGroup}>
                                <View style={styles.inputLabelContainer}>
                                    <GraduationCap size={18} color={COLORS.textSecondary} />
                                    <Text style={styles.inputLabel}>ชั้นปี</Text>
                                </View>
                                {isEditing ? (
                                    <TextInput
                                        style={styles.input}
                                        placeholder="เช่น 1, 2, 3, 4"
                                        keyboardType="numeric"
                                        value={year}
                                        onChangeText={(text) => setYear(text.replace(/[^0-9]/g, ''))}
                                    />
                                ) : (
                                    <Text style={[styles.input, styles.inputDisabled]}>{year ? `ปี ${year}` : '-'}</Text>
                                )}
                            </View>

                            {isEditing && (
                                <View style={styles.actionButtonsContainer}>
                                    <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
                                        <Text style={styles.saveButtonText}>บันทึก</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancelEdit}>
                                        <Text style={styles.cancelButtonText}>ยกเลิก</Text>
                                    </TouchableOpacity>
                                </View>
                            )}

                        </View>
                    </View>

                    <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                        <Trash2 size={20} color={COLORS.white} style={{ marginRight: 10 }} />
                        <Text style={styles.deleteButtonText}>ลบข้อมูล</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        paddingBottom: 20,
    },
    contentContainer: {
        padding: 20,
    },
    pageTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 4,
    },
    pageSubtitle: {
        fontSize: 16,
        color: COLORS.textSecondary,
        marginBottom: 20,
    },
    sectionContainer: {
        marginBottom: 25,
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.text,
    },
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.primary,
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 8,
    },
    editButtonText: {
        color: COLORS.white,
        fontSize: 14,
        fontWeight: '600',
    },
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 20,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    shadow: {
        shadowColor: COLORS.cardShadow.shadowColor,
        shadowOffset: COLORS.cardShadow.shadowOffset,
        shadowOpacity: COLORS.cardShadow.shadowOpacity,
        shadowRadius: COLORS.cardShadow.shadowRadius,
        elevation: COLORS.cardShadow.elevation,
    },
    userInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(222, 86, 118, 0.1)',
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
    },
    avatarContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.white,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
    },
    userInfoText: {
        flex: 1,
    },
    userLabel: {
        fontSize: 12,
        color: COLORS.primary,
        fontWeight: 'bold',
    },
    userName: {
        fontSize: 16,
        color: COLORS.text,
    },
    logoutButton: {
        backgroundColor: '#4A4A4A',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderRadius: 8,
    },
    logoutText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '500',
    },
    inputGroup: {
        marginBottom: 15,
    },
    inputLabelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    inputLabel: {
        fontSize: 14,
        color: COLORS.text,
        marginLeft: 8,
        fontWeight: '500',
    },
    input: {
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: COLORS.text,
    },
    inputDisabled: {
        backgroundColor: '#F5F5F5',
        color: COLORS.textSecondary,
    },
    pickerDisabled: {
        backgroundColor: '#F5F5F5',
        opacity: 0.7,
    },
    dropdown: {
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        padding: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dropdownText: {
        fontSize: 16,
        color: COLORS.text,
    },
    actionButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    button: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveButton: {
        backgroundColor: COLORS.primary,
        marginRight: 10,
    },
    saveButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '600',
    },
    cancelButton: {
        backgroundColor: '#E0E0E0',
        marginLeft: 10,
    },
    cancelButtonText: {
        color: COLORS.text,
        fontSize: 16,
        fontWeight: '600',
    },
    deleteButton: {
        backgroundColor: COLORS.danger,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 10,
        marginTop: 20,
    },
    deleteButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
    dropdownList: {
        marginTop: 5,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        backgroundColor: COLORS.white,
        overflow: 'hidden',
    },
    dropdownItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    dropdownItemText: {
        fontSize: 16,
        color: COLORS.text,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        backgroundColor: COLORS.white,
        overflow: 'hidden',
        height: 50,
        justifyContent: 'center',
    },
    pickerTouchable: {
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        backgroundColor: COLORS.white,
        height: 50,
        justifyContent: 'center',
        paddingHorizontal: 12,
        overflow: 'hidden',
    },
    pickerDisplayText: {
        fontSize: 16,
        color: COLORS.text,
    },
    pickerHidden: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0,
        width: '100%',
        height: '100%',
    },
    picker: {
        width: '100%',
        height: 50,
        backgroundColor: 'transparent',
        color: COLORS.text,
    },
});
