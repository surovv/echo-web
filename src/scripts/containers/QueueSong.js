import React, {Component} from 'react';
import {connect} from 'react-redux';

import Song from '../components/Song';

import {addClonedSongs, addClonedSongToTopAndPlay, remove as removeFromQueue} from '../actions/QueueActions';
import {setCurrentSong, pause, play} from '../actions/PlayerActions';


const mapStateToProps = (state, ownProps) => ({
  song: state.songs[ownProps.id],
  isCurrentSong: state.player.currentSong.id === ownProps.id,
  isPlaying: state.player.playing && (state.player.currentSong.id === ownProps.id),
  inQueue: true
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  remove: () => dispatch(removeFromQueue([ownProps.id])),
  setCurrentSong: song => () => dispatch(setCurrentSong(song)),

  play: () => dispatch(play()),
  pause: () => dispatch(pause())
});


export default connect(mapStateToProps, mapDispatchToProps)(Song);
