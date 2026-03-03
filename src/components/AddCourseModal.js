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

    const initialSchedule = {
        id: Date.now().toString(),
        day: 'จันทร์',
        startTime: defaultStart,
        endTime: defaultEnd,
    };

    const initialFormState = {
        subjectName: '',
        subjectCode: '',
        room: '',
        schedules: [initialSchedule],
    };

    const [formData, setFormData] = useState(initialFormState);
    const [showTimePicker, setShowTimePicker] = useState(null); // { id: scheduleId, type: 'start' | 'end' }

    const updateForm = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const updateSchedule = (id, field, value) => {
        setFormData(prev => ({
            ...prev,
            schedules: prev.schedules.map(sch =>
                sch.id === id ? { ...sch, [field]: value } : sch
            )
        }));
    };

    const addScheduleBlock = () => {
        const newSchedule = {
            id: Date.now().toString(),
            day: 'จันทร์',
            startTime: defaultStart,
            endTime: defaultEnd,
        };
        setFormData(prev => ({
            ...prev,
            schedules: [...prev.schedules, newSchedule]
        }));
    };

    const removeScheduleBlock = (id) => {
        if (formData.schedules.length === 1) return;
        setFormData(prev => ({
            ...prev,
            schedules: prev.schedules.filter(sch => sch.id !== id)
        }));
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    };

    const parseTimeToMinutes = (dateObj) => {
        return dateObj.getHours() * 60 + dateObj.getMinutes();
    };

    const resetForm = () => {
        setFormData(initialFormState);
    };

    const handleAdd = () => {
        const { subjectName, subjectCode, room, schedules } = formData;

        if (!subjectName || !subjectCode || !room) {
            Alert.alert("ข้อผิดพลาด", "กรุณากรอกข้อมูลให้ครบถ้วน");
            return;
        }

        // Check for duplicate course
        const isDuplicate = courses.some(course =>
            course.subjectCode.trim().toLowerCase() === subjectCode.trim().toLowerCase() ||
            course.subjectName.trim().toLowerCase() === subjectName.trim().toLowerCase()
        );

        if (isDuplicate) {
            Alert.alert("ข้อผิดพลาด", "รหัสวิชาหรือชื่อวิชานี้มีอยู่แล้ว");
            return;
        }

        // Validate individual schedule times
        for (let sch of schedules) {
            const startMinutes = parseTimeToMinutes(sch.startTime);
            const endMinutes = parseTimeToMinutes(sch.endTime);
            if (startMinutes >= endMinutes) {
                Alert.alert("ข้อผิดพลาด", "เวลาเริ่มต้องก่อนเวลาจบในทุกช่วงเวลา");
                return;
            }
        }

        // Validate overlap checking within the new schedules
        for (let i = 0; i < schedules.length; i++) {
            for (let j = i + 1; j < schedules.length; j++) {
                if (schedules[i].day === schedules[j].day) {
                    const start1 = parseTimeToMinutes(schedules[i].startTime);
                    const end1 = parseTimeToMinutes(schedules[i].endTime);
                    const start2 = parseTimeToMinutes(schedules[j].startTime);
                    const end2 = parseTimeToMinutes(schedules[j].endTime);
                    if (Math.max(start1, start2) < Math.min(end1, end2)) {
                        Alert.alert("ข้อผิดพลาด", "เวลาของวิชาที่เพิ่มซ้อนทับกันเอง");
                        return;
                    }
                }
            }
        }

        // Check against existing courses
        const hasOverlap = courses.some(course => {
            const courseSchedules = course.schedules || [{
                id: 'legacy',
                day: course.day,
                startTime: course.startTime,
                endTime: course.endTime
            }];

            return courseSchedules.some(cSch => {
                const cStart = parseTimeToMinutes(new Date(cSch.startTime));
                const cEnd = parseTimeToMinutes(new Date(cSch.endTime));

                return schedules.some(newSch => {
                    if (cSch.day === newSch.day) {
                        const newStart = parseTimeToMinutes(newSch.startTime);
                        const newEnd = parseTimeToMinutes(newSch.endTime);
                        return Math.max(newStart, cStart) < Math.min(newEnd, cEnd);
                    }
                    return false;
                });
            });
        });

        if (hasOverlap) {
            Alert.alert("ข้อผิดพลาด", "เวลาเรียนชนกับวิชาอื่นในวันเดียวกัน");
            return;
        }

        // Prepare schedules for saving
        const formattedSchedules = schedules.map(sch => ({
            ...sch,
            startTime: sch.startTime.toISOString(),
            endTime: sch.endTime.toISOString(),
        }));

        const newCourse = {
            id: Date.now().toString(),
            subjectName,
            subjectCode,
            room,
            // Fallbacks for legacy single-item access just in case
            day: formattedSchedules[0].day,
            startTime: formattedSchedules[0].startTime,
            endTime: formattedSchedules[0].endTime,
            schedules: formattedSchedules,
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
                            value={formData.subjectName}
                            onChangeText={(text) => updateForm('subjectName', text)}
                            placeholderTextColor="#A0A0A0"
                        />

                        <Text style={styles.inputLabel}>รหัสวิชา</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="เช่น MATH101"
                            value={formData.subjectCode}
                            onChangeText={(text) => updateForm('subjectCode', text)}
                            placeholderTextColor="#A0A0A0"
                        />

                        <Text style={styles.inputLabel}>ห้องเรียน</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="เช่น ห้อง 301"
                            value={formData.room}
                            onChangeText={(text) => updateForm('room', text)}
                            placeholderTextColor="#A0A0A0"
                        />

                        <View style={styles.scheduleHeaderRow}>
                            <Text style={styles.inputLabel}>วันและเวลาเรียน</Text>
                            <TouchableOpacity onPress={addScheduleBlock}>
                                <Text style={styles.addScheduleText}>+ เพิ่มเวลาเรียน</Text>
                            </TouchableOpacity>
                        </View>

                        {formData.schedules.map((schedule, index) => (
                            <View key={schedule.id} style={styles.scheduleBlock}>
                                <View style={styles.scheduleBlockHeader}>
                                    <Text style={styles.scheduleIndexText}>เวลาเรียนชุดที่ {index + 1}</Text>
                                    {formData.schedules.length > 1 && (
                                        <TouchableOpacity onPress={() => removeScheduleBlock(schedule.id)}>
                                            <X size={18} color="#FF6B6B" />
                                        </TouchableOpacity>
                                    )}
                                </View>

                                <View style={styles.pickerContainer}>
                                    <Picker
                                        selectedValue={schedule.day}
                                        onValueChange={(itemValue) => updateSchedule(schedule.id, 'day', itemValue)}
                                        style={styles.picker}
                                    >
                                        {dayOptions.map(d => (
                                            <Picker.Item key={d.value} label={d.label} value={d.value} />
                                        ))}
                                    </Picker>
                                </View>

                                <View style={styles.timeRow}>
                                    <View style={[styles.timeColumn, { marginRight: 10 }]}>
                                        <Text style={[styles.inputLabel, { marginTop: 8 }]}>เวลาเริ่ม</Text>
                                        <TouchableOpacity
                                            style={styles.timePickerButton}
                                            onPress={() => setShowTimePicker({ id: schedule.id, type: 'start' })}
                                        >
                                            <Text style={styles.timePickerText}>{formatTime(schedule.startTime)}</Text>
                                            <Clock size={20} color={COLORS.text} />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={[styles.timeColumn, { marginLeft: 10 }]}>
                                        <Text style={[styles.inputLabel, { marginTop: 8 }]}>เวลาจบ</Text>
                                        <TouchableOpacity
                                            style={styles.timePickerButton}
                                            onPress={() => setShowTimePicker({ id: schedule.id, type: 'end' })}
                                        >
                                            <Text style={styles.timePickerText}>{formatTime(schedule.endTime)}</Text>
                                            <Clock size={20} color={COLORS.text} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        ))}

                        {showTimePicker && (
                            <DateTimePicker
                                value={
                                    (() => {
                                        const sch = formData.schedules.find(s => s.id === showTimePicker.id);
                                        if (!sch) return defaultStart;
                                        return showTimePicker.type === 'start' ? sch.startTime : sch.endTime;
                                    })()
                                }
                                mode="time"
                                is24Hour={true}
                                display="default"
                                onChange={(event, selectedDate) => {
                                    const pickerState = showTimePicker;
                                    setShowTimePicker(Platform.OS === 'ios' ? pickerState : null);
                                    if (selectedDate && pickerState) {
                                        updateSchedule(
                                            pickerState.id,
                                            pickerState.type === 'start' ? 'startTime' : 'endTime',
                                            selectedDate
                                        );
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
    scheduleHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 15,
        marginBottom: 8,
    },
    addScheduleText: {
        color: COLORS.primary,
        fontSize: 14,
        fontWeight: 'bold',
    },
    scheduleBlock: {
        backgroundColor: '#F8F9FA',
        padding: 15,
        borderRadius: 12,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    scheduleBlockHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    scheduleIndexText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.textSecondary,
    },
});
