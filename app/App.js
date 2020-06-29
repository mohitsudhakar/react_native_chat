import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    TextInput,
    View,
    Button,
    ActivityIndicator
} from 'react-native';
import io from 'socket.io-client';

export default class app extends Component {
    constructor(props) {
        super(props);
        this.ip = 'https://onenodeserve.herokuapp.com'
        this.state = {
            loading: false,
            message: "",
            chatList: [],
            sender: "",
            receiver: "",
            match_id: (Math.random()*1000000).toString()
        }
        this.apiEndpoint = '/chats'
    }

    componentDidMount() {
        this.socket = io(this.ip);
        // this.socket.emit('create', {username: this.state.sender});
        this.socket.on('chat message', data => {
            if (data.sender.toLowerCase() === this.state.receiver.toLowerCase()) {
                const displayMsg = data.sender + ': ' + data.message
                this.setState({ chatList: [...this.state.chatList, displayMsg] })
            }
        });
    }

    joinChat() {
        this.socket.emit('join chat', {
            sender: this.state.sender,
            receiver: this.state.receiver
        })

        // todo: will need to fetch latest match from db
        this.setState({chatList: ['Match '+this.state.match_id+':'], loading: true})

        fetch(this.ip + this.apiEndpoint
                    + '?sender=' + this.state.sender
                    + '&receiver=' + this.state.receiver)
            .then(response => response.json())
            .then(responseJson => {
                const chatList = responseJson.map(data => data.sender + ': ' + data.message)
                this.setState({loading: false, chatList})
            })
            .catch(error => console.log(error));
    }
    sendChat() {
        const displayMsg = this.state.sender + ': ' + this.state.message
        this.setState({ chatList: [...this.state.chatList, displayMsg] })
        this.socket.emit('chat message', {
            message: this.state.message,
            sender: this.state.sender,
            receiver: this.state.receiver,
            match_id: this.state.match_id
        });
        this.setState({message: ""});
    }

    render() {

        const chatMsgList = this.state.chatList.map(chat => (
            <Text key={chat}>{chat}</Text>  // todo: key should be unique
        ));
        const panel = (
            <View>
                <Text style={{height: 50, fontSize: 20}}>Chat</Text>
                <View style={{flexDirection:"row"}}>
                    <View style={{flex:1}}>
                        <TextInput
                            placeholder="Sender"
                            style={{justifyContent: 'flex-start', height: 40, borderWidth: 1, borderColor: 'grey'}}
                            value={this.state.sender}
                            onChangeText={sender => {
                                this.setState({sender})
                            }}
                        />
                    </View>
                    <View style={{flex:1}}>
                        <TextInput
                            placeholder="Receiver"
                            style={{justifyContent: 'flex-start', height: 40, borderWidth: 1, borderColor: 'grey'}}
                            value={this.state.receiver}
                            onChangeText={receiver => {
                                this.setState({receiver})
                            }}
                        />
                    </View>
                    <View style={{flex:1}}>
                        <Button style={styles.buttonContainer} onPress={this.joinChat.bind(this)}
                                title="Join!"
                                accessibilityLabel="Tap on Me"/>
                    </View>
                </View>
                <TextInput
                    placeholder="Enter message"
                    style={{ height: 40, borderWidth: 1, borderColor: 'black'}}
                    autoCorrect={false}
                    value={this.state.message}
                    onChangeText={message => {
                        this.setState({message})
                    }}
                    onSubmitEditing={() => this.sendChat()}
                />
            </View>
        );

        if(this.state.loading){
            return(
                <View>
                    {panel}
                    <View style={styles.loader}>
                        <ActivityIndicator size="large" color="#0c9"/>
                    </View>
                </View>
            )
        }

        return (
            <View>
                {panel}
                {chatMsgList}
            </View>
        );
    }
}

AppRegistry.registerComponent('app', () => app);

import {Colors} from 'react-native/Libraries/NewAppScreen';

const styles = StyleSheet.create({
    scrollView: {
        backgroundColor: Colors.lighter,
    },
    engine: {
        position: 'absolute',
        right: 0,
    },
    body: {
        backgroundColor: Colors.white,
    },
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: Colors.black,
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
        color: Colors.dark,
    },
    highlight: {
        fontWeight: '700',
    },
    footer: {
        color: Colors.dark,
        fontSize: 12,
        fontWeight: '600',
        padding: 4,
        paddingRight: 12,
        textAlign: 'right',
    },
    buttonContainer: {
        color: '#2E9298',
        borderRadius: 10,
        padding: 10,
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowRadius: 10,
        shadowOpacity: 0.25,
        height: 40
    }
});
