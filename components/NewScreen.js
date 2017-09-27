import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableHighlight,
    TouchableOpacity
} from 'react-native';

const list = [
    {
        name: "this"
    }, {
        name: "is"
    }, {
        name: "a"
    }, {
        name: "list"
    }, {
        name: "of"
    }, {
        name: "useful"
    }, {
        name: "items"
    }, {
        name: "this"
    }, {
        name: "is"
    }, {
        name: "a"
    }, {
        name: "list"
    }, {
        name: "of"
    }, {
        name: "useful"
    }, {
        name: "items"
    }
];
export default class NewScreen extends Component {
    state = {}

    _keyExtractor({id}) {
        return "newscreen-" + id;
    }
    _renderItem({item, index}) {
        return (
            <TouchableOpacity key={this._keyExtractor} onPress={() => console.log(item)}>
                <View elevation={3} style={styles.card}>
                    <Text style={styles.cardTitle}>
                        {item.name}
                    </Text>
                    <View style={styles.cardBody}>
                        <TouchableHighlight style={styles.cardComponent} onPress={(e) => {}}>
                            <Text style={styles.cardText}>test</Text>
                        </TouchableHighlight>
                        <TouchableHighlight style={styles.cardComponentMiddle} onPress={(e) => {}}>
                            <Text style={styles.cardText}>test</Text>
                        </TouchableHighlight>
                        <TouchableHighlight style={styles.cardComponent} onPress={(e) => {}}>
                            <Text style={styles.cardText}>test</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
    render() {
        return (<FlatList data={list} renderItem={this._renderItem}/>);
    }
}

const styles = StyleSheet.create({
    card: {
        padding: 10,
        borderRadius: 1,
        borderWidth: 0,
        borderColor: 'grey',
        margin: 5
    },
    cardTitle: {
        textAlign: 'center'
    },
    cardBody: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderColor: 'grey',
        padding: 5
    },
    cardComponent: {
        flex: 1,
        margin: 5
    },
    cardComponentMiddle: {
        flex: 1,
        borderRightWidth: 1,
        borderLeftWidth: 1,
        margin: 5,
        padding: 5
    },
    cardText: {
        textAlign: 'center'
    }
})