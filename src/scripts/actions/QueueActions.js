import {
  ADD_TO_QUEUE, ADD_TO_QUEUE_TOP, REMOVE_FROM_QUEUE, SET_QUEUE
} from '../constants/ActionTypes';

import {Queue} from '../constants/creatorsArgs';

import {createSubFeedActions} from './actionsCreators';

import {addSongs, addStreams, addPlaylists, updatePlaylists} from './EntitiesAUDActions';
import {setCurrentSong} from './PlayerActions';

import {create as createStream} from '../lib/ebApi/streams';
import {addId as clone, reduceToObject} from '../lib/base';

import v4 from 'uuid/v4';


export const {setQueue: set, addToQueue: add, removeFromQueue: remove} = createSubFeedActions(Queue)(SET_QUEUE, ADD_TO_QUEUE, REMOVE_FROM_QUEUE);

export const addToTop = references => ({
  type: ADD_TO_QUEUE_TOP,
  payload: references
});

export const removeStreamSong = (playlist, songId) =>
  updatePlaylists({[playlist.id]: {...playlist, songs: playlist.songs.filter(sid => sid !== songId)}});



// songs
const dispatchSongs = action => songs => dispatch => {
  dispatch(addSongs(reduceToObject(songs)));
  return dispatch(action(songs.map(song => ({id: song.id, type: 'song'}))));
}

const dispatchClonedSongs = action => songs => dispatchSongs(action)(songs.map(clone))
export const addClonedSongs = dispatchClonedSongs(add);
export const addClonedSongsToTop = dispatchClonedSongs(addToTop);


export const addClonedSongsToTopAndPlay = songs => dispatch => {
  const sngs = songs.map(clone);
  dispatchSongs(addToTop)(sngs)(dispatch);
  return dispatch(setCurrentSong(sngs[0]));
};
export const addClonedSongToTopAndPlay = song => addClonedSongsToTopAndPlay([song]);



// streams
const cloneStream = (stream, playlist, songs) => {
  const sngs = songs.map(clone), pllst = {...clone(playlist), songs: sngs.map(song => song.id)}, strm = {...clone(stream), playlist: pllst.id};
  return {stream: strm, playlist: pllst, songs: sngs};
}

const streamObjToArr = strmObj => [strmObj.stream, strmObj.playlist, strmObj.songs];

const dispatchStream = action => (stream, playlist, songs) => dispatch => {
  dispatch(addSongs(reduceToObject(songs)));
  dispatch(addPlaylists(reduceToObject([playlist])));
  dispatch(addStreams(reduceToObject([stream])));
  return dispatch(action([{id: stream.id, type: 'stream'}]));
}


const dispatchClonedStream = action => (stream, playlist, songs) => dispatchStream(action)(...streamObjToArr(cloneStream(stream, playlist, songs)));
export const addClonedStream = dispatchClonedStream(add);

export const addClonedStreamToTopAndPlay = (stream, playlist, songs) => dispatch => {
  const {stream: strm, playlist: pllst, songs: sngs} = cloneStream(stream, playlist, songs);
  dispatchStream(addToTop)(strm, pllst, sngs)(dispatch);
  return dispatch(setCurrentSong(sngs[0]));
}
