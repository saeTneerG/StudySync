import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { COLORS } from '../constants/colors';

export default function TimeTableScreen() {
    const [activeTab, setActiveTab] = useState('schedule'); // 'schedule' or 'exam'

    const renderScheduleCards = () => {
        // For now, representing an empty schedule where no days have subjects mapped yet.
        const daysWithSubjects = []; // Replace with actual logic to fetch/filter schedule data

        if (daysWithSubjects.length === 0) {
            return (
                <View style={[styles.card, styles.examCard]}>
                    <View style={styles.cardContent}>
                        <Text style={styles.emptyText}>ไม่มีเรียน</Text>
                    </View>
                </View>
            );
        }

        return daysWithSubjects.map((day) => (
            <View key={day.id} style={styles.card}>
                <Text style={[styles.dayText, { color: day.color }]}>{day.name}</Text>
                <View style={styles.cardContent}>
                    {/* Render actual subjects here later */}
                    <Text style={styles.emptyText}>ไม่มีวิชา</Text>
                </View>
            </View>
        ));
    };

    const renderExamCard = () => {
        return (
            <View style={[styles.card, styles.examCard]}>
                <View style={styles.cardContent}>
                    <Text style={styles.emptyText}>ไม่มีตารางสอบ</Text>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header Section */}
            <View style={styles.header}>
                <Text style={styles.logoText}>StudySync</Text>
                <Text style={styles.greetingText}>สวัสดี สมชาย ใจดี</Text>
            </View>

            {/* Subheader Section */}
            <View style={styles.subheader}>
                <Text style={styles.sectionTitle}>Academic</Text>
                <Text style={styles.sectionSubtitle}>จัดการตารางเรียนและตารางสอบ</Text>
            </View>

            {/* Tab Switcher */}
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tabButton, activeTab === 'schedule' && styles.activeTabButton]}
                    onPress={() => setActiveTab('schedule')}
                >
                    <Text style={[styles.tabText, activeTab === 'schedule' && styles.activeTabText]}>
                        ตารางเรียน
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tabButton, activeTab === 'exam' && styles.activeTabButton]}
                    onPress={() => setActiveTab('exam')}
                >
                    <Text style={[styles.tabText, activeTab === 'exam' && styles.activeTabText]}>
                        ตารางสอบ
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Main Action Button */}
            <TouchableOpacity style={styles.addButton}>
                <Text style={styles.addButtonText}>
                    {activeTab === 'schedule' ? '+ เพิ่มรายวิชา' : '+ เพิ่มตารางสอบ'}
                </Text>
            </TouchableOpacity>

            {/* Content List */}
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {activeTab === 'schedule' ? renderScheduleCards() : renderExamCard()}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 15,
        paddingBottom: 15,
        borderBottomWidth: 4,
        borderBottomColor: '#F0F0F0',
    },
    logoText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#f94f8a', // Using the pink from the design
    },
    greetingText: {
        fontSize: 14,
        color: '#888',
        marginTop: 2,
    },
    subheader: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 15,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
    },
    sectionSubtitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    tabContainer: {
        flexDirection: 'row',
        marginHorizontal: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        overflow: 'hidden',
        marginBottom: 15,
    },
    tabButton: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeTabButton: {
        backgroundColor: '#ea6999', // Slightly softer pink for active tab
    },
    tabText: {
        fontSize: 14,
        color: '#888',
        fontWeight: '500',
    },
    activeTabText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    addButton: {
        backgroundColor: '#d85784',
        marginHorizontal: 20,
        borderRadius: 10,
        paddingVertical: 14,
        alignItems: 'center',
        marginBottom: 20,
    },
    addButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
        minHeight: 120, // To give it the rectangular shape shown in the design
    },
    examCard: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    dayText: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 20,
    },
    cardContent: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    emptyText: {
        fontSize: 16,
        color: '#C0C0C0',
    },
});
