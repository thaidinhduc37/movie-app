import { useEffect, useRef } from 'react';
import Hls from 'hls.js';
import classNames from 'classnames/bind';
import styles from './MoviePlayer.module.scss';

const cx = classNames.bind(styles);

function MoviePlayer({ data }) {
    const videoRef = useRef(null);

    useEffect(() => {
        const video = videoRef.current;
        let hls;

        if (data && data.link_m3u8 && video) {
            if (Hls.isSupported()) {
                hls = new Hls();
                hls.loadSource(data.link_m3u8);
                hls.attachMedia(video);
                hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    video.muted = true;
                    video.play();
                });
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = data.link_m3u8;
                video.muted = true;
                video.addEventListener('loadedmetadata', () => {
                    video.play();
                });
            }
        }

        return () => {
            if (hls) {
                hls.destroy();
            }
        };
    }, [data]);

    return (
        <video ref={videoRef} id="my-hls-video" width="100%" controls muted>
            Trình duyệt của bạn không hỗ trợ phát video.
        </video>
    );
}

export default MoviePlayer;
