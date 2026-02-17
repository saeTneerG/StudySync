import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Calendar, ListTodo, User } from 'lucide-react-native';
import { View, Text } from 'react-native';

import DashboardScreen from '../screen/DashboardScreen';
import TimeTableScreen from '../screen/TimeTableScreen';
import PlanerScreen from '../screen/PlanerScreen';
import ProfileScreen from '../screen/ProfileScreen';
import { COLORS } from '../constants/colors';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: COLORS.textSecondary,
                tabBarStyle: {
                    backgroundColor: COLORS.white,
                    borderTopColor: COLORS.border,
                    height: 60,
                    paddingBottom: 10,
                    paddingTop: 10,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                }
            }}
        >
            <Tab.Screen
                name="Dashboard"
                component={DashboardScreen}
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <Home color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="TimeTable"
                component={TimeTableScreen}
                options={{
                    tabBarLabel: 'Time Table',
                    tabBarIcon: ({ color, size }) => (
                        <Calendar color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="Planer"
                component={PlanerScreen}
                options={{
                    tabBarLabel: 'Planer',
                    tabBarIcon: ({ color, size }) => (
                        <ListTodo color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarLabel: 'Profile',
                    tabBarIcon: ({ color, size }) => (
                        <User color={color} size={size} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}
