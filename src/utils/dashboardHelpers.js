import { COLORS } from '../constants/colors';

export const getNextClass = (courses) => {
    if (!courses || courses.length === 0) return null;

    const dayMap = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
    const now = new Date();
    const currentDayIndex = now.getDay();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    let upcomingClasses = [];

    courses.forEach(course => {
        if (!course.startTime || !course.endTime) return;
        const courseDate = new Date(course.startTime);
        const startMinutes = courseDate.getHours() * 60 + courseDate.getMinutes();

        const endDate = new Date(course.endTime);
        const endMinutes = endDate.getHours() * 60 + endDate.getMinutes();

        const courseDayIndex = dayMap.indexOf(course.day);

        let daysAhead = (courseDayIndex - currentDayIndex + 7) % 7;

        if (daysAhead === 0 && endMinutes <= currentMinutes) {
            daysAhead = 7;
        }

        const exactTimeAheadMinutes = daysAhead * 24 * 60 + startMinutes - currentMinutes;

        upcomingClasses.push({
            ...course,
            exactTimeAheadMinutes,
        });
    });

    upcomingClasses.sort((a, b) => a.exactTimeAheadMinutes - b.exactTimeAheadMinutes);

    return upcomingClasses[0] || null;
};

export const getUpcomingExams = (courses) => {
    if (!courses || courses.length === 0) return [];

    let allExams = [];
    courses.forEach(course => {
        if (course.exams && Array.isArray(course.exams)) {
            course.exams.forEach(exam => {
                allExams.push({
                    ...exam,
                    subjectName: exam.subjectName || course.subjectName,
                    subjectCode: exam.subjectCode || course.subjectCode,
                });
            });
        }
    });

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const endOf7Days = startOfToday + (7 * 24 * 60 * 60 * 1000) + (24 * 60 * 60 * 1000 - 1);

    const upcomingExams = allExams.filter(exam => {
        if (!exam.date) return false;
        const examDate = new Date(exam.date).getTime();
        return examDate >= startOfToday && examDate <= endOf7Days;
    });

    upcomingExams.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return upcomingExams;
};
