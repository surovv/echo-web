import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import QueueStreamSong from './QueueStreamSong';


import {remove} from '../actions/QueueActions';
import {playlistDuration, withHours as durationWithHours} from '../lib/duration';
import {getStreamAndNestedEntities} from '../lib/stream';


import bp from '../../assets/styles/bootstrap.css';
import styles from '../../assets/styles/queueStream.css';


const mapStateToProps = (state, ownProps) => getStreamAndNestedEntities(state, ownProps.id);

const mapDispatchToProps = (dispatch, ownProps) => ({
  remove: () => dispatch(remove(ownProps.id))
});

class QueueStream extends Component {

  state = {opened: false}

  toggleSongList = () => this.setState({opened: !this.state.opened});

  openStreamInNewTab = () => Promise.resolve(window.open(`http://beta.echoapplication.com/#/feed/${this.props.stream.id}`)).then(win => win.focus());

  componentWillReceiveProps(nextProps){
    return nextProps.playlist.songs.length ? false : this.props.remove();
  }

  render(){
    return(
      <div className={`${styles.root} ${this.state.opened ? styles.opened : ''}`}>
        <div style={{cursor: 'pointer'}} onClick={this.toggleSongList}>
          <div className={styles.artwork}>
            <img src={this.props.stream.artwork_url} />
          </div>
          <div className={styles.info}>
            <div className={styles.title}>
              {this.props.playlist.title || 'no title'}
              <i className={styles.openInNewIcon} onClick={this.openStreamInNewTab}>open_in_new</i>
            </div>
            <div className={styles.userAvatar}>
              by <img src={this.props.user.avatar_url} alt='user avatar' />
              <span className={styles.username}>{this.props.user.name}</span>
            </div>
            <div className={styles.duration}>
              <i className={styles.timeIcon}>access_time</i>
              <span>{this.props.duration}</span>
              <i className={styles.queueIcon}>queue_music</i>
              <span>{this.props.playlist.songs.length} tracks</span>
              <i className={styles[this.state.opened ? 'openedIcon' : 'closedIcon']}>arrow_drop_down</i>
            </div>
          </div>
          <div className={styles.icons}>
            <i className={styles.closeIcon} onClick={this.remove}>close</i>
          </div>
        </div>
        <div className={`${styles.songList} ${this.state.opened ? styles.visible : ''}`}>
          {this.props.playlist.songs.map(songId => <QueueStreamSong playlist={this.props.playlist} id={songId} key={songId} />)}
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(QueueStream);