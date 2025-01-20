export class KokoroTTS {
    /**
     * Load a KokoroTTS model from the Hugging Face Hub.
     * @param {string} model_id The model id
     * @param {Object} options Additional options
     * @param {"fp32"|"fp16"|"q8"|"q4"|"q4f16"} [options.dtype="fp32"] The data type to use.
     * @param {"wasm"|"webgpu"|"cpu"|null} [options.device=null] The device to run the model on.
     * @param {import("@huggingface/transformers").ProgressCallback} [options.progress_callback=null] A callback function that is called with progress information.
     * @returns {Promise<KokoroTTS>} The loaded model
     */
    static from_pretrained(model_id: string, { dtype, device, progress_callback }?: {
        dtype?: "fp32" | "fp16" | "q8" | "q4" | "q4f16";
        device?: "wasm" | "webgpu" | "cpu" | null;
        progress_callback?: import("@huggingface/transformers").ProgressCallback;
    }): Promise<KokoroTTS>;
    /**
     * Create a new KokoroTTS instance.
     * @param {import('@huggingface/transformers').StyleTextToSpeech2Model} model The model
     * @param {import('@huggingface/transformers').PreTrainedTokenizer} tokenizer The tokenizer
     */
    constructor(model: import("@huggingface/transformers").StyleTextToSpeech2Model, tokenizer: import("@huggingface/transformers").PreTrainedTokenizer);
    model: StyleTextToSpeech2Model;
    tokenizer: import("@huggingface/transformers").PreTrainedTokenizer;
    get voices(): Readonly<{
        af: {
            name: string;
            language: string;
            gender: string;
        };
        af_bella: {
            name: string;
            language: string;
            gender: string;
        };
        af_nicole: {
            name: string;
            language: string;
            gender: string;
        };
        af_sarah: {
            name: string;
            language: string;
            gender: string;
        };
        af_sky: {
            name: string;
            language: string;
            gender: string;
        };
        am_adam: {
            name: string;
            language: string;
            gender: string;
        };
        am_michael: {
            name: string;
            language: string;
            gender: string;
        };
        bf_emma: {
            name: string;
            language: string;
            gender: string;
        };
        bf_isabella: {
            name: string;
            language: string;
            gender: string;
        };
        bm_george: {
            name: string;
            language: string;
            gender: string;
        };
        bm_lewis: {
            name: string;
            language: string;
            gender: string;
        };
    }>;
    list_voices(): void;
    /**
     * Generate audio from text.
     *
     * Note: The model will be loaded on the first call, and subsequent calls will use the same model.
     * @param {string} text The input text
     * @param {Object} options Additional options
     * @param {keyof typeof VOICES} [options.voice="af"] The voice style to use
     * @param {number} [options.speed=1] The speaking speed
     * @returns {Promise<RawAudio>} The generated audio
     */
    generate(text: string, { voice, speed }?: {
        voice?: keyof typeof VOICES;
        speed?: number;
    }): Promise<RawAudio>;
}
import { StyleTextToSpeech2Model } from "@huggingface/transformers";
import { VOICES } from "./voices.js";
import { RawAudio } from "@huggingface/transformers";
//# sourceMappingURL=kokoro.d.ts.map