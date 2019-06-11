/**
 * Comment Section Challenge
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Image } from 'react-native';

const SERVER_URL = 'http://localhost:8000';

type CommentResource = { 
  id: string,
  parent_id?: string,
  content: string,
};
type VideoResource = { 
  video_id: string,
  video_title: string,
  comments: CommentResource[],
  video_thumbnail: string,
};


type Props = { };
type State = { videoData: ?VideoResource }
export default class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      videoData: null,
    }
  }
  
  componentDidMount() {
    this.loadVideoAndComments();
  }

  loadVideoAndComments = async () => {
    const resp = await fetch(`${SERVER_URL}/data/videos/1330.json`);
    this.setState({ videoData: await resp.json() });
  }

  render() {
    const { videoData } = this.state;
    return (
      <View style={styles.container}>
        <DummyVideo data={videoData}/>
        <CommentSection 
          isLoaded={!!videoData} 
          comments={videoData ? videoData.comments : []} 
        />
      </View>
    );
  }
}

type CommentSectionProps = {
  isLoaded: boolean,
  comments: CommentResource[],
};
const CommentSection = (props: CommentSectionProps) => {
    const { isLoaded, comments } = props;
    if (!isLoaded || comments.length == 0) {
      return <View style={styles.commentSection} />;
    }
    return (
      <View style={styles.commentSection}>
        {comments.map((comment) => 
          <View style={styles.comment}>
            <Text style={styles.commentText}>
              {comment.content}
            </Text>
          </View>
        )}
      </View>
    );
} 

const findChildren = (parent, allComments) => 
  allComments.filter((c) => c.parent_id === parent.id); 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  centerBigText: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  commentSection: {
    width: "100%",
    flexDirection: 'column',
  },
  comment : {
    width: "100%",
    marginHorizontal: 10,
  },
  commentText: { 
    fontSize: 18,
    height: 25,
  } 
});

const DummyVideo = ({ data }: any) => {
  const PLACEHOLDER_DATA =  { 
    video_title: 'loading',
    thumbnail_url: ''
  };
  const safeData = data ? data : PLACEHOLDER_DATA;
  return (
  <>
    <Image
      style={{
        backgroundColor: 'black',
        width: '100%', maxHeight: 200, flex: 1, resizeMode: "contain" }}
      source={{uri: `${SERVER_URL}${safeData.thumbnail_url}`}}
      />
    <Text style={styles.centerBigText}>
      {safeData.video_title}
    </Text> 
  </>
  );
}
