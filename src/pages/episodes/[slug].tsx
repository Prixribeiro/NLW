import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { api } from '../../services/api';
import {format, parseISO} from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';
import styles from '../episodes/episode.module.scss';
import Image from 'next/image';

type Episode = {
    id:string;
    title:string;
    thumbnail: string;
    description: string;
    members:string;
    duration:number;
    durationAsString: string;
    url: string;
    publishedAt: string;
};

type EpisodeProps = {
    episode: Episode;
}

export default function Episode({ episode }: EpisodeProps){
    return (
        <div className={styles.episode}>
            <div className={styles.thumbnailContainer}>
                <Link href="/">
                    <button type='button'>
                        <img src='/arrow-left.svg' alt='Voltar' />
                    </button>
                </Link>
                <Image 
                    width={700}
                    height={160}
                    src={episode.thumbnail}
                    objectFit='cover'
                />
                <button type='button'>
                    <img src='/play.svg' alt='Ouvir episódio' />
                </button>
            </div>
            <header>
                <h1>{episode.title}</h1>
                <span>{episode.members}</span>
                <span>{episode.publishedAt}</span>
                <span>{episode.durationAsString}</span>
            </header>

            <div 
                className={styles.description} 
                dangerouslySetInnerHTML={{__html:episode.description}} // para forçar o React a ler esse objeto como HTML
            />
        </div>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    const {data} = await api.get ('episodes', {
        params: {                 // passando alguns parametros/filtros para API:
          _limit:2,             //_limit=2(limite de 2 objetos por página)
          _sort:'published_at', //_sort=published_at(selecionados por publicação)
          _order:'desc'         //_order=desc(por ordem decrescente)
        }
      })
    
    const paths = data.map(episode =>{
        return {
            params: {
                slug: episode.id
            }
        }
    })

    return {
        paths ,
        fallback: 'blocking'
    }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
    const {slug} = ctx.params;

    const {data} = await api.get(`/episodes/${slug}`)

    const episode = {
        id: data.id,
        title: data.title,
        thumbnail: data.thumbnail,
        members: data.members,
        publishedAt: format(parseISO(data.published_at), 'd MMM yy' , {locale: ptBR}),
        duration: Number(data.file.duration),
        durationAsString: convertDurationToTimeString(Number(data.file.duration)),
        description: data.description,
        url: data.file.url,
  
      };

    return {
        props:{
            episode,
        },
        revalidate: 60 * 60 * 24, // 24horas
    }
}