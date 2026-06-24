import { useMemo, useState } from 'react';
import { Screen } from '../../components/Screen.tsx';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { TextField } from '../../components/TextField.tsx';
import { usePosts } from '../../usePosts.ts';
import { useNavigation } from "@react-navigation/native";
import { PostCard } from '../../components/PostCard.tsx';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParams } from '../../navigationTypes.ts';
import { useTranslation } from 'react-i18next';

export function SearchScreen() {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');

  const {data, isPending, error} = usePosts({limit: 100});
  
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();

  const results = useMemo(() => {
    const query = search.trim().toLowerCase();

    if(!query) {
      return data ?? []
    }

    return (data ?? []).filter(post => `${post.title} ${post.body}`.toLowerCase().includes(query));
  }, [data, search])

  return(
    <Screen style={styles.canvas}>
      <View>
        <Text style={styles.searchTitle}>{t('search.title')}</Text>
      </View>
      <View>
        <TextField
          placeholder={t('search.placeholder')}
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {isPending ? (
        <Text>{t('common.loading')}</Text>
      ) : null}

      {error && !data ? (
        <Text>{t('search.unavailable')}</Text>
      ) : null}
      
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.searchResults}>
        {results.map(post => (
          <PostCard key={post.id} post={post} onPress={() => navigation.navigate('Post', {postId: post.id})}/>
        ))}
      </ScrollView>
    </Screen>
  )
}

const styles = StyleSheet.create({
  canvas: {
    flex: 1,
    padding: 16,
  },
  searchInput: {},
  searchTitle: {
    fontSize: 22,
    lineHeight: 32,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  searchResults: {
    marginTop: 16,
    gap: 16,
  }
})
