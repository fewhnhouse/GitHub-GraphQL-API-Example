import React, {Component} from 'react';
import {Text, View, StyleSheet, ActivityIndicator} from 'react-native';

export default class Loading extends Component {
    state = {}
    render() {
        return (
            <View style={styles.container}>
                <ActivityIndicator animating={true} size={'large'}></ActivityIndicator>
                <Text>Loading...</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        padding: '30%',
        alignContent: 'center',
        alignItems: 'center'
    }
})