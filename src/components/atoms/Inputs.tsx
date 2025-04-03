import React, { useState } from 'react';
import {
    View,
    TextInput,
    Text,
    StyleSheet,
    TouchableOpacity,
    KeyboardTypeOptions
} from 'react-native';

interface InputProps {
    label?: string;
    placeholder?: string;
    value: string;
    onChangeText: (text: string) => void;
    secureTextEntry?: boolean;
    keyboardType?: KeyboardTypeOptions;
    error?: string;
    onBlur?: () => void;
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    autoCorrect?: boolean;
}

export const PrimaryInput: React.FC<InputProps> = ({
    label,
    placeholder,
    value,
    onChangeText,
    secureTextEntry = false,
    keyboardType = 'default',
    error,
    onBlur,
    autoCapitalize = 'none',
    autoCorrect = false,
}) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <View style={styles.inputContainer}>
            {label && <Text style={styles.label}>{label}</Text>}
            <TextInput
                style={[
                    styles.input,
                    isFocused && styles.inputFocused,
                    error && styles.inputError,
                ]}
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
                onFocus={() => setIsFocused(true)}
                onBlur={() => {
                    setIsFocused(false);
                    onBlur && onBlur();
                }}
                autoCapitalize={autoCapitalize}
                autoCorrect={autoCorrect}
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

interface SearchInputProps {
    placeholder?: string;
    value: string;
    onChangeText: (text: string) => void;
    onSearch?: () => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({
    placeholder = '검색',
    value,
    onChangeText,
    onSearch,
}) => {
    return (
        <View style={styles.searchContainer}>
            <TextInput
                style={styles.searchInput}
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                onSubmitEditing={onSearch}
                returnKeyType="search"
            />
            {value.length > 0 && (
                <TouchableOpacity
                    style={styles.clearButton}
                    onPress={() => onChangeText('')}
                >
                    <Text style={styles.clearButtonText}>×</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        marginBottom: 16,
        width: '100%',
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 6,
        color: '#414C57',
    },
    input: {
        height: 48,
        borderWidth: 1,
        borderColor: '#E0E7FF',
        borderRadius: 8,
        paddingHorizontal: 16,
        fontSize: 16,
        backgroundColor: '#F8FAFF',
    },
    inputFocused: {
        borderColor: '#5C6BC0',
        backgroundColor: '#FFFFFF',
    },
    inputError: {
        borderColor: '#E57373',
    },
    errorText: {
        fontSize: 12,
        color: '#E57373',
        marginTop: 4,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0E7FF',
        borderRadius: 24,
        height: 48,
        paddingHorizontal: 16,
        backgroundColor: '#F8FAFF',
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
    },
    clearButton: {
        padding: 4,
    },
    clearButtonText: {
        fontSize: 18,
        color: '#9E9E9E',
        fontWeight: 'bold',
    },
}); 