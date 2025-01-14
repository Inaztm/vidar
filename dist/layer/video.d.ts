import { VisualSourceOptions } from './visual-source';
import { AudioSourceOptions } from './audio-source';
declare type VideoOptions = VisualSourceOptions & AudioSourceOptions;
declare const Video_base: new (...args: unknown[]) => import("./audio-source").AudioSource;
/**
 * @extends module:layer~Media
 */
declare class Video extends Video_base {
}
export { Video, VideoOptions };
