import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {Octicons} from '@expo/vector-icons';

export default class RepoCard extends Component {
    state = {}
    render() {
        return (
            <View elevation={5} style={styles.card}>
                <View style={styles.cardHeader}>
                    <Octicons name='repo' size={24}>{this.props.item.name}</Octicons>
                    <Text style={styles.cardDescription}>{this.props.item.description}</Text>
                </View>
                <View style={styles.cardBody}>
                    <Octicons
                        color='#16a085'
                        style={styles.cardComponent}
                        name='repo-forked'
                        size={12}>
                        <Text style={styles.cardText}>{` ${this.props.item.forks.totalCount} Forks`}
                        </Text>
                    </Octicons>
                    <Octicons color='#f1c40f' style={styles.cardComponent} name='star' size={12}>
                        <Text style={styles.cardText}>{` ${this.props.item.stargazers.totalCount} Stargazers`}
                        </Text>
                    </Octicons>
                    <Octicons color='#2980b9' style={styles.cardComponent} name='eye' size={12}>
                        <Text style={styles.cardText}>{` ${this.props.item.watchers.totalCount} Watchers`}
                        </Text>
                    </Octicons>
                </View>
                <View style={styles.cardBody}>
                    <TouchableOpacity
                        style={styles.cardButton}
                        onPress={() => this.props.goToRepo(this.props.item.id, this.props.item.name, this.props.item.owner.login)}>
                        <Octicons color='red' name='issue-opened' size={18}>
                            <Text style={styles.cardText}>{` ${this.props.item.issues.totalCount} Issues`}</Text>
                        </Octicons>
                    </TouchableOpacity>
                </View>
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
        shadowRadius: 2,
        shadowOpacity: 1.0
    },
    cardDescription: {
        margin: 5
    },
    cardHeader: {
        borderBottomWidth: 1,
        borderColor: 'grey'
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
