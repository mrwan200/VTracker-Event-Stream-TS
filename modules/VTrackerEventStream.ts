import { default as axios } from 'axios';
import { EventEmitter } from 'events';
import { Interface, createInterface } from 'readline';
import { IVTrackerParams, IVTrackerVideoEventStream } from '../interfaces/IVTracker'

class VTrackerVideoEventStream extends EventEmitter implements IVTrackerVideoEventStream{
    /*
        VTracker Video Event Stream V. 1.0.0(?) TypeScript

        Developed by: Illyaz
        Javascript to Typescript converter: M-307
    */
    
    // Public variables
    stream: number;
    token: string;
    resume: string;
    entity: boolean;

    // Private properties
    _started: boolean;
    _stopping: boolean;
    _reader: Interface;

    constructor({stream, token, resume, entity}) {
        // Extend EventEmitter
        super();

        // this.stream = stream;
        // this.token = token;
        // this.resume = resume;
        // this.entity = entity;

        Object.assign(this, {
            stream,
            token,
            resume,
            entity
        })

        this._started = false;
        this._stopping = false;
        this._reader;
    }

    private async _connect() {
        let isError = false;
        try {
            const params = {} as IVTrackerParams;

            let url = `https://api.vtracker.app/v2/videos/youtube/streams/`;
            if (this.resume !== undefined)
                params.resume = this.resume;

            if (this.entity)
                params.entity = true;

            if(Array.isArray(this.stream)) {
                params.rules = JSON.stringify(this.stream);
                url += 'combinations'
            }else
                url += this.stream;
            
            const res = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                },
                responseType: 'stream',
                params
            });

            this._reader = createInterface({input: res.data})
            this._reader.on('close', () => {
                res.data.destroy();
                this._started = false;
                this._stopping = false;
            });

            for await (const line of this._reader) {
                const json = JSON.parse(line)
                switch (json.type) {
                    case 'init':
                        this.emit('init', json.data)
                        break;
                    case 'event':
                        this.emit('event', json.data)
                        this.resume = json.data.eventId;
                        break;
                    case 'ping':
                        this.emit('ping')
                        break;
                    case 'close':
                        this.emit('close', json.reason);
                        isError = true;
                        break;
                }
            }
        } catch (e) {
            try {
                isError = true;
                const {response} = e;
                if (response) {
                    const error = JSON.parse(response.data.read().toString());
                    const err = new Error(`[${error.statusCode}] ${error.message}`);
                    err.message = e;
                    this._onError(err);
                } else
                    this._onError(e);
            } catch {
                this._onError(e);
            }
        } finally {
            if (!this._stopping && isError)
                setTimeout(() => this._connect(), 5000)
        }
    }

    private async _onError(e) {
        this.emit('error', e);
    }

    start() {
        if (this._started)
            throw new Error(`don't call 'start' twice`);

        this._stopping = false;
        this._connect();
    }

    stop() {
        if (this._stopping)
            throw new Error(`don't call 'stop' twice`);

        this._stopping = true;
        this._reader.close();
    }
}

export default VTrackerVideoEventStream;