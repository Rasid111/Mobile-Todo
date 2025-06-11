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

export default function App() {
  const [data, setData] = useState([
    {
      header: "University",
      data: [{ title: "Prepare for exam", priority: "3", checked: false }],
    },
    {
      header: "Programming",
      data: [{ title: "Do todo", priority: "2", checked: true }],
    },
  ]);

  const [titleInput, setTitleInput] = useState("");
  const [headerInput, setHeaderInput] = useState("");
  const [selectedHeader, setSelectedHeader] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");

  const [selectedHeaderFilter, setSelectedHeaderFilter] = useState("");
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState("");

  function addTodo() {
    if (titleInput === "") {
      alert("Title cannot be empty");
      return;
    }
    if (selectedHeader === "") {
      alert("You need to select header");
      return;
    }
    if (selectedPriority === "") {
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
              { title: titleInput, priority: selectedPriority, checked: false },
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
            data: item.data.map((iitem) => {
              if (iitem.title === title) {
                return { ...iitem, checked: !iitem.checked };
              }
              return iitem;
            }),
          };
        }
        return item;
      })
    );
  }

  return (
    <View style={styles.main}>
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
        <Picker.Item label="High" value={3} />
        <Picker.Item label="Medium" value={2} />
        <Picker.Item label="Low" value={1} />
      </Picker>
      <Button title="Add todo" onPress={addTodo} />
      <TextInput
        placeholder="Header"
        style={styles.input}
        onChangeText={setHeaderInput}
        value={headerInput}
      />
      <Button title="Add header" onPress={addHeader} />
      <Text style={styles.heading}>Filters</Text>
      <Picker
        selectedValue={selectedPriorityFilter}
        onValueChange={(itemValue) => setSelectedPriorityFilter(itemValue)}
      >
        <Picker.Item label="Priority" value={""} />
        <Picker.Item label="High" value={3} />
        <Picker.Item label="Medium" value={2} />
        <Picker.Item label="Low" value={1} />
      </Picker>
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
            console.log(selectedHeaderFilter);
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
          let style = styles.lowPriority;
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
              </View>
            </TouchableWithoutFeedback>
          );
        }}
        renderSectionHeader={({ section: { header } }) => (
          <Text style={styles.header}>{header}</Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    paddingTop: StatusBar.currentHeight,
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
    textAlign: "center",
    fontSize: 16,
  },
  checked: {
    textDecorationLine: "line-through",
    textDecorationStyle: "solid",
  },
});
