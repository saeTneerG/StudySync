import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { db } from '../config/firebase';
import { collection, doc, setDoc, deleteDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { AuthContext } from './AuthContext';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const { userInfo } = useContext(AuthContext);

    const [courses, setCourses] = useState([]);
    const [activities, setActivities] = useState([]);
    const [studyPlanItems, setStudyPlanItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!userInfo?.id) return;

        setIsLoading(true);

        const coursesRef = collection(db, "users", userInfo.id, "courses");
        const unsubscribeCourses = onSnapshot(coursesRef, (snapshot) => {
            const loadedCourses = [];
            snapshot.forEach((d) => {
                loadedCourses.push({ id: d.id, ...d.data(), exams: d.data().exams || [] });
            });
            setCourses(loadedCourses);
        }, (error) => {
            console.error("Failed to listen to courses", error);
        });

        const activitiesRef = collection(db, "users", userInfo.id, "activities");
        const unsubscribeActivities = onSnapshot(activitiesRef, (snapshot) => {
            const loadedActivities = [];
            snapshot.forEach((d) => {
                loadedActivities.push({ id: d.id, ...d.data() });
            });
            loadedActivities.sort((a, b) => new Date(a.time) - new Date(b.time));
            setActivities(loadedActivities);
        }, (error) => {
            console.error("Failed to listen to activities", error);
        });

        const studyPlanRef = collection(db, "users", userInfo.id, "studyPlanItems");
        const unsubscribeStudyPlan = onSnapshot(studyPlanRef, (snapshot) => {
            const loadedStudyPlanItems = [];
            snapshot.forEach((d) => {
                loadedStudyPlanItems.push({ id: d.id, ...d.data() });
            });
            loadedStudyPlanItems.sort((a, b) => a.createdAt - b.createdAt);
            setStudyPlanItems(loadedStudyPlanItems);

            // Set loading to false once at least one snapshot resolves (simplification)
            setIsLoading(false);
        }, (error) => {
            console.error("Failed to listen to study plan", error);
            setIsLoading(false);
        });

        return () => {
            unsubscribeCourses();
            unsubscribeActivities();
            unsubscribeStudyPlan();
        };
    }, [userInfo?.id]);

    const addCourse = async (newCourse) => {
        if (!userInfo?.id) return;
        const courseWithExams = { ...newCourse, exams: [] };
        try {
            const courseRef = doc(db, "users", userInfo.id, "courses", newCourse.id);
            await setDoc(courseRef, courseWithExams);
        } catch (e) {
            console.error("Failed to save course", e);
            Alert.alert("ข้อผิดพลาด", "ไม่สามารถบันทึกข้อมูลได้");
            throw e;
        }
    };

    const deleteCourse = async (id) => {
        if (!userInfo?.id) return;
        const previous = [...courses];
        const previousStudyPlan = [...studyPlanItems];
        const linkedItems = studyPlanItems.filter(i => i.courseId === id);

        setCourses(prev => prev.filter(c => c.id !== id));
        setStudyPlanItems(prev => prev.filter(i => i.courseId !== id));

        try {
            const courseRef = doc(db, "users", userInfo.id, "courses", id);
            await deleteDoc(courseRef);

            const deletePromises = linkedItems.map(item =>
                deleteDoc(doc(db, "users", userInfo.id, "studyPlanItems", item.id))
            );
            await Promise.all(deletePromises);
        } catch (e) {
            console.error("Failed to delete course", e);
            setCourses(previous);
            setStudyPlanItems(previousStudyPlan);
            Alert.alert("ข้อผิดพลาด", "ไม่สามารถลบข้อมูลได้");
        }
    };

    const clearAllData = async () => {
        if (!userInfo?.id) return;
        try {
            const deletePromises = [];
            const userId = userInfo.id;

            // Clear Courses
            const coursesRef = collection(db, "users", userId, "courses");
            const coursesSnapshot = await getDocs(coursesRef);
            coursesSnapshot.forEach((document) => {
                deletePromises.push(deleteDoc(doc(db, "users", userId, "courses", document.id)));
            });

            // Clear Activities
            const activitiesRef = collection(db, "users", userId, "activities");
            const activitiesSnapshot = await getDocs(activitiesRef);
            activitiesSnapshot.forEach((document) => {
                deletePromises.push(deleteDoc(doc(db, "users", userId, "activities", document.id)));
            });

            // Clear Study Plan
            const studyPlanRef = collection(db, "users", userId, "studyPlanItems");
            const studyPlanSnapshot = await getDocs(studyPlanRef);
            studyPlanSnapshot.forEach((document) => {
                deletePromises.push(deleteDoc(doc(db, "users", userId, "studyPlanItems", document.id)));
            });

            await Promise.all(deletePromises);
            Alert.alert('สำเร็จ', 'ล้างข้อมูลทั้งหมดเรียบร้อยแล้ว');
        } catch (e) {
            console.error("Failed to delete all data", e);
            Alert.alert('ข้อผิดพลาด', 'ไม่สามารถล้างข้อมูลได้');
        }
    };

    const addExam = async (newExam) => {
        if (!userInfo?.id) return;
        let targetCourse = null;
        const updated = courses.map(course => {
            if (course.id === newExam.courseId) {
                targetCourse = { ...course, exams: [...course.exams, newExam] };
                return targetCourse;
            }
            return course;
        });
        if (!targetCourse) return;

        try {
            const courseRef = doc(db, "users", userInfo.id, "courses", targetCourse.id);
            await setDoc(courseRef, targetCourse);
        } catch (e) {
            console.error("Failed to save exam", e);
            Alert.alert("ข้อผิดพลาด", "ไม่สามารถบันทึกข้อมูลได้");
            throw e;
        }
    };

    const deleteExam = async (examId, courseId) => {
        if (!userInfo?.id) return;
        let targetCourse = null;
        courses.map(course => {
            if (course.id === courseId) {
                targetCourse = { ...course, exams: course.exams.filter(e => e.id !== examId) };
            }
        });

        if (targetCourse) {
            try {
                const courseRef = doc(db, "users", userInfo.id, "courses", courseId);
                await setDoc(courseRef, targetCourse);
            } catch (e) {
                console.error("Failed to delete exam", e);
                Alert.alert("ข้อผิดพลาด", "ไม่สามารถลบข้อมูลได้");
            }
        }
    };

    const addActivity = async (newActivity) => {
        if (!userInfo?.id) return;

        try {
            const activityRef = doc(db, "users", userInfo.id, "activities", newActivity.id);
            await setDoc(activityRef, newActivity);
        } catch (e) {
            console.error("Failed to save activity", e);
            Alert.alert("ข้อผิดพลาด", "ไม่สามารถบันทึกข้อมูลได้");
            throw e;
        }
    };

    const deleteActivity = async (id) => {
        if (!userInfo?.id) return;

        try {
            const activityRef = doc(db, "users", userInfo.id, "activities", id);
            await deleteDoc(activityRef);
        } catch (e) {
            console.error("Failed to delete activity", e);
            Alert.alert("ข้อผิดพลาด", "ไม่สามารถลบข้อมูลได้");
        }
    };

    const addStudyPlanItem = async (newItem) => {
        if (!userInfo?.id) return;

        try {
            const itemRef = doc(db, "users", userInfo.id, "studyPlanItems", newItem.id);
            await setDoc(itemRef, newItem);
        } catch (e) {
            console.error("Failed to save study plan item", e);
            Alert.alert("ข้อผิดพลาด", "ไม่สามารถบันทึกรายการได้");
            throw e;
        }
    };

    const toggleStudyPlanItem = async (id) => {
        if (!userInfo?.id) return;
        const item = studyPlanItems.find(i => i.id === id);
        if (!item) return;

        const updatedCompleted = !item.completed;
        // Optimistically update
        setStudyPlanItems(prev =>
            prev.map(i => i.id === id ? { ...i, completed: updatedCompleted } : i)
        );

        try {
            const itemRef = doc(db, "users", userInfo.id, "studyPlanItems", id);
            await updateDoc(itemRef, { completed: updatedCompleted });
        } catch (e) {
            console.error("Failed to update study plan item", e);
            Alert.alert("ข้อผิดพลาด", "ไม่สามารถอัปเดตสถานะได้");
            // Revert optimistic update
            setStudyPlanItems(prev =>
                prev.map(i => i.id === id ? { ...i, completed: !updatedCompleted } : i)
            );
        }
    };

    const deleteStudyPlanItem = async (id) => {
        if (!userInfo?.id) return;

        try {
            const itemRef = doc(db, "users", userInfo.id, "studyPlanItems", id);
            await deleteDoc(itemRef);
        } catch (e) {
            console.error("Failed to delete study plan item", e);
            Alert.alert("ข้อผิดพลาด", "ไม่สามารถลบรายการได้");
        }
    };

    return (
        <DataContext.Provider value={{
            courses,
            activities,
            studyPlanItems,
            isLoading,
            addCourse,
            deleteCourse,
            clearAllData,
            addExam,
            deleteExam,
            addActivity,
            deleteActivity,
            addStudyPlanItem,
            toggleStudyPlanItem,
            deleteStudyPlanItem,
            refreshData: () => { }, // refreshData is no longer needed but kept for backward compatibility if any component calls it
        }}>
            {children}
        </DataContext.Provider>
    );
};
