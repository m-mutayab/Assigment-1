import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePassword = (pw) => pw.length >= 8 && /\d/.test(pw);

const LoginScreen = () => {
  const { login, signup, authLoading } = useAuth();
  const { theme } = useTheme();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  const validate = () => {
    const e = {};
    if (!isLogin && name.trim().length < 2) e.name = 'Name must be at least 2 characters.';
    if (!validateEmail(email)) e.email = 'Enter a valid email address.';
    if (!validatePassword(password)) e.password = 'Password must be 8+ characters with at least one digit.';
    if (!isLogin && password !== confirmPassword) e.confirmPassword = 'Passwords do not match.';
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    setSubmitError('');
    try {
      if (isLogin) {
        await login(email.trim().toLowerCase(), password);
      } else {
        await signup(name.trim(), email.trim().toLowerCase(), password);
      }
    } catch (err) {
      setSubmitError(err.message);
    }
  };

  const toggleMode = () => {
    setIsLogin((prev) => !prev);
    setErrors({});
    setSubmitError('');
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const s = styles(theme);

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={s.container} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
        <Text style={s.logo}>🍽️</Text>
        <Text style={s.title}>Tastique</Text>
        <Text style={s.subtitle}>{isLogin ? 'Welcome back!' : 'Create your account'}</Text>

        <View style={s.card}>
          {!isLogin && (
            <View style={s.field}>
              <Text style={s.label}>Full Name</Text>
              <TextInput
                style={[s.input, errors.name && s.inputError]}
                placeholder="Your full name"
                placeholderTextColor={theme.textLight}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
              {errors.name && <Text style={s.errorText}>{errors.name}</Text>}
            </View>
          )}
          <View style={s.field}>
            <Text style={s.label}>Email</Text>
            <TextInput
              style={[s.input, errors.email && s.inputError]}
              placeholder="you@example.com"
              placeholderTextColor={theme.textLight}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.email && <Text style={s.errorText}>{errors.email}</Text>}
          </View>
          <View style={s.field}>
            <Text style={s.label}>Password</Text>
            <View style={s.inputRow}>
              <TextInput
                style={[s.input, s.inputFlex, errors.password && s.inputError]}
                placeholder="Min 8 chars, 1 digit"
                placeholderTextColor={theme.textLight}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword((p) => !p)} style={s.eyeBtn}>
                <Text>{showPassword ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>
            {errors.password && <Text style={s.errorText}>{errors.password}</Text>}
          </View>
          {!isLogin && (
            <View style={s.field}>
              <Text style={s.label}>Confirm Password</Text>
              <View style={s.inputRow}>
                <TextInput
                  style={[s.input, s.inputFlex, errors.confirmPassword && s.inputError]}
                  placeholder="Re-enter password"
                  placeholderTextColor={theme.textLight}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirm}
                />
                <TouchableOpacity onPress={() => setShowConfirm((p) => !p)} style={s.eyeBtn}>
                  <Text>{showConfirm ? '🙈' : '👁️'}</Text>
                </TouchableOpacity>
              </View>
              {errors.confirmPassword && <Text style={s.errorText}>{errors.confirmPassword}</Text>}
            </View>
          )}

          {submitError ? <Text style={s.submitError}>{submitError}</Text> : null}

          <TouchableOpacity
            style={[s.submitBtn, authLoading && s.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={authLoading}
          >
            {authLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={s.submitText}>{isLogin ? 'Sign In' : 'Create Account'}</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={toggleMode} style={s.toggleBtn}>
            <Text style={s.toggleText}>
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <Text style={{ color: theme.primary, fontWeight: '700' }}>
                {isLogin ? 'Sign Up' : 'Sign In'}
              </Text>
            </Text>
          </TouchableOpacity>
        </View>

        <View style={s.hintCard}>
          <Text style={[s.hintTitle, { color: theme.textSecondary }]}>Demo Credentials</Text>
          <Text style={[s.hint, { color: theme.textLight }]}>👤 Customer: customer@demo.com / customer123</Text>
          <Text style={[s.hint, { color: theme.textLight }]}>👨‍💼 Manager: manager@demo.com / manager123</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = (theme) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    content: { padding: 24, paddingTop: 60, alignItems: 'center' },
    logo: { fontSize: 64, marginBottom: 8 },
    title: { fontSize: 32, fontWeight: '800', color: theme.primary, letterSpacing: 1 },
    subtitle: { fontSize: 16, color: theme.textSecondary, marginBottom: 28, marginTop: 4 },
    card: {
      width: '100%', backgroundColor: theme.card,
      borderRadius: 16, padding: 20,
      elevation: 4, shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 8,
    },
    field: { marginBottom: 14 },
    label: { color: theme.textSecondary, fontSize: 13, marginBottom: 4, fontWeight: '600' },
    input: {
      backgroundColor: theme.inputBg, borderRadius: 10, padding: 12,
      color: theme.text, fontSize: 15, borderWidth: 1, borderColor: theme.border,
    },
    inputFlex: { flex: 1 },
    inputError: { borderColor: theme.error },
    inputRow: { flexDirection: 'row', alignItems: 'center' },
    eyeBtn: { padding: 12 },
    errorText: { color: theme.error, fontSize: 12, marginTop: 4 },
    submitError: {
      color: theme.error, fontSize: 13, marginBottom: 10,
      textAlign: 'center', backgroundColor: '#FFF0F0', padding: 8, borderRadius: 8,
    },
    submitBtn: {
      backgroundColor: theme.primary, borderRadius: 12,
      padding: 15, alignItems: 'center', marginTop: 4,
    },
    submitBtnDisabled: { opacity: 0.7 },
    submitText: { color: '#fff', fontSize: 16, fontWeight: '700' },
    toggleBtn: { marginTop: 16, alignItems: 'center' },
    toggleText: { color: theme.textSecondary, fontSize: 14 },
    hintCard: {
      marginTop: 20, width: '100%',
      backgroundColor: theme.surface, borderRadius: 12, padding: 14,
      borderWidth: 1, borderColor: theme.border,
    },
    hintTitle: { fontSize: 13, fontWeight: '700', marginBottom: 6 },
    hint: { fontSize: 12, marginBottom: 3 },
  });

export default LoginScreen;
