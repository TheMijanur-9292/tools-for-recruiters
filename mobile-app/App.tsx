import { useMemo, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { DEMO_TEMPLATES } from "./src/demoTemplates";
import { generateWithGroq } from "./src/groq";
import { modules } from "./src/modules";
import { themeLabels, themes, ThemeName } from "./src/theme";

function normalizeGeneratedText(text: string) {
  return text
    .replace(/^#{1,6}\s*/gm, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/^\s*[-*]\s+/gm, "- ")
    .replace(/`/g, "")
    .trim();
}

export default function App() {
  const [themeName, setThemeName] = useState<ThemeName>("light");
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);

  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const palette = themes[themeName];
  const selectedModule = modules.find((item) => item.id === selectedModuleId) ?? null;
  const selectedTemplates = selectedModule ? DEMO_TEMPLATES[selectedModule.id] ?? [] : [];

  const dynamicStyles = useMemo(
    () =>
      StyleSheet.create({
        root: {
          flex: 1,
          backgroundColor: palette.background,
        },
        navWrap: {
          marginHorizontal: 16,
          marginTop: 8,
          marginBottom: 10,
          borderRadius: 18,
          overflow: "hidden",
          borderWidth: 1,
          borderColor: palette.border,
        },
        navInner: {
          padding: 12,
        },
        navTopRow: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 10,
        },
        brandRow: {
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
        },
        brandBadge: {
          width: 30,
          height: 30,
          borderRadius: 8,
          backgroundColor: "rgba(255,255,255,0.16)",
          alignItems: "center",
          justifyContent: "center",
        },
        brandLabel: {
          color: "#dbe9ff",
          fontSize: 10,
          textTransform: "uppercase",
          fontWeight: "700",
          letterSpacing: 1,
        },
        brandTitle: {
          color: "#ffffff",
          fontSize: 16,
          fontWeight: "700",
        },
        navTabs: {
          flexDirection: "row",
          gap: 8,
        },
        navTab: {
          borderRadius: 999,
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.35)",
          backgroundColor: "rgba(255,255,255,0.12)",
          paddingHorizontal: 10,
          paddingVertical: 6,
        },
        navTabActive: {
          backgroundColor: "#ffffff",
        },
        navTabText: {
          color: "#dce8ff",
          fontSize: 11,
          fontWeight: "700",
          textTransform: "uppercase",
          letterSpacing: 0.8,
        },
        navTabTextActive: {
          color: "#0f3b88",
        },
        topBar: {
          marginHorizontal: 16,
          marginBottom: 10,
          gap: 12,
        },
        topLabel: {
          color: palette.primary,
          textTransform: "uppercase",
          letterSpacing: 1.4,
          fontSize: 12,
          fontWeight: "700",
        },
        topTitle: {
          color: palette.text,
          fontSize: 27,
          fontWeight: "700",
          lineHeight: 32,
        },
        hero: {
          borderRadius: 22,
          borderWidth: 1,
          borderColor: palette.border,
          marginHorizontal: 16,
          padding: 16,
          marginBottom: 14,
        },
        heroTitle: {
          color: "#ffffff",
          fontSize: 20,
          fontWeight: "700",
          marginBottom: 6,
        },
        heroText: {
          color: "#f4f7ff",
          fontSize: 13,
          lineHeight: 20,
        },
        sectionTitle: {
          color: palette.text,
          fontSize: 18,
          fontWeight: "700",
          marginHorizontal: 16,
          marginBottom: 10,
        },
        card: {
          marginHorizontal: 16,
          marginBottom: 10,
          borderRadius: 18,
          borderWidth: 1,
          borderColor: palette.border,
          backgroundColor: palette.surface,
          padding: 14,
        },
        cardHeader: {
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          marginBottom: 8,
        },
        iconBox: {
          borderRadius: 12,
          backgroundColor: palette.elevated,
          width: 34,
          height: 34,
          alignItems: "center",
          justifyContent: "center",
        },
        cardTitle: {
          color: palette.text,
          fontSize: 16,
          fontWeight: "700",
          flex: 1,
        },
        cardDesc: {
          color: palette.mutedText,
          fontSize: 13,
          lineHeight: 19,
          marginBottom: 8,
        },
        openText: {
          color: palette.primary,
          fontWeight: "700",
          fontSize: 13,
        },
        chipRow: {
          marginHorizontal: 16,
          marginBottom: 10,
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 8,
        },
        chip: {
          borderRadius: 999,
          borderWidth: 1,
          borderColor: palette.border,
          paddingHorizontal: 12,
          paddingVertical: 8,
          backgroundColor: palette.chip,
        },
        chipSelected: {
          backgroundColor: palette.primary,
          borderColor: palette.primary,
        },
        chipText: {
          color: palette.mutedText,
          fontSize: 12,
          fontWeight: "700",
        },
        chipTextSelected: {
          color: "#ffffff",
        },
        templateCard: {
          width: 220,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: palette.border,
          backgroundColor: palette.elevated,
          padding: 10,
          marginRight: 8,
        },
      }),
    [palette]
  );

  async function runGeneration() {
    if (!selectedModule) {
      return;
    }

    setError("");
    setIsLoading(true);
    try {
      const content = await generateWithGroq(selectedModule.title, input.trim());
      setOutput(normalizeGeneratedText(content));
      setCopied(false);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unexpected error while generating output."
      );
    } finally {
      setIsLoading(false);
    }
  }

  function openModule(moduleId: string, moduleSample: string) {
    setSelectedModuleId(moduleId);
    setInput(moduleSample);
    setOutput("");
    setCopied(false);
    setError("");
  }

  function goBack() {
    setSelectedModuleId(null);
  }

  async function copyWholeOutput() {
    if (!output) {
      return;
    }

    await Clipboard.setStringAsync(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }

  return (
    <SafeAreaView style={dynamicStyles.root}>
      <StatusBar style={themeName === "light" || themeName === "sepia" ? "dark" : "light"} />

      <LinearGradient
        colors={[palette.heroA, palette.heroB]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={dynamicStyles.navWrap}
      >
        <View style={dynamicStyles.navInner}>
          <View style={dynamicStyles.navTopRow}>
            <View style={dynamicStyles.brandRow}>
              <View style={dynamicStyles.brandBadge}>
                <Ionicons name="business-outline" size={16} color="#ffffff" />
              </View>
              <View>
                <Text style={dynamicStyles.brandLabel}>2Coms Consulting Pvt Ltd</Text>
                <Text style={dynamicStyles.brandTitle}>AI Challenge Mobile</Text>
              </View>
            </View>

            <View style={dynamicStyles.navTabs}>
              <View style={[dynamicStyles.navTab, !selectedModule && dynamicStyles.navTabActive]}>
                <Text
                  style={[
                    dynamicStyles.navTabText,
                    !selectedModule && dynamicStyles.navTabTextActive,
                  ]}
                >
                  Modules
                </Text>
              </View>
              <View style={[dynamicStyles.navTab, selectedModule && dynamicStyles.navTabActive]}>
                <Text
                  style={[
                    dynamicStyles.navTabText,
                    selectedModule && dynamicStyles.navTabTextActive,
                  ]}
                >
                  Workspace
                </Text>
              </View>
            </View>
          </View>
        </View>
      </LinearGradient>

      <View style={dynamicStyles.topBar}>
        <Text style={dynamicStyles.topLabel}>Theme Mode</Text>
        <Text style={dynamicStyles.topTitle}>Pick Your Interface Style</Text>
      </View>

      <View style={dynamicStyles.chipRow}>
        {(Object.keys(themeLabels) as ThemeName[]).map((mode) => {
          const selected = mode === themeName;
          return (
            <Pressable
              key={mode}
              onPress={() => setThemeName(mode)}
              style={[dynamicStyles.chip, selected && dynamicStyles.chipSelected]}
            >
              <Text
                style={[dynamicStyles.chipText, selected && dynamicStyles.chipTextSelected]}
              >
                {themeLabels[mode]}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {!selectedModule ? (
        <ScrollView contentContainerStyle={{ paddingBottom: 22 }}>
          <LinearGradient
            colors={[palette.heroA, palette.heroB]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={dynamicStyles.hero}
          >
            <Text style={dynamicStyles.heroTitle}>Seven AI Modules In One App</Text>
            <Text style={dynamicStyles.heroText}>
              Built for recruitment, international hiring, HR operations, and outsourcing workflows.
            </Text>
          </LinearGradient>

          <Text style={dynamicStyles.sectionTitle}>Feature Modules</Text>

          {modules.map((item) => (
            <Pressable
              key={item.id}
              style={dynamicStyles.card}
              onPress={() => openModule(item.id, item.sampleInput)}
            >
              <View style={dynamicStyles.cardHeader}>
                <View style={dynamicStyles.iconBox}>
                  <Ionicons
                    name={item.icon as keyof typeof Ionicons.glyphMap}
                    size={18}
                    color={palette.primary}
                  />
                </View>
                <Text style={dynamicStyles.cardTitle}>{item.title}</Text>
              </View>
              <Text style={dynamicStyles.cardDesc}>{item.shortDescription}</Text>
              <Text style={dynamicStyles.openText}>Open Module</Text>
            </Pressable>
          ))}
        </ScrollView>
      ) : (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={{ paddingBottom: 26 }}>
            <LinearGradient
              colors={[palette.heroA, palette.heroB]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={dynamicStyles.hero}
            >
              <Pressable
                onPress={goBack}
                style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}
              >
                <Ionicons name="arrow-back" size={16} color="#ffffff" />
                <Text style={{ color: "#ffffff", fontWeight: "700", marginLeft: 6 }}>
                  Back to Modules
                </Text>
              </Pressable>
              <Text style={dynamicStyles.heroTitle}>{selectedModule.title}</Text>
              <Text style={dynamicStyles.heroText}>{selectedModule.shortDescription}</Text>
            </LinearGradient>

            <Text style={dynamicStyles.sectionTitle}>What This Page Can Do</Text>
            <View style={dynamicStyles.card}>
              {selectedModule.introLines.map((line) => (
                <Text
                  key={line}
                  style={{
                    color: palette.mutedText,
                    fontSize: 13,
                    lineHeight: 20,
                    marginBottom: 8,
                  }}
                >
                  {line}
                </Text>
              ))}
            </View>

            <Text style={dynamicStyles.sectionTitle}>Capabilities</Text>
            <View style={dynamicStyles.card}>
              {selectedModule.capabilities.map((capability) => (
                <Text
                  key={capability}
                  style={{
                    color: palette.mutedText,
                    fontSize: 13,
                    lineHeight: 20,
                    marginBottom: 7,
                  }}
                >
                  - {capability}
                </Text>
              ))}
            </View>

            <Text style={dynamicStyles.sectionTitle}>AI Workspace</Text>
            <View style={dynamicStyles.card}>
              <Text style={{ color: palette.text, fontWeight: "700", marginBottom: 8 }}>
                Suggested Demo Templates
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 2, marginBottom: 10 }}
              >
                {selectedTemplates.map((template) => (
                  <Pressable
                    key={template.title}
                    onPress={() => setInput(template.prompt)}
                    style={dynamicStyles.templateCard}
                  >
                    <Text style={{ color: palette.text, fontWeight: "700", fontSize: 13 }}>
                      {template.title}
                    </Text>
                    <Text style={{ color: palette.mutedText, fontSize: 12, marginTop: 4 }}>
                      {template.note}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>

              <Text style={{ color: palette.text, fontWeight: "700", marginBottom: 8 }}>
                Scenario Input
              </Text>
              <TextInput
                value={input}
                onChangeText={setInput}
                multiline
                style={{
                  minHeight: 115,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: palette.border,
                  backgroundColor: palette.background,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  color: palette.text,
                  textAlignVertical: "top",
                  marginBottom: 12,
                }}
              />
              <Pressable
                onPress={runGeneration}
                disabled={isLoading || !input.trim()}
                style={{
                  alignSelf: "flex-start",
                  borderRadius: 10,
                  backgroundColor: isLoading ? palette.primaryStrong : palette.primary,
                  paddingHorizontal: 14,
                  paddingVertical: 10,
                  opacity: !input.trim() ? 0.6 : 1,
                }}
              >
                <Text style={{ color: "#ffffff", fontWeight: "700" }}>
                  {isLoading ? "Generating..." : "Generate Draft"}
                </Text>
              </Pressable>

              <Pressable
                onPress={copyWholeOutput}
                disabled={!output}
                style={{
                  alignSelf: "flex-start",
                  marginTop: 8,
                  borderRadius: 10,
                  backgroundColor: palette.elevated,
                  paddingHorizontal: 14,
                  paddingVertical: 10,
                  opacity: output ? 1 : 0.55,
                }}
              >
                <Text style={{ color: palette.text, fontWeight: "700" }}>
                  {copied ? "Copied" : "Copy Whole Response"}
                </Text>
              </Pressable>

              {error ? (
                <Text style={{ color: "#d43b3b", marginTop: 10, fontSize: 12 }}>{error}</Text>
              ) : null}

              <Text
                style={{
                  color: palette.text,
                  fontWeight: "700",
                  marginTop: 14,
                  marginBottom: 8,
                }}
              >
                AI Output
              </Text>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: palette.border,
                  borderRadius: 12,
                  backgroundColor: palette.elevated,
                  padding: 12,
                }}
              >
                <Text style={{ color: palette.mutedText, lineHeight: 20, fontSize: 13 }}>
                  {output || "Generated output will appear here."}
                </Text>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}
