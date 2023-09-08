import React from "react";
import {
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Animated,
} from "react-native";
import { Input, HStack, View } from "native-base";

import { SelectListProps } from "..";

type L1Keys = { key?: any; value?: any; disabled?: boolean | undefined, label?: any };

const SelectList: React.FC<SelectListProps> = ({
  setSelected,
  resetChild,
  placeholder,
  boxStyles,
  inputStyles,
  dropdownStyles,
  dropdownItemStyles,
  dropdownTextStyles,
  maxHeight,
  data,
  defaultOption,
  searchicon = false,
  arrowicon = false,
  closeicon = false,
  search = true,
  searchPlaceholder,
  notFoundText = "No data found",
  disabledItemStyles,
  disabledTextStyles,
  onSelect = () => {},
  onClose = () => {},
  save = "key",
  dropdownShown = false,
  fontFamily,
  editable,
  parentCodeValue,
}) => {
  const oldOption = React.useRef(null);
  const [_firstRender, _setFirstRender] = React.useState<boolean>(true);
  const [dropdown, setDropdown] = React.useState<boolean>(dropdownShown);
  const [selectedval, setSelectedVal] = React.useState<any>("");
  const [height, setHeight] = React.useState<number>(200);
  const animatedvalue = React.useRef(new Animated.Value(0)).current;
  const [filtereddata, setFilteredData] = React.useState(data);
  const [indexOfSelected, setIndexOfSelected] = React.useState<
    number | undefined
  >(undefined);

  const slidedown = () => {
    setDropdown(true);
    Animated.timing(animatedvalue, {
      toValue: height,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };
  const slideup = () => {
    Animated.timing(animatedvalue, {
      toValue: 0,
      duration: 500,
      useNativeDriver: false,
    }).start(() => setDropdown(false));
  };

  React.useEffect(() => {
    if(defaultOption){
        setIndexOfSelected(defaultOption.key);
    }
    return;
  },[])
        
  React.useEffect(() => {
    if(!_firstRender){
        setSelectedVal("");
        resetChild();
    }
  }, [parentCodeValue]);

  React.useEffect(() => {
    if (maxHeight) setHeight(maxHeight);
  }, [maxHeight]);

  React.useEffect(() => {
    setFilteredData(data);
  }, [data]);
            
  React.useEffect(() => {
    if (_firstRender) {
      _setFirstRender(false);
      return;
    }
    onSelect();
  }, [selectedval]);

  React.useEffect(() => {
    if (
      !_firstRender &&
      defaultOption &&
      oldOption.current != defaultOption.key
    ) {
      // oldOption.current != null
      oldOption.current = defaultOption.key;
      // setSelected(defaultOption.key);
      setSelectedVal(defaultOption.label ?? defaultOption.value);
    }
    if (defaultOption && _firstRender && defaultOption.key != undefined) {
      oldOption.current = defaultOption.key;
      // setSelected(defaultOption.key);
      setSelectedVal(defaultOption.label ?? defaultOption.value);
    }
  }, [defaultOption]);

  React.useEffect(() => {
    if (!_firstRender) {
      if (dropdownShown) slidedown();
      else slideup();
    }
  }, [dropdownShown]);

  return (
    <View>
      {dropdown && search ? (
        <View style={[styles.wrapper, boxStyles, { overflow: "hidden" }]}>
          <HStack style={{ flex:1, alignItems: "center" }}>
            {!searchicon ? (
              <Image
                source={require("../assets/images/search.png")}
                resizeMode="contain"
                style={{ width: 20, height: 20, marginRight: 7 }}
              />
            ) : (
              searchicon
            )}
            <View style={{ flex: 1 }}>
              <Input
                // borderWidth={0}
                variant={"unstyled"}
                placeholder={searchPlaceholder}
                onChangeText={(val) => {
                  let result = data.filter((item: L1Keys) => {
                    val.toLowerCase();
                    let row = item.value.toLowerCase();
                    return row.search(val.toLowerCase()) > -1;
                  });
                  setFilteredData(result);
                }}
                numberOfLines={1}
                style={[{ padding: 1, height: 20, fontFamily }, inputStyles]}
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                slideup();
                onClose();
              }}
            >
              {!closeicon ? (
                <Image
                  source={require("../assets/images/close.png")}
                  resizeMode="contain"
                  style={{ width: 15, height: 15 }}
                />
              ) : (
                closeicon
              )}
            </TouchableOpacity>
          </HStack>
        </View>
      ) : (
        <TouchableOpacity
          style={[styles.wrapper, boxStyles]}
          onPress={() => {
            if (!dropdown) {
              slidedown();
            } else {
              slideup();
            }
          }}
        >
          <Text style={[{ fontFamily }, inputStyles]} numberOfLines={1}>
            {selectedval == ""
              ? placeholder
                ? placeholder
                : "Select option"
              : selectedval}
          </Text>
          {!arrowicon ? (
            <Image
              source={require("../assets/images/chevron.png")}
              resizeMode="contain"
              style={{ width: 20, height: 20 }}
            />
          ) : (
            arrowicon
          )}
        </TouchableOpacity>
      )}

      {dropdown ? (
        <Animated.View
          style={[
            { maxHeight: animatedvalue },
            styles.dropdown,
            dropdownStyles,
          ]}
        >
          <ScrollView
            nestedScrollEnabled={true}
          >
            {filtereddata.length >= 1 ? (
              filtereddata.map((item: L1Keys) => {
                let key = item.key ?? item.value ?? item;
                let label = item.label ?? item.value ?? "";
                let value = item.value ?? "";
                  return (
                    <View key={item.key} style={{ flexDirection: "row", borderColor: "#d3d3d3", borderBottomWidth:1 }}>
                      <TouchableOpacity
                        style={[
                          styles.option,
                          dropdownItemStyles,
                          {flex: 11}
                          // { flexGrow: 1 },
                        ]}
                        key={item.key}
                        onPress={() => {
                          if (save === "value") {
                            setSelected(value);
                          } else {
                            setSelected(key);
                          }
                          setIndexOfSelected(item.key);
                          setSelectedVal(label ?? value);
                          slideup();
                          setTimeout(() => {
                            setFilteredData(data);
                          }, 800);
                        }}
                      >
                        <Text style={[{ fontFamily }, dropdownTextStyles]} numberOfLines={1} >
                          {label ?? value}
                        </Text>
                      </TouchableOpacity>
                      {indexOfSelected === item.key   ? (
                        <TouchableOpacity
                          onPress={() => {
                            resetChild();
                            setIndexOfSelected(undefined);
                            setSelectedVal("");
                            slideup();
                            setTimeout(() => setFilteredData(data), 800);
                          }}
                          style={{ alignSelf: "center", flex:1 }}
                        >
                          <Image
                            source={require("../assets/images/close.png")}
                            resizeMode="contain"
                            style={{
                              width: 13,
                              height: 13,
                              marginRight: 5,
                              alignSelf: "flex-end"
                            }}
                          />
                        </TouchableOpacity>
                      ) : (
                        <></>
                      )}
                    </View>
                  );
                
              })
            ) : (
              <TouchableOpacity
                style={[styles.option, dropdownItemStyles]}
                onPress={() => {
                  setSelected(undefined);
                  setSelectedVal("");
                  slideup();
                  setTimeout(() => setFilteredData(data), 800);
                }}
              >
                <Text style={[{ fontFamily }, dropdownTextStyles]}>
                  {notFoundText}
                </Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </Animated.View>
      ) : null}
    </View>
  );
};

export default SelectList;

const styles = StyleSheet.create({
  wrapper: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "gray",
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dropdown: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "gray",
    overflow: "hidden",
  },
  option: { 
    paddingHorizontal: 20, 
    paddingVertical: 8, 
    overflow: "hidden", 
    // borderBottomWidth: 1,
    // borderColor: "#d3d3d3" 
  },
  disabledoption: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "whitesmoke",
    opacity: 0.9,
    // borderBottomWidth: 1,
    // borderColor: "#d3d3d3"
  },
});
