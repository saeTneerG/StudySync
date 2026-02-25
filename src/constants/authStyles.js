import { StyleSheet } from 'react-native';
import { COLORS } from './colors';

export const authStyles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        padding: 24,
        justifyContent: 'center',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
    },

    header: {
        alignItems: 'center',
        marginBottom: 25,
    },
    logoContainer: {
        width: 80,
        height: 80,
        backgroundColor: COLORS.white,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        ...COLORS.cardShadow,
    },
    appName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.white,
        marginBottom: 5,
    },
    appSubtitle: {
        fontSize: 16,
        color: COLORS.white,
        opacity: 0.9,
    },

    card: {
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: 25,
        ...COLORS.cardShadow,
        elevation: 5,
    },
    cardTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.text,
        textAlign: 'center',
        marginBottom: 22,
    },

    inputWrapper: {
        marginBottom: 18,
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    label: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginLeft: 8,
        fontWeight: '500',
    },
    input: {
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 12,
        paddingHorizontal: 15,
        height: 50,
        fontSize: 15,
        color: COLORS.text,
        backgroundColor: COLORS.inputBackground,
    },

    primaryButton: {
        backgroundColor: COLORS.primary,
        borderRadius: 12,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    primaryButtonText: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: 'bold',
    },

    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 22,
    },
    switchText: {
        color: COLORS.textSecondary,
        fontSize: 14,
    },
    switchLink: {
        color: COLORS.primary,
        fontSize: 14,
        fontWeight: 'bold',
    },
});
