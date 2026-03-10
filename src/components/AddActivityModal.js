import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput, Alert, Platform } from 'react-native';
import { COLORS } from '../constants/colors';
import DateTimePicker from '@react-native-community/datetimepicker';
import { X, Clock, Calendar as CalendarIcon } from 'lucide-react-native';

export default function AddActivityModal({ visible, onClose, onAddActivity, courses }) {
    const defaultTime = new Date();
    defaultTime.setHours(9, 0, 0, 0);

    const defaultEndTime = new Date();
    defaultEndTime.setHours(10, 0, 0, 0);

    const initialFormState = {
        title: '',
        startDate: new Date(),
        endDate: new Date(),
        time: defaultTime,
        endTime: defaultEndTime,
        description: '',
    };
    const [formData, setFormData] = useState(initialFormState);
    const [showPicker, setShowPicker] = useState(null);

    const updateForm = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const formatDate = (date) => {
        const d = date.getDate().toString().padStart(2, '0');
        const m = (date.getMonth() + 1).toString().padStart(2, '0');
        const y = date.getFullYear();
        return `${d}/${m}/${y}`;
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    };

    const parseTimeToMinutes = (dateObj) => {
        return dateObj.getHours() * 60 + dateObj.getMinutes();
    };

    const getThaiDay = (dateObj) => {
        const days = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
        return days[dateObj.getDay()];
    };

    const resetForm = () => {
        setFormData(initialFormState);
        setShowPicker(null);
    };

    const handleAdd = () => {
        const { title, startDate, endDate, time, endTime, description } = formData;

        if (!title) {
            Alert.alert("ข้อผิดพลาด", "กรุณากรอกชื่อกิจกรรม");
            return;
        }

        // Normalize dates to midnight to compare just the date part
        const startDay = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
        const endDay = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

        if (endDay < startDay) {
            Alert.alert("ข้อผิดพลาด", "วันที่สิ้นสุดต้องไม่ก่อนวันที่เริ่มต้น");
            return;
        }

        const activityStartMinutes = parseTimeToMinutes(time);
        const activityEndMinutes = parseTimeToMinutes(endTime);

        if (endDay.getTime() === startDay.getTime() && activityEndMinutes <= activityStartMinutes) {
            Alert.alert("ข้อผิดพลาด", "เวลาสิ้นสุดต้องมากกว่าเวลาเริ่มต้น (สำหรับกิจกรรมวันเดียว)");
            return;
        }

        // Check overlap across all active days in the range
        // Get all dates from startDate to endDate
        const activityDays = [];
        let currentDate = new Date(startDay);
        while (currentDate <= endDay) {
            activityDays.push(getThaiDay(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }

        const hasOverlap = courses.some(course => {
            const courseSchedules = course.schedules || [{
                id: 'legacy',
                day: course.day,
                startTime: course.startTime,
                endTime: course.endTime
            }];

            return courseSchedules.some(sch => {
                if (activityDays.includes(sch.day)) {
                    const courseStart = parseTimeToMinutes(new Date(sch.startTime));
                    const courseEnd = parseTimeToMinutes(new Date(sch.endTime));

                    // For multi-day activities, it basically blocks out the time block on every single active day.
                    if (
                        (activityStartMinutes >= courseStart && activityStartMinutes < courseEnd) ||
                        (activityEndMinutes > courseStart && activityEndMinutes <= courseEnd) ||
                        (activityStartMinutes <= courseStart && activityEndMinutes >= courseEnd)
                    ) {
                        return true;
                    }
                }
                return false;
            });
        });

        if (hasOverlap) {
            Alert.alert("ข้อผิดพลาด", "เวลาของกิจกรรมตรงกับเวลาเรียนในบางวัน");
            return;
        }

        const newActivity = {
            id: Date.now().toString(),
            title,
            // Fallback for backwards compatibility
            date: startDate.toISOString(),
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            time: time.toISOString(),
            endTime: endTime.toISOString(),
            description,
        };

        onAddActivity(newActivity);
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
                        <Text style={styles.modalTitle}>เพิ่มกิจกรรม</Text>
                        <TouchableOpacity onPress={handleClose}>
                            <X size={24} color={COLORS.text} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 10 }}>
                        <Text style={styles.inputLabel}>ชื่อกิจกรรม</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="เช่น ชมรมดนตรี"
                            value={formData.title}
                            onChangeText={(text) => updateForm('title', text)}
                            placeholderTextColor="#A0A0A0"
                        />

                        <Text style={styles.inputLabel}>วันที่เริ่มต้น</Text>
                        <TouchableOpacity style={styles.pickerButton} onPress={() => setShowPicker('startDate')}>
                            <Text style={styles.pickerText}>{formatDate(formData.startDate)}</Text>
                            <CalendarIcon size={20} color={COLORS.text} />
                        </TouchableOpacity>

                        <Text style={styles.inputLabel}>วันที่สิ้นสุด</Text>
                        <TouchableOpacity style={styles.pickerButton} onPress={() => setShowPicker('endDate')}>
                            <Text style={styles.pickerText}>{formatDate(formData.endDate)}</Text>
                            <CalendarIcon size={20} color={COLORS.text} />
                        </TouchableOpacity>

                        <Text style={styles.inputLabel}>เวลาเริ่มต้น</Text>
                        <TouchableOpacity style={styles.pickerButton} onPress={() => setShowPicker('time')}>
                            <Text style={styles.pickerText}>{formatTime(formData.time)}</Text>
                            <Clock size={20} color={COLORS.text} />
                        </TouchableOpacity>

                        <Text style={styles.inputLabel}>เวลาสิ้นสุด</Text>
                        <TouchableOpacity style={styles.pickerButton} onPress={() => setShowPicker('endTime')}>
                            <Text style={styles.pickerText}>{formatTime(formData.endTime)}</Text>
                            <Clock size={20} color={COLORS.text} />
                        </TouchableOpacity>

                        <Text style={styles.inputLabel}>รายละเอียด</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="รายละเอียดเพิ่มเติม..."
                            value={formData.description}
                            onChangeText={(text) => updateForm('description', text)}
                            placeholderTextColor="#A0A0A0"
                            multiline={true}
                            numberOfLines={4}
                            textAlignVertical="top"
                        />

                        {showPicker && (
                            <DateTimePicker
                                value={
                                    showPicker === 'startDate' ? formData.startDate :
                                        showPicker === 'endDate' ? formData.endDate :
                                            showPicker === 'time' ? formData.time :
                                                formData.endTime
                                }
                                mode={showPicker === 'startDate' || showPicker === 'endDate' ? 'date' : 'time'}
                                is24Hour={true}
                                display="default"
                                onChange={(event, selectedDate) => {
                                    const pickerType = showPicker;
                                    setShowPicker(Platform.OS === 'ios' ? pickerType : null);
                                    if (selectedDate) {
                                        updateForm(pickerType, selectedDate);
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
    textArea: {
        height: 100,
    },
    pickerButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 10,
        padding: 14,
        backgroundColor: COLORS.background,
    },
    pickerText: {
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
