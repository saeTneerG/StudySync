import React, { useContext } from 'react';
import { View, Text } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { sharedStyles } from '../constants/sharedStyles';

export default function ScreenHeader({ name }) {
    const { userInfo } = useContext(AuthContext);
    const displayName = name ?? userInfo?.name;

    return (
        <>
            <View style={sharedStyles.header}>
                <Text style={sharedStyles.appName}>StudySync</Text>
                <Text style={sharedStyles.greeting}>สวัสดี {displayName}</Text>
            </View>
            <View style={sharedStyles.divider} />
        </>
    );
}
