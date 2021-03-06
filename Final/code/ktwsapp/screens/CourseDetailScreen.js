import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import Chart from '../components/StatChart'
import Request from '../request'
import Evaluations from '../components/Evaluations'
const screenX = Dimensions.get('window').width;
const screenY = Dimensions.get('window').height;
const testData = [
  {
      "photoId": 1,
      "timestamp": 1531677812272,
      "stats": [
          {
              "id": 30000,
              "numOfFace": 100,
              "type": "ALL"
          }
      ]
  },
  {
      "photoId": 2,
      "timestamp": 1531677813272,
      "stats": [
          {
              "id": 30001,
              "numOfFace": 200,
              "type": "ALL"
          }
      ]
  },
  {
      "photoId": 3,
      "timestamp": 1531677814272,
      "stats": [
          {
              "id": 30002,
              "numOfFace": 300,
              "type": "ALL"
          }
      ]
  }
]
let mock_data = [
          {time: '2018-08-09 20:30:11', value: 5},
          {time: '2018-08-09 20:35:14', value: 6},
          {time: '2018-08-09 20:40:40', value: 8},
          {time: '2018-08-09 20:45:40', value: 2},
          {time: '2018-08-09 20:50:40', value: 9},
          {time: '2018-08-09 20:55:40', value: 3},
          {time: '2018-08-09 21:00:40', value: 6},
          {time: '2018-08-09 21:05:40', value: 5},
          {time: '2018-08-09 21:10:40', value: 1},
          {time: '2018-08-09 21:15:40', value: 2},
          {time: '2018-08-09 21:20:40', value: 7},
          {time: '2018-08-09 21:25:40', value: 8},
          {time: '2018-08-10 21:40:40', value: 200}
      ];

      let sectionStat = [
        {
            "id": 5,
            "courseId": 4,
            "datetime": "2018-07-25 14:00:46",
            "info": {
                "max": {
                    "time": "14:00:46",
                    "value": 80
                },
                "average": "80%",
                "min": {
                    "time": "14:45:00",
                    "value": 40
                },
                "emotion": 0.8
            }
        },
        {
            "id": 6,
            "courseId": 4,
            "datetime": "2018-07-27 14:00:46",
            "info":{
                "max": {
                    "time": "14:00:46",
                    "value": 70
                },
                "average": "70%",
                "min": {
                    "time": "14:45:00",
                    "value": 30
                },
                "emotion": 0.6
            }
        }
    ]

export default class CourseDetailScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            id: this.props.navigation.getParam('id'),
            lastData: testData,
            lastThreeData: testData,
            sectionStat: []
        }
    }
    static navigationOptions = {
        header: null,
    }

        timestampToTime = (timestamp) => {
            let date = new Date(timestamp);
            let Y = date.getFullYear() + '-';
            let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
            let D = date.getDate() + ' ';
            let h = date.getHours() + ':';
            let m = date.getMinutes() + ':';
            let s = date.getSeconds();
            if(h.length < 3)
                h = '0' + h;
            if(m.length < 3)
                m = '0' + m;
            if(s.length < 3)
                s = '0' + s;
            return Y+M+D+h+m+s;
        };

        processData = (data) => {
            if (data.length === 0){
                return false
            }
            let newData = [];
            data.sort(function (a, b) {
                return a.timestamp - b.timestamp
            });
            // if (data.length > 13){
            //     data.splice(0,data.length-13);
            // }
            data.forEach((column) =>{
                let timestamp = column.timestamp;
                let value = 0;
                column.stats.forEach((stat) => {
                    if (stat.type === "ALL") {
                        value = stat.numOfFace;
                    }
                });
                let id = column.photoId;
                let aColumn = {
                    time: this.timestampToTime(timestamp),
                    value: value,
                    id: id
                };
                newData.push(aColumn)
            });
            return newData
        };

        processData3 = (data) => {
            let newData = []
            data.forEach((column) =>{
                let aColumn = {
                    id: column.id,
                    datetime: column.datetime,
                    average: column.info.average,
                    max: column.info.max.time,
                    maxNum: column.info.max.value,
                    min: column.info.min.time,
                    minNum: column.info.min.value,
                    emotion: column.info.emotion
                };
                newData.push(aColumn)
            });
            return newData
        }

    componentWillMount() {
        let id = this.state.id;
        let LAST_THREE_COURSE_STAT_URL = '/api/stat/byLast3Courses?courseId=' + id;
        let LAST_COURSE_STAT_URL = '/api/stat/byLastCourse?courseId=' + id;
        let SECTION_STAT_URL = '/api/stat/sectionStat?courseId=' + id;
        Request.get(LAST_THREE_COURSE_STAT_URL)
            .then((res) => {
                let data = res.data;
                if (data.length > 0) {
                    this.setState({
                        lastThreeData: this.processData(data)
                    })
                }
            })
            .catch((error) => {
                console.log(error);
        });
        Request.get(LAST_COURSE_STAT_URL)
            .then((res) => {
                let data = res.data;
                if (data.length > 0) {
                    this.setState({
                        lastData: this.processData(data)
                    })
                }
            })
            .catch((error) => {
                console.log(error);
        });
        Request.get(SECTION_STAT_URL)
        .then((res) => {
            let data = res.data;
            if (data.length > 0) {
                this.setState({
                    sectionStat: this.processData3(data)
                })
            }
        })
        .catch((error) => {
            console.log(error);
        });
    };

  render() {
      const { navigation } = this.props;
      const name = navigation.getParam('name','noName')
      const index = navigation.getParam('index','noIndex')
      const time = navigation.getParam('time').replace('\n',' ')
      const id = navigation.getParam('id')
      const numOfStudent = navigation.getParam('numOfStudent')
      const camera = navigation.getParam('camera')
      return (
      <ScrollView style={styles.container}>
        <View style={styles.top}>
          <TouchableOpacity style={styles.addCourse}
          onPress={() => this.props.navigation.navigate('Courses')}>
          <Icon name='chevron-left' style={{fontSize:25}} color='white'/>
          </TouchableOpacity>
          <View style={styles.titleCenter}>
            <Text style={styles.topText}>
              {name}
            </Text>
            </View>
        </View>
        <ScrollView style={styles.preview}>
            <View style={styles.Line}>
                <Text style={styles.title}>{name}</Text>
                <Text style={styles.right}>id：{id}</Text>
            </View>
            <View style={styles.Line}>
                <Text style={styles.left}>课程代码：{index}</Text>
                <Text style={styles.right}>学生数：{numOfStudent}</Text>
            </View>
            <View style={styles.Line}>
                <Text style={styles.left}>授课时间：{time}</Text>
            </View>
            <TouchableOpacity style={styles.video} 
            onPress={() => this.props.navigation.navigate('Video', {
                camera: camera
            })}>
            <Icon name='camera-alt' style={{fontSize:30}} color='black'/>
            </TouchableOpacity>
        </ScrollView>
        <TouchableOpacity style={styles.preview}
        onPress={() => this.props.navigation.navigate('Data',{
          data: this.state.lastData,
          title: '上一次课的统计数据'
        })}>
            <View style={styles.lastCourse}>
                <Text style={{fontSize:17,color:'black'}}>上一次课的统计</Text>
            </View>
            <View style={styles.chart}>
                <Chart data={this.state.lastData}/>

            </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.preview}
        onPress={() => this.props.navigation.navigate('Data',{
          data: this.state.lastThreeData,
          title: '上三次课的统计数据'
        })}>
            <View style={styles.lastThreeCourse}>
                <Text style={{fontSize:17,color:'black'}}>上三次课的统计</Text>
            </View>
            <View style={styles.chart}>
                <Chart data={this.state.lastThreeData}/>
            
            </View>
        </TouchableOpacity>
        
        <View style={{height:10}}/>
        <Evaluations evaluationData={this.state.sectionStat} total = {numOfStudent? numOfStudent : 5}/>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(232,232,232, 1)',
  },
  titleCenter: {
    width: screenX,
    position:'absolute',
    alignItems:'center',
    paddingTop: 20,
    paddingBottom: 20,
  },
  top: {
    backgroundColor: 'rgba(155,207,246, 1)',
    flexDirection: 'row',
    paddingTop: 20,
    paddingBottom: 20,
  },
  topText: {
    fontSize: 17,
    color: 'white',
  },
  Line:{
    flexDirection: 'row',
    alignItems: 'center',
    marginTop:5,
    marginBottom:5,
  },
  left:{
    color:'grey',
  },
  right:{
    color:'grey',
    left: 20,
  },
  title:{
    fontSize:18,
    color:'black',
  },
  preview:{
    backgroundColor: '#FFFFFF',
    alignSelf: 'center',
    flexDirection: 'column',
    width: Dimensions.get('window').width-40,
    marginTop: 20,
    paddingLeft: 5,
    elevation: 5,
  },
  chart:{
    height:200,
    width:screenX
  },
  video:{
    position:'absolute',
    alignItems: 'flex-end',
    width: Dimensions.get('window').width-45,
    marginTop: 30,
  }
});
