import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {Octicons, MaterialIcons} from '@expo/vector-icons';

export default class IssueCard extends Component {
    state = {}
    render() {
        console.log(this.props.item)
        let date = new Date(this.props.item.createdAt);
        return (
            <View elevation={5} style={styles.card}>
                <TouchableOpacity
                    onPress={() => {
                    this
                        .props
                        .goToIssue(this.props.item.id, this.props.item.title)
                }}>
                    <View style={styles.cardHeader}>
                        <Octicons name='issue-opened' size={24}></Octicons>
                        <Text style={styles.cardHeading}>{this.props.item.title}</Text>
                    </View>
                    <View style={styles.cardBody}>
                        <Octicons
                            color='#2c3e50'
                            style={styles.cardComponent}
                            name='comment-discussion'
                            size={12}>
                            <Text style={styles.cardText}>{` ${this.props.item.comments} Comments`}
                            </Text>
                        </Octicons>
                        <Octicons
                            color='#d35400'
                            style={styles.cardComponent}
                            name='calendar'
                            size={12}>
                            <Text style={styles.cardText}>{` ${date.getDay() < 10
                                    ? "0" + date.getDay()
                                    : date.getDay()}.${date.getMonth() < 10
                                        ? "0" + date.getMonth()
                                        : date.getMonth()}.${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`}
                            </Text>
                        </Octicons>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        padding: 10,
        shadowRadius: 1,
        borderRadius: 2,
        borderWidth: 0.5,
        borderColor: 'grey',
        margin: 5,
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowRadius: 1,
        shadowOpacity: 0.8
    },
    cardDescription: {
        margin: 5
    },
    cardHeader: {
        borderBottomWidth: 1,
        borderColor: 'grey',
        flexDirection: 'row'
    },
    cardHeading: {
        fontSize: 16,
        padding: 5
    },
    cardBody: {
        flexDirection: 'row',
        padding: 5
    },
    cardButton: {
        flex: 1,
        margin: 5,
        alignItems: 'center',
        alignContent: 'center',
        borderWidth: 0.5,
        borderRadius: 2,
        borderColor: '#2980b9',
        padding: 5,
        backgroundColor: '#3498db'
    },
    cardComponent: {
        flex: 1,
        margin: 5,
        alignItems: 'center',
        alignContent: 'center',
        borderWidth: 0.5,
        borderRadius: 1,
        borderColor: 'lightgrey',
        padding: 5
    },
    cardText: {
        marginLeft: 5,
        paddingLeft: 5,
        color: 'black'
    }
});
