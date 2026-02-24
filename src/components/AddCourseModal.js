import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput, Alert, Platform } from 'react-native';
import { COLORS } from '../constants/colors';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { X, Clock } from 'lucide-react-native';

export default function AddCourseModal({ visible, onClose, onAddCourse, courses, dayOptions }) {
    const defaultStart = new Date();
    defaultStart.setHours(9, 0, 0, 0);
    const defaultEnd = new Date();
    defaultEnd.setHours(12, 0, 0, 0);

    const [subjectName, setSubjectName] = useState('');
    const [subjectCode, setSubjectCode] = useState('');
    const [room, setRoom] = useState('');
    const [day, setDay] = useState('จันทร์');
    const [startTime, setStartTime] = useState(defaultStart);
    const [endTime, setEndTime] = useState(defaultEnd);
    const [showTimePicker, setShowTimePicker] = useState(null);

    const formatTime = (date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    };

    const parseTimeToMinutes = (dateObj) => {
        return dateObj.getHours() * 60 + dateObj.getMinutes();
    };

    const resetForm = () => {
        setSubjectName('');
        setSubjectCode('');
        setRoom('');
        setDay('จันทร์');
        setStartTime(defaultStart);
        setEndTime(defaultEnd);
    };

    const handleAdd = () => {
        if (!subjectName || !subjectCode || !room) {
            Alert.alert("ข้อผิดพลาด", "กรุณากรอกข้อมูลให้ครบถ้วน");
            return;
        }

        const startMinutes = parseTimeToMinutes(startTime);
        const endMinutes = parseTimeToMinutes(endTime);

        if (startMinutes >= endMinutes) {
            Alert.alert("ข้อผิดพลาด", "เวลาเริ่มต้องก่อนเวลาจบ");
            return;
        }

        const hasOverlap = courses.some(course => {
            if (course.day === day) {
                const courseStart = parseTimeToMinutes(new Date(course.startTime));
                const courseEnd = parseTimeToMinutes(new Date(course.endTime));
                return Math.max(startMinutes, courseStart) < Math.min(endMinutes, courseEnd);
            }
            return false;
        });

        if (hasOverlap) {
            Alert.alert("ข้อผิดพลาด", "เวลาเรียนชนกับวิชาอื่นในวันเดียวกัน");
            return;
        }

        const newCourse = {
            id: Date.now().toString(),
            subjectName,
            subjectCode,
            room,
            day,
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
        };

        onAddCourse(newCourse);
        resetForm();
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={handleClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>เพิ่มรายวิชา</Text>
                        <TouchableOpacity onPress={handleClose}>
                            <X size={24} color={COLORS.text} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 10 }}>
                        <Text style={styles.inputLabel}>ชื่อวิชา</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="เช่น คณิตศาสตร์"
                            value={subjectName}
                            onChangeText={setSubjectName}
                            placeholderTextColor="#A0A0A0"
                        />

                        <Text style={styles.inputLabel}>รหัสวิชา</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="เช่น MATH101"
                            value={subjectCode}
                            onChangeText={setSubjectCode}
                            placeholderTextColor="#A0A0A0"
                        />

                        <Text style={styles.inputLabel}>ห้องเรียน</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="เช่น ห้อง 301"
                            value={room}
                            onChangeText={setRoom}
                            placeholderTextColor="#A0A0A0"
                        />

                        <Text style={styles.inputLabel}>วัน</Text>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={day}
                                onValueChange={(itemValue) => setDay(itemValue)}
                                style={styles.picker}
                            >
                                {dayOptions.map(d => (
                                    <Picker.Item key={d.value} label={d.label} value={d.value} />
                                ))}
                            </Picker>
                        </View>

                        <View style={styles.timeRow}>
                            <View style={[styles.timeColumn, { marginRight: 10 }]}>
                                <Text style={styles.inputLabel}>เวลาเริ่ม</Text>
                                <TouchableOpacity style={styles.timePickerButton} onPress={() => setShowTimePicker('start')}>
                                    <Text style={styles.timePickerText}>{formatTime(startTime)}</Text>
                                    <Clock size={20} color={COLORS.text} />
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.timeColumn, { marginLeft: 10 }]}>
                                <Text style={styles.inputLabel}>เวลาจบ</Text>
                                <TouchableOpacity style={styles.timePickerButton} onPress={() => setShowTimePicker('end')}>
                                    <Text style={styles.timePickerText}>{formatTime(endTime)}</Text>
                                    <Clock size={20} color={COLORS.text} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {showTimePicker && (
                            <DateTimePicker
                                value={showTimePicker === 'start' ? startTime : endTime}
                                mode="time"
                                is24Hour={true}
                                display="default"
                                onChange={(event, selectedDate) => {
                                    const pickerType = showTimePicker;
                                    setShowTimePicker(Platform.OS === 'ios' ? pickerType : null);
                                    if (selectedDate) {
                                        if (pickerType === 'start') {
                                            setStartTime(selectedDate);
                                        } else {
                                            setEndTime(selectedDate);
                                        }
                                    }
                                }}
                            />
                        )}

                        <View style={styles.modalActions}>
                            <TouchableOpacity style={[styles.modalButton, styles.addBtn]} onPress={handleAdd}>
                                <Text style={styles.addBtnText}>เพิ่ม</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.modalButton, styles.cancelBtn]} onPress={handleClose}>
                                <Text style={styles.cancelBtnText}>ยกเลิก</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '90%',
        maxHeight: '85%',
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 24,
        ...COLORS.cardShadow,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    inputLabel: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginBottom: 8,
        marginTop: 15,
    },
    input: {
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 10,
        padding: 14,
        fontSize: 16,
        color: COLORS.text,
        backgroundColor: COLORS.background,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: COLORS.background,
    },
    picker: {
        height: Platform.OS === 'ios' ? 120 : 54,
        width: '100%',
    },
    timeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
    },
    timeColumn: {
        flex: 1,
    },
    timePickerButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 10,
        padding: 14,
        backgroundColor: COLORS.background,
    },
    timePickerText: {
        fontSize: 16,
        color: COLORS.text,
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 30,
        marginBottom: 10,
    },
    modalButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
    },
    addBtn: {
        backgroundColor: COLORS.primary,
        marginRight: 10,
    },
    addBtnText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
    cancelBtn: {
        backgroundColor: '#E0E0E0',
        marginLeft: 10,
    },
    cancelBtnText: {
        color: COLORS.text,
        fontSize: 16,
        fontWeight: 'bold',
    },
});
