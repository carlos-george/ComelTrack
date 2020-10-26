import React, { useState, useEffect } from 'react';
import { useNavigation, useRoute, RouteProp, ParamListBase, useFocusEffect } from '@react-navigation/native';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Button,
    AsyncStorage,
    ActivityIndicator,
    RefreshControl,
    Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';

const { height } = Dimensions.get('window');
const hSize = height * 0.8;

import api from '../../services/api';

interface Package {
    id: string;
    trackerNumber: string;
    description: string;
    status: number;
}

interface SearchInfo {
    total: number;
    lastPage: number;
    perPage: number;
    currentPage: number;
}

interface Params {
    isToRefresh: false;
}

function Home() {

    const { navigate, setOptions } = useNavigation();

    const [searchInfo, setSearchInfo] = useState<SearchInfo>({ currentPage: 1 } as SearchInfo);

    const [packages, setPackages] = useState<Package[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const route = useRoute<RouteProp<ParamListBase, string>>();
    const { isToRefresh = false } = route.params as Params;

    useEffect(() => {
        setOptions({
            headerLeft: () => (
                <Button
                    key="321123"
                    onPress={handleGetOut}
                    title="Sair"
                    color="#fff"
                />
            ),
            headerRight: () => (
                <TouchableWithoutFeedback onPress={() => navigate('AddPackage')} >
                    <Icon.Button
                        key="123321"
                        style={styles.button}
                        name="plus-circle"
                        size={40}
                        backgroundColor="transparent"
                        color="#fff"
                    />
                </TouchableWithoutFeedback>
            ),
        });
    }, []);

    useEffect(() => {
        searchPackagesOnRefresh()
    }, [searchInfo.currentPage, isToRefresh]);

    useFocusEffect(() => {
        searchPackagesOnRefresh()
    });

    async function searchPackagesOnRefresh() {
        api.get(`packages?page=${searchInfo.currentPage}`).then(res => {
            const { data, ...searchInfo } = res.data;
            setIsRefreshing(false);
            setPackages(data);
            setSearchInfo(searchInfo);
        }).catch(error => {
            setIsRefreshing(false);
            alert(error);
        });
    }

    async function onRefresh() {
        setIsRefreshing(true);
        setSearchInfo({ currentPage: 1 } as SearchInfo);
        searchPackagesOnRefresh();
    }

    async function handleGetOut() {
        await AsyncStorage.clear();
        navigate('Login');
    }

    function loadMore() {
        const { currentPage } = searchInfo;

        if (currentPage === searchInfo.currentPage) return;

        const pagenumber = +currentPage + 1;

        setSearchInfo({ ...searchInfo, currentPage: pagenumber });
    }

    function renderItem(item: Package) {

        return (
            <View style={styles.productContainer}>
                <View style={styles.productHeader}>
                    <Text style={styles.productTitle}>{item.trackerNumber}</Text>
                    {
                        item.status === 0 ?
                            (
                                <Icon name="x-circle" size={30} color="#ff0000" />
                            )
                            :
                            (
                                <Icon name="check-circle" size={30} color="#69e05e" />
                            )
                    }
                </View>
                <Text style={styles.productdesc}>{item.description}</Text>
                <TouchableOpacity style={styles.productButton} onPress={() => navigate('Detail', { id: item.id })}>
                    <Text style={styles.productButtonText}>Receber Encomenda</Text>
                </TouchableOpacity>
            </View>
        );
    }

    function renderSeparator() {
        return (
            <View
                style={{
                    height: 2,
                    width: '100%',
                    marginTop: 15,
                    marginBottom: 15,
                    backgroundColor: '#CED0CE'
                }}
            />
        );
    };

    function renderFooter() {
        if (!loading) return null;
        return (
            <ActivityIndicator />
        );
    };

    return (
        <SafeAreaView>
            <View>
                <FlatList contentContainerStyle={styles.list}
                    data={packages}
                    keyExtractor={(item: Package, index) => `${item.id.toString()}${index}`}
                    renderItem={({ item }) => renderItem(item)}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={onRefresh}
                        />
                    }
                    ItemSeparatorComponent={renderSeparator}
                    ListFooterComponent={renderFooter}
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.1}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    list: {
        padding: 20,
        // height: hSize
    },
    productContainer: {
        flexGrow: 1,
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 20,
    },
    productHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    productTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: '#333333'
    },
    productdesc: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: "bold",
        color: '#333333'
    },
    productButton: {
        height: 42,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: '#FCA90D',
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10
    },
    productButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FCA90D'
    },
    button: {
        alignItems: "center",
        padding: 5
    }
});

export default Home;

