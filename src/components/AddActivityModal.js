import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput, Alert, Platform } from 'react-native';
import { COLORS } from '../constants/colors';
import DateTimePicker from '@react-native-community/datetimepicker';
import { X, Clock, Calendar as CalendarIcon } from 'lucide-react-native';

export default function AddActivityModal({ visible, onClose, onAddActivity, courses }) {
    const defaultTime = new Date();
    defaultTime.setHours(9, 0, 0, 0);

    const initialFormState = {
        title: '',
        date: new Date(),
        time: defaultTime,
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
        const { title, date, time, description } = formData;

        if (!title) {
            Alert.alert("ข้อผิดพลาด", "กรุณากรอกชื่อกิจกรรม");
            return;
        }

        const activityDay = getThaiDay(date);
        const activityMinutes = parseTimeToMinutes(time);

        const hasOverlap = courses.some(course => {
            if (course.day === activityDay) {
                const courseStart = parseTimeToMinutes(new Date(course.startTime));
                const courseEnd = parseTimeToMinutes(new Date(course.endTime));
                if (activityMinutes >= courseStart && activityMinutes <= courseEnd) {
                    return true;
                }
            }
            return false;
        });

        if (hasOverlap) {
            Alert.alert("ข้อผิดพลาด", "เวลาของกิจกรรมตรงกับเวลาเรียนในวันดังกล่าว");
            return;
        }

        const newActivity = {
            id: Date.now().toString(),
            title,
            date: date.toISOString(),
            time: time.toISOString(),
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

                        <Text style={styles.inputLabel}>วันที่</Text>
                        <TouchableOpacity style={styles.pickerButton} onPress={() => setShowPicker('date')}>
                            <Text style={styles.pickerText}>{formatDate(formData.date)}</Text>
                            <CalendarIcon size={20} color={COLORS.text} />
                        </TouchableOpacity>

                        <Text style={styles.inputLabel}>เวลา</Text>
                        <TouchableOpacity style={styles.pickerButton} onPress={() => setShowPicker('time')}>
                            <Text style={styles.pickerText}>{formatTime(formData.time)}</Text>
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
                                value={showPicker === 'date' ? formData.date : formData.time}
                                mode={showPicker}
                                is24Hour={true}
                                display="default"
                                onChange={(event, selectedDate) => {
                                    const pickerType = showPicker;
                                    setShowPicker(Platform.OS === 'ios' ? pickerType : null);
                                    if (selectedDate) {
                                        if (pickerType === 'date') {
                                            updateForm('date', selectedDate);
                                        } else {
                                            updateForm('time', selectedDate);
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
