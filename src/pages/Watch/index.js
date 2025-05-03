import classNames from 'classnames/bind';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';

import EpisodesList from '~/components/EpisodesList';
import Button from '~/components/Button';
import MovieContainer from '~/layouts/components/MovieContainer';
import styles from './Watch.module.scss';
import MoviePlayer from '~/components/MoviePlayer';
import Social from '~/components/Social';
import Breadcrumb from '~/components/Breadcrumb';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDatabase, faPowerOff, faRectangleAd } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function Watch() {
    const { slug } = useParams();
    const [newSlug, setNewSlug] = useState(slug.replace(/-tap.*/, ''));
    const [data, setData] = useState([]); // State để lưu dữ liệu từ API
    const [episodes, setEpisodes] = useState([]); // State để lưu tập phim
    const [loading, setLoading] = useState(true); // Trạng thái loading
    const [error, setError] = useState(null); // Trạng thái lỗi nếu có
    const [selectedEpisode, setSelectedEpisode] = useState([]);

    const [isAutoplayOn, setIsAutoplayOn] = useState(false);

    const handleAutoplayToggle = (event) => {
        if (event) {
            event.preventDefault(); // Ngăn chặn hành vi reload mặc định
        }
        // Logic toggle autoplay
        setIsAutoplayOn((prevState) => !prevState);
    };

    const handleEpisodeSelect = (episode) => {
        setSelectedEpisode(episodes[episode]);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`https://phimapi.com/phim/${newSlug}`);

                if (response.data) {
                    setData(response.data.movie);
                    setEpisodes(response.data.episodes[0]?.server_data || []);
                } else {
                    setData([]);
                    setEpisodes([]);
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [newSlug]);

    if (loading) {
        return <div>Đang tải dữ liệu...</div>;
    }

    if (error) {
        return <div>Có lỗi xảy ra: {error}</div>;
    }

    return (
        <div className={cx('wrapper')}>
            <div className={cx('block-note')}>
                Truy cập <font color="red">PhimMoiPlus.Net</font> sẽ chuyển tới link PhimMoiChill mới nhất
            </div>
            <div className={cx('gnarty-offads')}></div>
            <Breadcrumb data={data} />
            <div className={cx('box-players')}>
                <div className={cx('block-note')}>
                    <h4 className={cx('hidden')}>Lịch chiếu/ghi chú</h4>
                    <p>Nếu thấy hay thì cho mình 1 like để có thêm động lực</p>
                </div>
                <div className={cx('player')}>
                    <div className={cx('player-area')}>
                        <MoviePlayer data={selectedEpisode} />
                    </div>
                </div>
                <div className={cx('film-note')}>
                    Phim Xem tốt nhất trên trình duyệt Safari,FireFox hoặc Chrome. Đừng tiếc 1 comment bên dưới để đánh
                    giá phim hoặc báo lỗi. Đổi server nếu lỗi,lag
                </div>
                <div className={cx('gnarty-offads')}></div>
                <div className={cx('option')}>
                    <ul className={cx('tool')}>
                        <li className={cx('ads-tool')}>
                            <Button
                                className={cx('ads-btn')}
                                title={'Tắt QC'}
                                rightIcon={<FontAwesomeIcon className={cx('ads-icon')} icon={faRectangleAd} />}
                            />
                        </li>
                        <li className={cx('lamp-tool')}>
                            <Button
                                className={cx('lamp-btn')}
                                title={<span className={cx('lamp-title')}>Tắt đèn</span>}
                                rightIcon={
                                    <em className={cx('radial-center')}>
                                        <FontAwesomeIcon className={cx('lamp-icon')} icon={faPowerOff} />
                                    </em>
                                }
                            />
                        </li>
                        <li className={cx('tool-autoplay')}>
                            <Button
                                className={cx('autoplay-btn')}
                                onClick={handleAutoplayToggle}
                                title={
                                    <span className={cx('autoplay-title')}>
                                        {isAutoplayOn ? 'Tự chuyển tập' : 'Tắt tự chuyển tập'}
                                    </span>
                                }
                                rightIcon={
                                    <div className="toggle-container">
                                        <button
                                            type="button"
                                            className={`toggle-button ${isAutoplayOn ? 'yes' : 'no'}`}
                                            onClick={handleAutoplayToggle} // Đảm bảo sự kiện không gây reload
                                        >
                                            {isAutoplayOn ? 'YES' : 'NO'}
                                        </button>
                                    </div>
                                }
                            />
                        </li>
                    </ul>
                </div>
            </div>
            <div className={cx('clear')}></div>
            <div className={cx('pm-server')}>
                <div className={cx('server-center')}>
                    <ul className={cx('server-list')}>
                        <span className={cx('server-title')}>Đổi Server:</span>
                        <li className={cx('server-backup')}>
                            <Button className={cx('server-item', 'active')} title={'#1 PMFAST'} />
                        </li>
                        <li className={cx('server-backup')}>
                            <Button className={cx('server-item')} title={'#2 PMHLS'} />
                        </li>
                        <li className={cx('server-backup')}>
                            <Button className={cx('server-item')} title={'#3 PMPRO'} />
                        </li>
                        <li className={cx('server-backup')}>
                            <Button className={cx('server-item')} title={'#4 PMBK'} />
                        </li>
                    </ul>
                </div>
            </div>
            <div className={cx('episodes')}>
                <div className={cx('episodes-group')}>
                    <span className={cx('episodes-title')}>
                        <FontAwesomeIcon className={cx('episodes-icon')} icon={faDatabase} />
                        Danh sách tập phim
                    </span>
                    <ul className={cx('episodes-list')}>
                        <EpisodesList
                            onSelectEpisode={handleEpisodeSelect}
                            className={cx('episodes-item')}
                            data={episodes}
                            slug={slug}
                        />
                    </ul>
                </div>
            </div>
            <div className={cx('clear')}></div>
            <div className={cx('box-rating')}>
                <span className={cx('rating-title')}>Đánh giá phim</span>
                <div className={cx('rating-block')}>
                    <Social />
                </div>
            </div>
            <div className={cx('clear')}></div>
            <div className={cx('film-infor')}>
                <h1 className={cx('infor-title')}>{data.name}</h1>
                <h2 className={cx('infor-name')}>{data.origin_name}</h2>
                <p className={cx('infor-content')}>
                    {data.content.substring(0, 300)}...
                    <Link className={cx('infor-link')} to={`/infor/${slug}`}>
                        {'[Xem thêm]'}
                    </Link>
                </p>
            </div>
            <div className={cx('comment')}>
                <h3>Khi nào có Bình luận sẽ thêm vào sau</h3>
            </div>
            <div className={cx('film-related')}>
                <MovieContainer
                    apis={[
                        'https://phimapi.com/v1/api/tim-kiem?keyword=hot&limit=5',
                        'https://phimapi.com/v1/api/tim-kiem?keyword=new&limit=5',
                    ]}
                    displayType={'slider'}
                    sliderTitle={'CÓ THỂ BẠN CŨNG MUỐN XEM'}
                />
            </div>
            <div className={cx('film-related')}>
                <MovieContainer
                    apis={[
                        'https://phimapi.com/v1/api/tim-kiem?keyword=moi&limit=5',
                        'https://phimapi.com/v1/api/tim-kiem?keyword=2024&limit=5',
                    ]}
                    displayType={'slider'}
                    sliderTitle={'PHIM ĐỀ CỬ MỚI'}
                />
            </div>
        </div>
    );
}

export default Watch;
