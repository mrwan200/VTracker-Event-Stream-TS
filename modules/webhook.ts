import { IVtrackerResponseVideo, IVtrackerResponseChannel } from "../interfaces/IVTracker";
import { type, status } from "../enums/VTrackerEnums";
import config from '../config/config.json';
import dayjs from "dayjs";
import axios from "axios";

class WebhookDiscord {
    private stream: string;
    private upload: string;

    constructor() {
        Object.assign(this, {
            upload: config.webhook.upload,
            stream: config.webhook.stream,
        })
    }

    send(video: IVtrackerResponseVideo, channel: IVtrackerResponseChannel) {
        const embed = this._createEmbed(video, channel);
        
        if(video.type === type.live) 
            this._send(this.stream, embed);
        else
            this._send(this.upload, embed);
    }

    private _send(url: string, embed: object) {
        axios.post(url, {
            embeds: [embed]
        }).catch(err => { 
            if(err.response.status === 429){
                const retry = err.response.headers['retry-after'];
                console.log(`[Webhook] Retry after ${retry} seconds`);
                setTimeout(() => {
                    this._send(url, embed);
                }, retry);
            }
        })
    }

    private _createEmbed(video: IVtrackerResponseVideo, channel: IVtrackerResponseChannel) { 
        let embed = {
            author: {
                name: channel.title,
                url: `https://www.youtube.com/channel/${channel.id}`,
                icon: channel.avatar
            },
            title: video.title,
            url: `https://www.youtube.com/watch?v=${video.id}`,
            thumbnail: {
                url: video.thumbnails[video.thumbnailResolution]
            },
            timestamp: dayjs.utc().toISOString(),
            color: (video.status === status.published || video.status === status.ongoing) && 
                    (video.type === type.live || 
                    video.type === type.upload || 
                    video.type === type.premiere) ? 16711680 : 2631720,
            description: null,
            fields: []
        }
        
        let suffix_description = {
            "description_suffix": null,
            "fields": null,
            "datetime": null
        }; // IDK. how to set name 😣

        if((video.status === status.published && (video.type === type.upload || video.type == type.live || video.type === type.premiere))) {
           suffix_description.description_suffix = `ได้อัพโหลดวีดีโอ`;
           suffix_description.fields = `อัพโหลดเมื่อ`;
           suffix_description.datetime = video.publishedAt;

        }else if(video.status === status.ongoing && video.type === type.premiere){
           suffix_description.description_suffix = `ได้เริ่มเปิดตัวคลิป`;
           suffix_description.fields = `เริ่มเปิดตัวคลิปเมื่อ`;
           suffix_description.datetime = video.broadcastStartAt

        }else if(video.status === status.ongoing && video.type === type.live){
           suffix_description.description_suffix = `ได้เริ่มถ่ายทอดสด`;
           suffix_description.fields = `เริ่มถ่ายทอดสดเวลา`;
           suffix_description.datetime = video.broadcastStartAt

        }else if(video.status === status.upcoming && video.type === type.live){
           suffix_description.description_suffix = `ได้แอบตั้งการถ่ายทอดสด`;
           suffix_description.fields = `"เริ่มถ่ายทอดสดเวลา`;
           suffix_description.datetime = video.broadcastStartAt

        }else if(video.status === status.upcoming && video.type === type.premiere){
           suffix_description.description_suffix = `ได้แอบตั้งการเริ่มเปิดคลิป`;
           suffix_description.fields = `เริ่มเปิดตัวคลิปเวลา`;
           suffix_description.datetime = video.broadcastStartAt
        }

        embed.fields.push({
            name: suffix_description.fields,
            value: dayjs(suffix_description.datetime).format("DD MMMM YYYY HH:mm:ss"),
            inline: true
        })

        embed.description = (`${channel.title} ${suffix_description.description_suffix}`);

        return embed;
    }
}

export default new WebhookDiscord();