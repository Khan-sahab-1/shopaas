import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Alert,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { COLORS } from '../../../../../styles/colors';
import TextInputCompo from '../../../../../components/TextInputCompo';
import CheckBox from '@react-native-community/checkbox';
import ButtonCompo from '../../../../../components/ButtonCompo';
import Icon from 'react-native-vector-icons/Ionicons';
import makeApiCall from '../../../../../utils/apiHelper';
import { API_URLS } from '../../../../../utils/apiurls';
import axios from 'axios';
import { fetchproductoptions } from '../../../../../utils/fetchproductoptions';

const EditLoyalModal = ({ isVisible, onclose, item }) => {
  const [name, setName] = useState('');
  const [minimumPurchase, setMinimumPurchase] = useState('');
  const [customerAwarded, setCustomerAwarded] = useState('');
  const [pointsPerPurchase, setPointsPerPurchase] = useState('');
  const [maxRedeem, setMaxRedeem] = useState('');
  const [minRedeem, setMinRedeem] = useState('');
  const [company, setCompany] = useState('');
  const [unitOfAmount, setUnitOfAmount] = useState('');
  const [oneTimeRedeem, setOneTimeRedeem] = useState(false);
  const [partialRedeem, setPartialRedeem] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
 
 

  const editfetchdata = async (id) => {
    try {
      setIsLoading(true);
      const res = await makeApiCall(API_URLS.getLoyaltyData, 'POST', {
        jsonrpc: '2.0',
        params: { type: id, method: 'GET' },
      });
      console.log(res);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (item?.id) {
      setSelectedId(item.id);
      editfetchdata(item.id);
    }
  }, [item?.id]);

  const handleSave = async () => {
    // Create an object with only changed fields
    const updatedData = {};
  
    if (name !== item?.name) updatedData.name = name;
    if (minimumPurchase !== String(item?.minimum_purchase || "")) updatedData.minimum_purchase = minimumPurchase;
    if (pointsPerPurchase !== String(item?.points || "")) updatedData.points = pointsPerPurchase;
    if (unitOfAmount !== String(item?.unit_of_amount || "")) updatedData.unit_of_amount = unitOfAmount;
    if (maxRedeem !== String(item?.max_redeem_amount || "")) updatedData.max_redeem_amount = maxRedeem;
    if (minRedeem !== String(item?.minimum_redeem_amount || "")) updatedData.minimum_redeem_amount = minRedeem;
    if (company !== String(item?.company || "")) updatedData.company_id = company;
    
    const currentPolicy = oneTimeRedeem ? "one_time" : "partial";
    if (currentPolicy !== item?.loyalty_policy) updatedData.loyalty_policy = currentPolicy;
  
    // If nothing is updated, stop here
    if (Object.keys(updatedData).length === 0) {
      Alert.alert("No changes detected");
      return;
    }
  
    const payload = {
      jsonrpc: "2.0",
      params: {
        updatedData,
        id: String(selectedId),
      },
    };
  
    console.log("Saving Loyalty:", payload);
  
    try {
      const res = await makeApiCall(API_URLS.saveLoyaltyData, "POST", payload);
      console.log("Save Response:", res);
      onclose()
    } catch (error) {
      console.error("Error saving loyalty data:", error);
      Alert.alert("Error occurred while saving");
    }
  };
  

  useEffect(() => {
    if (item) {
      setName(item.name || '');
      setMinimumPurchase(item.minimum_purchase?.toString() || '');
      setCustomerAwarded(item.minimum_redeem_amount?.toString() || '');
      setPointsPerPurchase(item.unit_of_amount?.toString() || '');
      setMaxRedeem(item.max_redeem_amount?.toString() || '');
      setMinRedeem(item.minimum_redeem_amount?.toString() || '');
      setCompany(item.company || '');
      setUnitOfAmount(item.unit_of_amount || '');
      setOneTimeRedeem(item.loyalty_policy === 'one_time');
      setPartialRedeem(item.loyalty_policy === 'partial');
    }
  }, [item]);




  return (
    <Modal transparent visible={isVisible} onRequestClose={onclose}>
      <TouchableOpacity style={styles.container} activeOpacity={1}>
        <View style={styles.whiteBox}>
          <TouchableOpacity style={styles.closeBtn} onPress={onclose}>
            <Icon name="close" size={24} color={COLORS.blackColor} />
          </TouchableOpacity>
          <ScrollView
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.label}>Name</Text>
            <TextInputCompo
              placeholder="Name"
              style={styles.inputBox}
              value={name}
              onChangeText={setName}
            />

            <Text style={{ ...styles.label, fontWeight: '800', fontSize: 20 }}>
              POINT CALCULATION
            </Text>

            <Text style={styles.label}>Minimum Purchase</Text>
            <TextInputCompo
              placeholder="Minimum Purchase"
              style={styles.inputBox}
              value={minimumPurchase}
              onChangeText={setMinimumPurchase}
            />

            <Text style={styles.noteTitle}>Note</Text>
            <Text style={styles.noteText}>
              NOTES Minimum Purchase - is sale Order amount criteria which the
              customer has to satisfy to gain loyalty points.
            </Text>

            <Text style={styles.label}>Customer will be awarded:</Text>
            <TextInputCompo
              placeholder="Customer will be awarded"
              style={styles.inputBox}
              value={customerAwarded}
              onChangeText={setCustomerAwarded}
            />

            <Text style={styles.label}>Points For a Purchase of every:</Text>
            <TextInputCompo
              placeholder="Points per purchase"
              style={styles.inputBox}
              value={pointsPerPurchase}
              onChangeText={setPointsPerPurchase}
            />

            <Text style={{ ...styles.label, fontWeight: '800', fontSize: 20 }}>
              REDEMPTION RULES
            </Text>

            <Text style={styles.label}>
              Maximum Redeem Amount Per Sale Order:
            </Text>
            <TextInputCompo
              placeholder="Max redeem amount"
              style={styles.inputBox}
              value={maxRedeem}
              onChangeText={setMaxRedeem}
            />

            <Text style={styles.label}>Minimum Redeem Amount:</Text>
            <TextInputCompo
              placeholder="Min redeem amount"
              style={styles.inputBox}
              value={minRedeem}
              onChangeText={setMinRedeem}
            />

            <Text style={styles.label}>Company:</Text>
            <TextInputCompo
              placeholder="Company"
              style={styles.inputBox}
              value={company}
              onChangeText={setCompany}
            />

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.label}>One Time Redeem:</Text>
              <CheckBox
                value={oneTimeRedeem}
                onValueChange={(newValue) => {
                  setOneTimeRedeem(newValue);
                  if (newValue) setPartialRedeem(false);
                }}
              />
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.label}>Partial Redeem:</Text>
              <CheckBox
                value={partialRedeem}
                onValueChange={(newValue) => {
                  setPartialRedeem(newValue);
                  if (newValue) setOneTimeRedeem(false);
                }}
              />
            </View>

            <Text style={styles.noteTitle}>Note</Text>
            <Text style={styles.noteText}>
              1. One Time Redeem: The user will lose all points for a single redemption. {'\n'}
              2. Partial Redeem: The user will lose only the appropriate number of points for a redemption.
            </Text>

            <ButtonCompo title="Save" onPress={handleSave} />
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  whiteBox: {
    width: '100%',
    backgroundColor: COLORS.whiteColor,
    padding: 15,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    maxHeight: '90%',
  },
  inputBox: {
    borderRadius: 10,
    borderWidth: 1,
    height: 50,
    padding: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.blackColor,
    marginTop: 10,
  },
  noteTitle: {
    fontSize: 12,
    fontWeight: '300',
    marginTop: 5,
  },
  noteText: {
    fontSize: 12,
    fontWeight: '300',
    color: COLORS.blackColor,
    marginBottom: 10,
  },
});

export default EditLoyalModal;
