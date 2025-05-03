import classNames from 'classnames/bind';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';

import EpisodesList from '~/components/EpisodesList';
import Button from '~/components/Button';
import MovieContainer from '~/layouts/components/MovieContainer';
import styles from './Infor.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlayCircle } from '@fortawesome/free-solid-svg-icons';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import Image from '~/components/Image';
import Social from '~/components/Social';
import Breadcrumb from '~/components/Breadcrumb';

const cx = classNames.bind(styles);
function Infor() {
    const { slug } = useParams();
    const [data, setData] = useState([]); // State để lưu dữ liệu từ API
    const [episodes, setEpisodes] = useState([]); // State để lưu tập phim
    const [loading, setLoading] = useState(true); // Trạng thái loading
    const [error, setError] = useState(null); // Trạng thái lỗi nếu có
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`https://phimapi.com/phim/${slug}`);

                // Kiểm tra dữ liệu trả về từ API

                // Sử dụng optional chaining để đảm bảo data và items tồn tại

                if (response.data) {
                    setData(response.data.movie); // Nếu items là mảng, lưu vào state
                    const serverData = response.data.episodes[0]?.server_data;
                    if (Array.isArray(serverData)) {
                        setEpisodes(serverData); // Gán server_data nếu là mảng
                    } else {
                        setEpisodes([]); // Nếu không có server_data, đặt mảng rỗng
                    }
                } else {
                    setData([]); // Nếu không, lưu mảng rỗng
                    setEpisodes([]);
                }
            } catch (error) {
                setError(error.message); // Lưu thông báo lỗi nếu có
            } finally {
                setLoading(false); // Tắt trạng thái loading
            }
        };

        fetchData(); // Gọi hàm fetchData
    }, [slug]); // useEffect chỉ chạy một lần khi component mount
    const categories = data.category || [];
    const countries = data.country;

    const actors = data.actor;

    if (loading) {
        return <div>Đang tải dữ liệu...</div>; // Hiển thị loading
    }

    if (error) {
        return <div>Có lỗi xảy ra: {error}</div>; // Hiển thị lỗi nếu có
    }
    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <Breadcrumb data={data} />
                <div className={cx('film-infor')}>
                    <div
                        className={cx('image')}
                        style={{ background: `url(${data.thumb_url}) no-repeat center`, backgroundSize: 'cover' }}
                    >
                        <Image className={cx('avatar')} alt={data.name} src={data.thumb_url} />
                        <Link className={cx('icon-play')} to={`/watch/${data.slug}`} />
                        <div className={cx('text')}>
                            <h1>{data.name}</h1>
                            <h2>{data.origin_name}</h2>
                            <ul className={cx('list-button')}>
                                <li>
                                    <Button
                                        className={cx('link', 'btn', 'btn-infor')}
                                        to={`/watch/${data.trailer_url}`}
                                        leftIcon={<FontAwesomeIcon icon={faYoutube} className={cx('fa')} />}
                                        title={'Trailer'}
                                    />
                                </li>
                                <li>
                                    <Button
                                        className={cx('link', 'btn', 'btn-danger')}
                                        to={`/watch/${data.slug}`}
                                        leftIcon={<FontAwesomeIcon icon={faPlayCircle} className={cx('fa')} />}
                                        title={'Xem phim'}
                                    />
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className={cx('episodes')}>
                        <div className={cx('list-episodes')}>
                            <EpisodesList
                                title={'Tập mới nhất:'}
                                data={episodes}
                                slug={slug}
                            />
                        </div>
                    </div>

                    <div className={cx('infor-text')}>
                        <Social />
                        <ul className={cx('entry-meta', 'block film')}>
                            <li>
                                <label>Đang phát: </label>
                                <span className={cx('entry-meta-red')}>{data.episode_current}</span>
                            </li>
                            <li>
                                <label>Năm phát hành: </label>
                                <Link
                                    className={cx('entry-meta-item')}
                                    to={`/list/phim-nam-${data.year}`}
                                >{`Năm ${data.year}`}</Link>
                            </li>
                            <li>
                                <label>Quốc gia: </label>
                                <Link
                                    className={cx('entry-meta-item')}
                                    to={`/country/phim-${countries[0].slug}`}
                                >{`Phim ${countries[0].name}`}</Link>
                            </li>
                            <li>
                                <label>Thể loại: </label>
                                <Link
                                    className={cx('entry-meta-item')}
                                    to={`/genre/phim-${categories[0].slug}`}
                                >{`Phim ${categories[0].name}`}</Link>
                            </li>
                            <li>
                                <label>Đạo diễn: </label>
                                <Link className={cx('entry-meta-item')} to={'/dao-dien'}>
                                    {data.director}
                                </Link>
                            </li>
                            <li>
                                <label>Điểm IMDb: </label>
                                <span className={cx('entry-meta-item', 'imdb')}>8.4</span>
                            </li>
                            <li>
                                <label>Rottentomatoes: </label>
                                <span className={cx('entry-meta-item', 'imdb')}>69% Tomatometer</span>
                            </li>
                            <li>
                                <label>Thời lượng: </label>
                                <span className={cx('entry-meta-item')}>{`${data.episode_total} tập`}</span>
                            </li>
                            <li>
                                <label>Diễn viên: </label>
                                {actors.map((act, i) => (
                                    <Link className={cx('entry-meta-item')} to={'/dao-dien'}>{`${act}, `}</Link>
                                ))}
                            </li>
                        </ul>
                        <div className={cx('clear')}></div>
                        <div className={cx('block-note')}>
                            <h4 className={cx('hidden')}>Lịch chiếu/ghi chú</h4>
                            <p>1 tập chủ nhật hàng tuần trên phimmoi</p>
                        </div>
                        <div className={cx('content', 'block-film')}>
                            <h3 className={cx('heading-title')}>Nội dung phim</h3>
                            <div className={cx('content-film')}>
                                <b>{data.name}</b>
                                {data.content}
                            </div>
                        </div>
                        <div className={cx('block-film')}></div>
                        <div className={cx('block-film')}>
                            <h3 className={cx('heading-title')}>Tags</h3>
                            <div className={cx('tags-list')}>
                                <Button className={cx('tag-item')} title={data.name} />
                                <Button className={cx('tag-item')} title={data.origin_name} />
                            </div>
                        </div>
                    </div>
                    <div className={cx('comment')}>
                        <h3>Khi nào có Bình luận sẽ thêm vào sau</h3>
                    </div>
                    <div className={cx('film-related')}>
                        <MovieContainer
                            className={'small'}
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
                            className={'small'}
                            apis={[
                                'https://phimapi.com/v1/api/tim-kiem?keyword=moi&limit=5',
                                'https://phimapi.com/v1/api/tim-kiem?keyword=2024&limit=5',
                            ]}
                            displayType={'slider'}
                            sliderTitle={'PHIM ĐỀ CỬ MỚI'}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Infor;
