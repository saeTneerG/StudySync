import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { sharedStyles } from '../constants/sharedStyles';

export default function TabBar({ tabs, activeTab, onTabPress }) {
    return (
        <View style={sharedStyles.tabContainer}>
            {tabs.map((tab) => (
                <TouchableOpacity
                    key={tab.key}
                    style={[sharedStyles.tabButton, activeTab === tab.key && sharedStyles.activeTabButton]}
                    onPress={() => onTabPress(tab.key)}
                >
                    <Text style={[sharedStyles.tabText, activeTab === tab.key && sharedStyles.activeTabText]}>
                        {tab.label}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}
