import { useState } from "react";
import {
  Button,
  SectionList,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function App() {
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const onChange = (event, selectedDate) => {
    setShowPicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const [add, setAdd] = useState();
  const [data, setData] = useState([
    {
      header: "University",
      data: [{ title: "Prepare for exam", priority: "3", checked: false }],
    },
    {
      header: "Programming",
      data: [{ title: "Do todo", priority: "2", checked: false }],
    },
    {
      header: "Done",
      data: [],
    },
  ]);

  const [titleInput, setTitleInput] = useState("");
  const [headerInput, setHeaderInput] = useState("");
  const [selectedHeader, setSelectedHeader] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");

  const [selectedHeaderFilter, setSelectedHeaderFilter] = useState("");
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState("");

  function addTodo() {
    if (titleInput.trim() === "") {
      alert("Title cannot be empty");
      return;
    }
    if (selectedHeader.trim() === "") {
      alert("You need to select header");
      return;
    }
    if (selectedPriority.trim() === "") {
      alert("You need to select priority");
      return;
    }
    setData(
      data.map((item) => {
        if (item.header === selectedHeader) {
          return {
            ...item,
            data: [
              ...item.data,
              {
                title: titleInput,
                priority: selectedPriority,
                date: date,
                checked: false,
              },
            ],
          };
        }
        return item;
      })
    );
  }

  function addHeader() {
    if (headerInput === "") {
      alert("Header cannot be empty");
      return;
    }
    setData([...data, { header: headerInput, data: [] }]);
  }

  function check(header, title) {
    setData(
      data.map((item) => {
        if (item.header === header) {
          return {
            ...item,
            data: item.data.filter((iitem) => {
              console.log(iitem);
              return iitem.title !== title;
            }),
          };
        }
        if (header !== "Done" && item.header === "Done") {
          return {
            ...item,
            data: [...item.data, { title, checked: true }],
          };
        }
        return item;
      })
    );
  }

  return (
    <View style={styles.main}>
      <View style={styles.top}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
          }}
        >
          <Button title="Add todo" onPress={() => setAdd("todo")} />
          <Button title="Add header" onPress={() => setAdd("header")} />
        </View>
        <View
          style={[
            styles.addMenu,
            { display: add === "todo" ? "contents" : "none" },
          ]}
        >
          <TextInput
            placeholder="Title"
            style={styles.input}
            onChangeText={setTitleInput}
            value={titleInput}
          />
          <Picker
            selectedValue={selectedHeader}
            onValueChange={(itemValue) => setSelectedHeader(itemValue)}
          >
            <Picker.Item label={"Header"} value={""} />
            {data.map((item, i) => (
              <Picker.Item
                key={i}
                label={item.header[0].toUpperCase() + item.header.slice(1)}
                value={item.header}
              />
            ))}
          </Picker>
          <Picker
            selectedValue={selectedPriority}
            onValueChange={(itemValue) => setSelectedPriority(itemValue)}
          >
            <Picker.Item label="Priority" value={""} />
            <Picker.Item label="High" value={"3"} />
            <Picker.Item label="Medium" value={"2"} />
            <Picker.Item label="Low" value={"1"} />
          </Picker>
          <Button title="Date" onPress={() => setShowPicker(true)} />
          <View style={{ height: 3 }}></View>
          {showPicker && (
            <DateTimePicker
              value={date}
              mode="date"
              onChange={onChange}
            />
          )}
          <Button title="Submit" onPress={addTodo} />
          <View style={{ height: 3 }}></View>
          <Button title="Close" onPress={() => setAdd("")} />
        </View>
        <View
          style={[
            styles.addMenu,
            { display: add === "header" ? "contents" : "none" },
          ]}
        >
          <View>
            <TextInput
              placeholder="Header"
              style={styles.input}
              onChangeText={setHeaderInput}
              value={headerInput}
            />
            <Button title="Submit" onPress={addHeader} />
            <View style={{ height: 3 }}></View>
            <Button title="Close" onPress={() => setAdd("")} />
          </View>
        </View>
      </View>
      <Text style={styles.heading}>Filters</Text>
      <View styles={styles.filters}>
        <View style={styles.filter}>
          <Picker
            selectedValue={selectedPriorityFilter}
            onValueChange={(itemValue) => setSelectedPriorityFilter(itemValue)}
          >
            <Picker.Item label="Priority" value={""} />
            <Picker.Item label="High" value={3} />
            <Picker.Item label="Medium" value={2} />
            <Picker.Item label="Low" value={1} />
          </Picker>
        </View>
        <View style={styles.filter}>
          <Picker
            selectedValue={selectedHeaderFilter}
            onValueChange={(itemValue) => setSelectedHeaderFilter(itemValue)}
          >
            <Picker.Item label={"Header"} value={""} />
            {data.map((item, i) => (
              <Picker.Item
                key={i}
                label={item.header[0].toUpperCase() + item.header.slice(1)}
                value={item.header}
              />
            ))}
          </Picker>
        </View>
      </View>
      <SectionList
        sections={data
          .map((item) => {
            return {
              ...item,
              data: item.data.filter((iitem) => {
                if (
                  selectedPriorityFilter !== "" &&
                  iitem.priority !== selectedPriorityFilter
                ) {
                  return false;
                }
                return true;
              }),
            };
          })
          .filter((item) => {
            if (
              selectedHeaderFilter !== "" &&
              item.header !== selectedHeaderFilter
            ) {
              return false;
            }
            return true;
          })}
        keyExtractor={(item, index) => item + index}
        renderItem={({ item, section }) => {
          let style = { backgroundColor: "grey" };
          switch (item.priority) {
            case "1":
              style = styles.lowPriority;
              break;
            case "2":
              style = styles.mediumPriority;
              break;
            case "3":
              style = styles.highPriority;
              break;
            default:
              break;
          }
          return (
            <TouchableWithoutFeedback
              onLongPress={() => {
                check(section.header, item.title);
              }}
            >
              <View style={[styles.item, style]}>
                <Text
                  style={[styles.title, item.checked ? styles.checked : null]}
                >
                  {item.title}
                </Text>
                <Text style={styles.title}>
                  {item.date?.toString()}
                </Text>
              </View>
            </TouchableWithoutFeedback>
          );
        }}
        renderSectionHeader={({ section: { header } }) => (
          <Text
            style={[
              styles.header,
              header === "Done" ? { color: "grey", fontStyle: "italic" } : {},
            ]}
          >
            {header}
          </Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    margin: 8,
  },
  top: {
    flexDirection: "col",
  },
  filters: {
    flex: 1,
    flexDirection: "row",
  },
  filter: {
    backgroundColor: "lightblue",
  },
  addMenu: {
    flex: 1,
    justifyContent: "flex-end",
  },
  heading: {
    fontSize: 20,
    textAlign: "center",
  },
  item: {
    padding: 20,
    marginVertical: 8,
  },
  highPriority: {
    backgroundColor: "red",
  },
  mediumPriority: {
    backgroundColor: "orange",
  },
  lowPriority: {
    backgroundColor: "green",
  },
  title: {
    fontSize: 24,
    color: "white",
  },
  header: {
    paddingStart: 6,
    fontSize: 32,
    backgroundColor: "#fff",
  },
  input: {
    marginVertical: 5,
    borderRadius: 15,
    borderWidth: 1,
    textAlign: "center",
    fontSize: 16,
  },
  checked: {
    textDecorationLine: "line-through",
    textDecorationStyle: "solid",
  },
});
