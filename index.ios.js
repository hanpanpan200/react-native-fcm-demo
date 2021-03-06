import React, { Component } from 'react'
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Platform,
} from 'react-native'
import FCM, {
  FCMEvent,
  RemoteNotificationResult,
  WillPresentNotificationResult,
  NotificationType,
} from 'react-native-fcm'

FCM.on(FCMEvent.Notification, async (notif) => {
  console.log('notif.notification>>>>>>>>', notif.notification)
  console.log('notif.data>>>>>>>>', notif.data)
  if(notif.local_notification){
    //this is a local notification
  }
  if(notif.opened_from_tray){
    //iOS: app is open/resumed because user clicked banner
    //Android: app is open/resumed because user clicked banner or tapped app icon
  }
  if(Platform.OS ==='ios'){
    //optional
    switch(notif._notificationType){
      case NotificationType.Remote:
        notif.finish(RemoteNotificationResult.NewData) //other types available: RemoteNotificationResult.NewData, RemoteNotificationResult.ResultFailed
        break;
      case NotificationType.NotificationResponse:
        notif.finish();
        break;
      case NotificationType.WillPresent:
        notif.finish(WillPresentNotificationResult.All) //other types available: WillPresentNotificationResult.None
        break;
    }
  }
})
FCM.on(FCMEvent.RefreshToken, (token) => {
  console.log(`Refresh token ${token}`)
  // fcm token may not be available on first load, catch it here
})
export default class FCMDemo extends Component {
  componentDidMount () {
    FCM.requestPermissions()
      .then(()=>console.log('granted'))
      .catch(()=>console.log('notification permission rejected'))
    FCM.getFCMToken().then(token => {
      console.log('getFCMToken success>>>>>>>', token)
      // store fcm token in your server
    })
    this.notificationListener = FCM.on(FCMEvent.Notification, async (notif) => {
      // optional, do some component related stuff
    })
    // initial notification contains the notification that launchs the app. If user launchs app by clicking banner, the banner notification info will be here rather than through FCM.on event
    // sometimes Android kills activity when app goes to background, and when resume it broadcasts notification before JS is run. You can use FCM.getInitialNotification() to capture those missed events.
    // initial notification will be triggered all the time even when open app by icon so send some action identifier when you send notification
    FCM.getInitialNotification().then(notif=>{
      console.log(notif)
    })
  }
  componentWillUnmount() {
    // stop listening for events
    this.notificationListener.remove()
  }
  
  setupBadgeNumber = () => {
    FCM.getBadgeNumber().then(number=>console.log(`Current badge number ${number}`))
    FCM.setBadgeNumber(1)
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions} onPress={this.setupBadgeNumber}>
          Setup Badge Number
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
})

AppRegistry.registerComponent('FCMDemo', () => FCMDemo)
