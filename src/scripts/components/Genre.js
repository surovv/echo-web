import React, {Component} from 'react';
import {Link} from 'react-router-dom';

import ShareIconMenu from './ShareIconMenu';
import TagsSelect from './TagsSelect';
import {GenreCard} from './Genres';

import {getGenre, getGenreTags, genres} from '../lib/genres';

import styles from '../../assets/styles/genre.css';
import cardStyles from '../../assets/styles/card.css';
import feedStyles from '../../assets/styles/feed.css';


const RoomPreview = props => (<div>
  room preview
</div>)


class Genre extends Component {

  genre = getGenre(this.props.match.params.title);
  tags = getGenreTags(this.props.match.params.title);

  setTags = tags => this.setState({tags});
  handleTagClick = tag => false;


  state = {
    rooms: [],
    tags: [],
  }

  render(){
    return(
      <div className={styles.genre}>

        <div className={styles.left}>
          <div className={styles.genreHeader} style={{backgroundImage: `url(${this.genre.background_url})`}}>
            <div className={styles.genreCard}>
              <img className={cardStyles.artwork} src={this.genre.artwork_url} alt='' />
              <div className={cardStyles.data}>
                <div className={cardStyles.titleBlock}>
                  <span className={cardStyles.title}>{this.genre.title} Music</span>
                  <span className={styles.requestSpan}>REQUEST TO ADD ROOM</span>
                </div>
                <div className={cardStyles.description}>
                  <i>{this.genre.description}</i>
                </div>
                <div className={cardStyles.iconArea}>
                  <ShareIconMenu path={`/genres/${this.genre.title}`} picture={this.genre.artwork_url}
                    title={this.genre.title} description={this.genre.description} />
                </div>
              </div>
            </div>
          </div>

          <div className={styles.leftContent}>
            <div className={styles.tags}>
              <span className={styles.t}>Tags:</span>
              <TagsSelect
                allTags={this.tags}
                selectedTags={this.state.tags}
                setTags={this.setTags}
                handleTagClick={this.handleTagClick}
                theme={feedStyles}
              />
            </div>

            {genres.map(genre => <GenreCard key={genre.title} genre={genre} />)}
          </div>

        </div>

        <div className={styles.right}>
          SIMILAR ROOMS
        </div>
      </div>
    )
  }

}

export default Genre;
