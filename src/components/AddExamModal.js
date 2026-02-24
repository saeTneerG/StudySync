import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput, Alert, Platform } from 'react-native';
import { COLORS } from '../constants/colors';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { X, Clock, Calendar } from 'lucide-react-native';

export default function AddExamModal({ visible, onClose, onAddExam, courses, exams }) {
    const defaultStart = new Date();
    defaultStart.setHours(9, 0, 0, 0);
    const defaultEnd = new Date();
    defaultEnd.setHours(12, 0, 0, 0);

    const [subjectName, setSubjectName] = useState('');
    const [subjectCode, setSubjectCode] = useState('');
    const [room, setRoom] = useState('');
    const [examDate, setExamDate] = useState(new Date());
    const [startTime, setStartTime] = useState(defaultStart);
    const [endTime, setEndTime] = useState(defaultEnd);
    const [showTimePicker, setShowTimePicker] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedCourseId, setSelectedCourseId] = useState('');

    const formatTime = (date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const parseTimeToMinutes = (dateObj) => {
        return dateObj.getHours() * 60 + dateObj.getMinutes();
    };

    const resetForm = () => {
        setSubjectName('');
        setSubjectCode('');
        setRoom('');
        setExamDate(new Date());
        setStartTime(defaultStart);
        setEndTime(defaultEnd);
        setSelectedCourseId('');
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

        const hasOverlap = exams.some(exam => {
            const eDate = new Date(exam.date);
            if (eDate.toDateString() === examDate.toDateString()) {
                const examStart = parseTimeToMinutes(new Date(exam.startTime));
                const examEnd = parseTimeToMinutes(new Date(exam.endTime));
                return Math.max(startMinutes, examStart) < Math.min(endMinutes, examEnd);
            }
            return false;
        });

        if (hasOverlap) {
            Alert.alert("ข้อผิดพลาด", "เวลาสอบชนกับวิชาอื่นในวันเดียวกัน");
            return;
        }

        const newExam = {
            id: Date.now().toString(),
            subjectName,
            subjectCode,
            room,
            date: examDate.toISOString(),
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
        };

        onAddExam(newExam);
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
                        <Text style={styles.modalTitle}>เพิ่มตารางสอบ</Text>
                        <TouchableOpacity onPress={handleClose}>
                            <X size={24} color={COLORS.text} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 10 }}>
                        {courses.length > 0 && (
                            <>
                                <Text style={styles.inputLabel}>เลือกจากวิชาเรียนที่มีอยู่</Text>
                                <View style={styles.pickerContainer}>
                                    <Picker
                                        selectedValue={selectedCourseId}
                                        onValueChange={(itemValue) => {
                                            setSelectedCourseId(itemValue);
                                            if (itemValue) {
                                                const selectedCourse = courses.find(c => c.id === itemValue);
                                                if (selectedCourse) {
                                                    setSubjectName(selectedCourse.subjectName);
                                                    setSubjectCode(selectedCourse.subjectCode);
                                                    setRoom(selectedCourse.room);
                                                }
                                            } else {
                                                setSubjectName('');
                                                setSubjectCode('');
                                                setRoom('');
                                            }
                                        }}
                                        style={styles.picker}
                                    >
                                        <Picker.Item label="-- เลือกวิชาเรียน --" value="" />
                                        {courses.map(c => (
                                            <Picker.Item key={c.id} label={`${c.subjectCode} ${c.subjectName}`} value={c.id} />
                                        ))}
                                    </Picker>
                                </View>
                            </>
                        )}

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

                        <Text style={styles.inputLabel}>ห้องสอบ</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="เช่น ห้อง 301"
                            value={room}
                            onChangeText={setRoom}
                            placeholderTextColor="#A0A0A0"
                        />

                        <Text style={styles.inputLabel}>วันที่สอบ</Text>
                        <TouchableOpacity style={styles.timePickerButton} onPress={() => setShowDatePicker(true)}>
                            <Text style={styles.timePickerText}>{formatDate(examDate)}</Text>
                            <Calendar size={20} color={COLORS.text} />
                        </TouchableOpacity>

                        {showDatePicker && (
                            <DateTimePicker
                                value={examDate}
                                mode="date"
                                display="default"
                                onChange={(event, selectedDate) => {
                                    setShowDatePicker(Platform.OS === 'ios');
                                    if (selectedDate) setExamDate(selectedDate);
                                }}
                            />
                        )}

                        <View style={styles.timeRow}>
                            <View style={[styles.timeColumn, { marginRight: 10 }]}>
                                <Text style={styles.inputLabel}>เวลาเริ่ม</Text>
                                <TouchableOpacity style={styles.timePickerButton} onPress={() => setShowTimePicker('examStart')}>
                                    <Text style={styles.timePickerText}>{formatTime(startTime)}</Text>
                                    <Clock size={20} color={COLORS.text} />
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.timeColumn, { marginLeft: 10 }]}>
                                <Text style={styles.inputLabel}>เวลาจบ</Text>
                                <TouchableOpacity style={styles.timePickerButton} onPress={() => setShowTimePicker('examEnd')}>
                                    <Text style={styles.timePickerText}>{formatTime(endTime)}</Text>
                                    <Clock size={20} color={COLORS.text} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {(showTimePicker === 'examStart' || showTimePicker === 'examEnd') && (
                            <DateTimePicker
                                value={showTimePicker === 'examStart' ? startTime : endTime}
                                mode="time"
                                is24Hour={true}
                                display="default"
                                onChange={(event, selectedDate) => {
                                    const pickerType = showTimePicker;
                                    setShowTimePicker(Platform.OS === 'ios' ? pickerType : null);
                                    if (selectedDate) {
                                        if (pickerType === 'examStart') {
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
