import classNames from 'classnames/bind';
import { useState } from 'react';

import Button from '../Button';
import styles from './EpisodesList.module.scss';

const cx = classNames.bind(styles);

function EpisodesList({ title, data, slug, className, onSelectEpisode }) {

    const [newSlug, setNewSlug] = useState(slug.replace(/-tap.*/, ''));

    return (
        <div className={cx('episodes', className)}>
            <span>{title}</span>
            <div className={cx('episodes-list')}>
                {data &&
                    Array.isArray(data) &&
                    data.map((episode, i) => (
                        <Button
                            key={i}
                            className={cx('episodes-item')}
                            onClick={() => onSelectEpisode(i)}
                            to={`/watch/${newSlug}-${episode.slug}`}
                            title={episode.name}
                        />
                    ))}
            </div>
        </div>
    );
}

export default EpisodesList;
