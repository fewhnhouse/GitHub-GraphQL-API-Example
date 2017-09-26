import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity
} from 'react-native';

const list = [{name: "this"}, {name: "is"}, {name: "a"}, {name: "list"}, {name: "of"}, {name: "useful"}, {name: "items"}];
export default class NewScreen extends Component {
    state = {  }
    _renderItem({item, index}) {
        return (
            <TouchableOpacity key={"newscreen-"+index} onPress={() => console.log(item)}>
            <View style={styles.card}>
            <Text style={styles.cardTitle}>
              {item.name}
            </Text>
            <Text style={styles.cardBody}>
                asodzasdddddddddddddddddddddddd
            </Text>
            </View>
          </TouchableOpacity>
        )
    }
    render() {
        return (
            <FlatList data={list} renderItem={this._renderItem}/>
        );
    }
}

const styles = StyleSheet.create({
    card: {
        padding: 10,
        shadowRadius: 1,
        borderRadius: 2,
        borderWidth: 0.5,
        borderColor: 'grey',
        margin: 5,
        shadowColor: '#000000',
        shadowOffset: {
          width: 0,
          height: 3
        },
        shadowRadius: 5,
        shadowOpacity: 1.0

    },
    cardTitle: {
        textAlign: 'center'
    },
    cardBody: {
        borderTopWidth: 1,
        borderColor: 'grey',
        padding: 5
    }
})