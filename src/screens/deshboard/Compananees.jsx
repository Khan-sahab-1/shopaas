import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import Iconmaterials from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';
import makeApiCall from '../../utils/apiHelper';
import { API_URLS } from '../../utils/apiurls';
import DropDownPicker from 'react-native-dropdown-picker';
import TextInputCompo from '../../components/TextInputCompo';
import { COLORS } from '../../styles/colors';
import { moderateScale } from '../../styles/responsiveSize';
import navigationString from '../../navigation/navigationString';
import Loader from '../../components/Loader';
import { useFocusEffect } from '@react-navigation/native';
import Slider from '../../components/Slider';
import Headercomp from '../../components/Headercomp';
import AntDesign from 'react-native-vector-icons/AntDesign';

const Compananees = ({ navigation, route }) => {
  const [searchitem, setserchitem] = useState(false);
  const [companeyType, setcompaneytype] = useState([]);
  const [selectedType, setSelectedType] = useState(-1);
  const [companiesdata, setcompaniesdata] = useState([]);
  const [allSliders, setAllSliders] = useState([]);
  const [faviorate, setfaviorate] = useState(false);
  const [companeyid, setcompaneyId] = useState(null);
  const [companeyTypeId, setCompaneyId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, settotalPage] = useState(null);
  const [serching, setsearching] = useState('');
  const [filteredCompanies, setFilteredCompanies] = useState([]);

  console.log(companeyTypeId, companeyid, 'ccccc');

  const [typeOpen, setTypeOpen] = useState(false);
  console.log(typeof route?.params?.item?.id, 'route');
  const companeytypeId = route?.params?.item?.id;

  const [sortOptions, setSortOptions] = useState([
    { label: 'Popularity', value: 'popularity_count_update DESC' },
    { label: 'Rating', value: 'rating_count_update DESC' },
    { label: 'Newest First', value: 'id DESC' },
  ]);
  const [selectedSort, setSelectedSort] = useState(null);
  const [sortOpen, setSortOpen] = useState(false);

  const confirmedLocation = useSelector(state => state.location);

  const [isLoading, setisloading] = useState(false);
  // const totalPages=''

  const fetchslier = async (companeyList, companeyTypeId) => {
    try {
      const res = await makeApiCall(API_URLS.getSliders, 'POST', {
        jsonrpc: '2.0',
        params: { companeyList, companeyTypeId },
      });

      const sliderData = res?.result?.data?.sliders;

      if (sliderData) {
        // Get main_slider
        const mainSliders = sliderData.main_slider || [];

        // Get homepage_sliders and flatten them
        const homepageSliders = sliderData.homepage_sliders || {};
        const nestedSliders = Object.values(homepageSliders).flatMap(
          item => item.sliders || [],
        );

        // Combine all sliders
        const combinedSliders = [...mainSliders, ...nestedSliders];

        // Set to state
        setAllSliders(combinedSliders);
        console.log('Combined Sliders:', combinedSliders);
      }
    } catch (error) {
      console.log('Error fetching sliders:', error);
    }
  };

  const fetchcompaniesinfo = async () => {
    try {
      const payload = {
        companyTypeId: companeytypeId,
        filterBy: selectedSort || false,
        page: currentPage,
      };
      console.log(payload, 'Payloadcompaney');
      setisloading(true);
      const responce = await makeApiCall(API_URLS.getCompanies, 'POST', {
        jsonrpc: '2.0',
        params: payload,
      });
      console.log(responce, 'Companiess');
      if (!responce.result.errorMessage && !responce.error) {
        if (responce.result.statusCode === 201) {
          Alert.alert(responce.result.message);
          navigation.goBack();
        } else if (responce.result.statusCode === 200) {
          setcompaniesdata(responce?.result?.companies);
          settotalPage(responce?.result?.totalPages);
          fetchslier(responce?.result?.companyList, companeytypeId);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setisloading(false);
    }
  };
  const handlefaviorate = async item => {
    const companeyId = item.id;
    const companeyTypeId = Array.isArray(item.company_type)
      ? item.company_type[0]
      : null;
    const addToFavourites = !item.isFavourite;

    const success = await editfaviorateitem({
      companeyId,
      companeyTypeId,
      addToFavourites,
    });

    // Optimistically update UI if API was successful
    if (success) {
      setcompaniesdata(prev =>
        prev.map(company =>
          company.id === companeyId
            ? { ...company, isFavourite: addToFavourites }
            : company,
        ),
      );
    }
  };

  const editfaviorateitem = async ({
    companeyId,
    companeyTypeId,
    addToFavourites,
  }) => {
    try {
      const params = {
        companyId: companeyId,
        companyTypeId: companeyTypeId,
        addToFavourites,
      };
      console.log(params, 'parems----');
      const responce = await makeApiCall(API_URLS.AddFavourate, 'POST', {
        jsonrpc: '2.0',
        params,
      });
      console.log('Favorite updated:', responce);
      fetchcompaniesinfo();
    } catch (error) {
      console.log(error);
      Alert.alert('Error', error.message || 'Something went wrong');
    }
  };

  useEffect(() => {
    const fetchcompaneyType = async () => {
      try {
        const responce = await makeApiCall(API_URLS.getcatagory, 'POST', {
          jsonrpc: '2.0',
          params: {},
        });

        if (!responce.result.errorMesage && !responce.error) {
          const rawItems = responce?.result?.companyTypes;
          const mappedItems = [
            { label: 'Shopass Id', value: -1 },
            ...rawItems.map(item => ({ label: item.name, value: item.id })),
          ];
          setcompaneytype(mappedItems);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchcompaneyType();
  }, []);
  useFocusEffect(
    React.useCallback(() => {
      fetchcompaniesinfo();
    }, [confirmedLocation, selectedSort, currentPage]),
  );
  useEffect(() => {
    if (serching.trim() === '') {
      setFilteredCompanies(companiesdata);
    } else {
      const filtered = companiesdata.filter(company =>
        company.name.toLowerCase().includes(serching.toLowerCase()),
      );
      setFilteredCompanies(filtered);
    }
  }, [serching, companiesdata]);

  const goNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goPrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const renderCompanyItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate(navigationString.PRODUCTSCREEN, { item })
      }
    >
      <View style={styles.cardContent}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.info}>
          ⭐ {item.rating} | 🏙 {item.city}
        </Text>
        <View>
          <Text style={styles.location}>📍 {item.city}</Text>
        </View>
        <TouchableOpacity onPress={() => handlefaviorate(item)}>
          <Icon
            name={item.isFavourite ? 'heart' : 'heart-outline'}
            size={24}
            color="red"
            style={styles.heartIcon}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1,backgroundColor:COLORS.whiteColor }}>
      <Headercomp
        title={'Companies'}
        left={true}
        onPress={() => navigation.goBack()}
      />
      <View style={styles.headercontainer}>
        {confirmedLocation &&
        confirmedLocation.confirmedLocation.trim().length > 0 ? (
          <Text
            style={{ fontSize: 16 }}
            onPress={() => navigation.navigate(navigationString.LOCATION)}
          >
            📍{' '}
            {confirmedLocation.confirmedLocation
              .split(' ')
              .slice(0, 5)
              .join(' ')}
            ...
          </Text>
        ) : (
          <Text style={{ fontSize: 16, marginTop: 10, color: 'blue' }}>
            ➕ Add Location
          </Text>
        )}
        <TouchableOpacity onPress={() => setserchitem(prev => !prev)}>
          <Icon name="search" size={20} color="#000" />
        </TouchableOpacity>
      </View>

      {searchitem && (
        <View style={styles.flexcontainer}>
          {/* <View style={{ flex: 1, marginRight: 5 }}>
            <DropDownPicker
              open={typeOpen}
              value={selectedType}
              items={companeyType}
              setOpen={setTypeOpen}
              setValue={setSelectedType}
              setItems={setcompaneytype}
              placeholder="Select Company Type"
              searchable
              style={styles.dropdown}
              dropDownContainerStyle={{ maxHeight: 400 }}
              textStyle={{ color: COLORS.blackColor }}
              placeholderStyle={{ color: '#ccc' }}
              searchPlaceholderTextColor={COLORS.blackColor}
              searchTextInputStyle={{ color: COLORS.blackColor }}
              ArrowDownIconComponent={() => (
                <Iconmaterials
                  name="keyboard-arrow-down"
                  size={24}
                  color={COLORS.blackColor}
                />
              )}
              ArrowUpIconComponent={() => (
                <Iconmaterials
                  name="keyboard-arrow-up"
                  size={24}
                  color={COLORS.blackColor}
                />
              )}
            />
          </View> */}
          <View style={{ flex: 1 }}>
            <TextInputCompo
              placeholder="Search...."
              style={{ ...styles.input, height: 50 }}
              onChangeText={text => setsearching(text)}
              value={serching}
            />
          </View>
        </View>
      )}

      <View
        style={{
          ...styles.flexcontainer,
          marginTop: 6,
          borderBottomColor: COLORS.blueLight,
          borderBottomWidth: 2,
          borderTopColor: COLORS.blueLight,
          borderTopWidth: 2,
          backgroundColor: '#ccc',
        }}
      >
        <Text style={styles.bluetext}>Serving Near You ||</Text>
        <View style={{ flex: 1, marginLeft: 40 }}>
          <DropDownPicker
            open={sortOpen}
            value={selectedSort}
            items={sortOptions}
            setOpen={setSortOpen}
            setValue={setSelectedSort}
            setItems={setSortOptions}
            placeholder="Sort by"
            style={{
              ...styles.dropdown,
              borderWidth: 0,
              backgroundColor: '#ccc',
            }}
            dropDownContainerStyle={{ maxHeight: 400 }}
            textStyle={{ color: COLORS.blackColor }}
            placeholderStyle={{ color: '#ccc' }}
            searchPlaceholderTextColor={COLORS.blackColor}
            searchTextInputStyle={{ color: COLORS.blackColor }}
            ArrowDownIconComponent={() => (
              <Iconmaterials
                name="keyboard-arrow-down"
                size={24}
                color={COLORS.blackColor}
              />
            )}
            ArrowUpIconComponent={() => (
              <Iconmaterials
                name="keyboard-arrow-up"
                size={24}
                color={COLORS.blackColor}
              />
            )}
          />
        </View>
      </View>
      <Slider images={allSliders} />

      <View style={styles.container}>
        <FlatList
          data={filteredCompanies}
          renderItem={renderCompanyItem}
          keyExtractor={item => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={{
            justifyContent: 'space-between',
            marginBottom: 2,
          }}
          // contentContainerStyle={{ paddingHorizontal: 15 }}
        />
        <View style={{ ...styles.containerPagination }}>
          <TouchableOpacity
            onPress={goPrev}
            disabled={currentPage === 0}
            style={[styles.arrowBtn, currentPage === 0 && styles.disabled]}
          >
            <AntDesign
              name="left"
              size={24}
              color={currentPage === 1 ? '#aaa' : '#007AFF'}
            />
          </TouchableOpacity>

          <Text style={styles.pageText}>
            {currentPage} / {totalPages}
          </Text>

          <TouchableOpacity
            onPress={goNext}
            disabled={currentPage === totalPages}
            style={[
              styles.arrowBtn,
              currentPage === totalPages && styles.disabled,
            ]}
          >
            <AntDesign
              name="right"
              size={24}
              color={currentPage === totalPages ? '#aaa' : '#007AFF'}
            />
          </TouchableOpacity>
        </View>
      </View>
      <Loader visible={isLoading} />
    </SafeAreaView>
  );
};

export default Compananees;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginVertical: 5,
    flexDirection: 'row',
    elevation: 2,
    width: '49%',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
  },
  info: {
    fontSize: 14,
    color: '#777',
    marginTop: 4,
  },
  location: {
    fontSize: 14,
    color: '#333',
    marginTop: 2,
  },
  headercontainer: {
    padding: 10,
    height: moderateScale(50),
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor:COLORS.GARY,
    alignItems:'center'
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: COLORS.blackColor,
    backgroundColor: COLORS.whiteColor,
    borderRadius: 10,
  },
  flexcontainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  bluetext: {
    fontSize: 18,
    color: COLORS.blueColor,
    fontWeight: '800',
  },
  containerPagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // marginVertical: 20,
  },
  arrowBtn: {
    padding: 10,
    marginHorizontal: 20,
  },
  pageText: {
    fontSize: 16,
    fontWeight: '600',
  },
  disabled: {
    // optional: reduce touch opacity for disabled
    opacity: 0.5,
  },
});
