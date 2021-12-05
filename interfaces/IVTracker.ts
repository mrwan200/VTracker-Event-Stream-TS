import { Interface } from 'readline'; 
import {
    thumbnailResolution,
    playability,
    visibility,
    status,
    type
} from '../enums/VTrackerEnums'

interface IVTrackerThumbnail {
    default:	    string
    mqdefault:	    string
    hqdefault:	    string
    sddefault:	    string
    maxresdefault:	string
}

interface IVTrackerVideoEventStream {
    // Public variables
    stream: number;
    token: string;
    resume: string;
    entity: boolean;

    // Private properties
    _started: boolean;
    _stopping: boolean;
    _reader: Interface;

    start(): void;
    stop(): void;
}

interface IVTrackerParams {
    stream: number;
    token: string;
    resume: string;
    entity: boolean;
    rules: string;
}

interface IVtrackerResponseChannel {
    id:	string
    platform: object
    title: string
    description: string
    keywords: Array<string>

    visibility: visibility
    customUrl:	string
    country:	string

    avatar:	string
    banner:	string
    externalUrls: Array<string>

    viewCount: BigInt
    videoCount:	BigInt
    subscriberCount: BigInt

    isArtist:	boolean
    isVerified:	boolean
    joined:     string
    createdAt:	string
    updatedAt:	string
}

interface IVtrackerResponseVideo {
    id: string;
    title: string
    descerption: string;
    keywords: Array<string>;
    hashtags: Array<string>;

    gameId: string;
    duration: string;

    viewCount: number;
    publishedAt: string;
    createdAt: string;
    updatedAt: string;
    channelId: string;

    thumbnailResolution: thumbnailResolution;
    thumbnails: IVTrackerThumbnail;

    visibility: visibility;
    playability: playability;

    isMemberOnly: boolean;
    status: status;
    type: type;

    allowRating: boolean;
    averageRating: number;
    likeCount: number;
    dislikeCount: number;
    commentCount: number;
    concurrentViewers: number;
    broadcastStartAt: string;
    broadcastEndAt: string;
}

export {
    IVTrackerParams,
    IVTrackerVideoEventStream,
    IVtrackerResponseVideo,
    IVtrackerResponseChannel
}