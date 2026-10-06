/**
 * src/screens/Home.js
 * Home screen for Little Lemon (Zestly app).
 * Features:
 * 1. Header with logo and tap-to-profile avatar
 * 2. Hero with restaurant story, photo, and 500ms debounced search bar
 * 3. Menu breakdown with dynamic multi-select category chips
 * 4. Vertically scrollable FlatList of dishes with SQLite caching & fallback
 */

import React, { useState, useEffect, useCallback, useMemo, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import debounce from 'lodash.debounce';
import Header from '../components/Header';
import Hero from '../components/Hero';
import CategoryChips from '../components/CategoryChips';
import MenuItem from '../components/MenuItem';
import {
  getDb,
  getMenuCount,
  saveMenuItems,
  filterMenuItems,
  getDistinctCategories,
  FALLBACK_MENU_ITEMS,
} from '../database';
import { getProfile } from '../storage/profileStorage';
import { colors, fonts, spacing, borderRadius } from '../theme';
import { AuthContext, ROUTES } from '../navigation/routes';

const API_URL =
  'https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json';

export default function Home({ navigation }) {
  const authContext = useContext(AuthContext);

  // Profile data for header avatar
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    avatar: null,
  });

  // Menu data states
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sync profile when screen gains focus or authContext updates
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      const data = await getProfile();
      setProfile(data);
    });
    // Initial fetch
    (async () => {
      const data = await getProfile();
      setProfile(data);
    })();
    return unsubscribe;
  }, [navigation]);

  // Sync if authContext profile changes
  useEffect(() => {
    if (authContext && authContext.userProfile) {
      setProfile(authContext.userProfile);
    }
  }, [authContext?.userProfile]);

  // Performs database query with current filter params
  const executeQuery = useCallback(async (queryText, catList) => {
    try {
      const filtered = await filterMenuItems(queryText, catList);
      setMenuItems(filtered);
    } catch (err) {
      console.error('Error filtering menu items from SQLite:', err);
    }
  }, []);

  // 500ms debounced search runner
  const debouncedSearch = useMemo(
    () =>
      debounce((text, currentCats) => {
        executeQuery(text, currentCats);
      }, 500),
    [executeQuery]
  );

  // Cleanup debounced handler on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  // Load menu: checks SQLite first; if empty, fetches remote and populates DB
  const loadMenu = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await getDb();
      const count = await getMenuCount();

      if (count > 0) {
        // Load immediately from SQLite cache
        const cached = await filterMenuItems('', []);
        setMenuItems(cached);
        const distinctCats = await getDistinctCategories();
        setCategories(
          distinctCats.length > 0
            ? distinctCats
            : ['starters', 'mains', 'desserts', 'drinks']
        );
        setIsLoading(false);

        // Background refresh from remote API if available
        fetchRemoteMenu(false);
      } else {
        // Initial run: fetch remote or fallback
        await fetchRemoteMenu(true);
      }
    } catch (err) {
      console.error('Failed to load menu data:', err);
      // Fallback resilience
      try {
        await saveMenuItems(FALLBACK_MENU_ITEMS);
        const fallbackItems = await filterMenuItems('', []);
        setMenuItems(fallbackItems);
        const distinctCats = await getDistinctCategories();
        setCategories(distinctCats);
      } catch (fallbackErr) {
        setError('Failed to load menu dishes. Please try again.');
      }
      setIsLoading(false);
    }
  }, []);

  // Remote fetch helper
  const fetchRemoteMenu = async (blocking = false) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const response = await fetch(API_URL, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json = await response.json();
      if (json && Array.isArray(json.menu)) {
        await saveMenuItems(json.menu);
        const latestItems = await filterMenuItems(
          searchQuery,
          selectedCategories
        );
        setMenuItems(latestItems);
        const distinctCats = await getDistinctCategories();
        setCategories(distinctCats);
      }
    } catch (fetchErr) {
      console.warn('Remote menu fetch failed or timed out:', fetchErr.message);
      if (blocking) {
        // If initial run failed and DB is empty, use bundled fallback dishes
        await saveMenuItems(FALLBACK_MENU_ITEMS);
        const fallback = await filterMenuItems('', []);
        setMenuItems(fallback);
        const distinctCats = await getDistinctCategories();
        setCategories(distinctCats);
      }
    } finally {
      if (blocking) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    loadMenu();
  }, [loadMenu]);

  // Search input handler
  const handleSearchChange = (text) => {
    setSearchQuery(text);
    debouncedSearch(text, selectedCategories);
  };

  // Category toggle handler (multi-select)
  const handleToggleCategory = (cat) => {
    const updated = selectedCategories.includes(cat)
      ? selectedCategories.filter((c) => c !== cat)
      : [...selectedCategories, cat];

    setSelectedCategories(updated);
    // Apply immediately with current search text
    executeQuery(searchQuery, updated);
  };

  // FlatList Header Component: Hero + Menu breakdown chips
  const renderHeader = () => (
    <View>
      <Hero
        showSearch={true}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      />
      <CategoryChips
        categories={categories}
        selectedCategories={selectedCategories}
        onToggleCategory={handleToggleCategory}
      />
      <View style={styles.sectionDivider} />
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

      {/* Top Header: Logo centered, Avatar right */}
      <Header
        showBack={false}
        showAvatar={true}
        avatarUri={profile.avatar}
        firstName={profile.firstName}
        lastName={profile.lastName}
        onAvatarPress={() => navigation.navigate('Profile')}
      />

      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primaryGreen} />
          <Text style={styles.loadingText}>Loading delicious menu...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadMenu}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={menuItems}
          keyExtractor={(item) => (item.id ? String(item.id) : item.name)}
          renderItem={({ item }) => <MenuItem item={item} />}
          ListHeaderComponent={renderHeader}
          ItemSeparatorComponent={() => <View style={styles.itemDivider} />}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>No dishes found</Text>
              <Text style={styles.emptyText}>No dishes match your search.</Text>
            </View>
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: spacing.xl,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: colors.divider,
    marginHorizontal: spacing.md,
    marginTop: spacing.xs,
  },
  itemDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.divider,
    marginHorizontal: spacing.md,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  loadingText: {
    marginTop: spacing.md,
    fontFamily: fonts.karlaMedium,
    fontSize: 16,
    color: colors.primaryGreen,
  },
  errorText: {
    fontFamily: fonts.karlaMedium,
    fontSize: 16,
    color: colors.error,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  retryButton: {
    backgroundColor: colors.primaryGreen,
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
    borderRadius: borderRadius.md,
  },
  retryButtonText: {
    fontFamily: fonts.karlaBold,
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  emptyContainer: {
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  emptyTitle: {
    fontFamily: fonts.karlaBold,
    fontSize: 18,
    fontWeight: '700',
    color: colors.black,
    marginBottom: spacing.xs,
  },
  emptyText: {
    fontFamily: fonts.karlaRegular,
    fontSize: 15,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
